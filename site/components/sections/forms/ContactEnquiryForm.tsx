"use client";

import { useId, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { T, PAD } from "@/components/ui/type";
import { CheckboxField, InputField, SelectField, TextAreaField, useValidatedForm, type FieldRule } from "./fields";
import { FormConfirmation } from "./FormConfirmation";

export type ContactEnquiryFormProps = {
  title: string;
  body: string;
  /** Enquiry type select options (not drawn: the five route titles) */
  enquiryTypes: string[];
  /** Opt-in checkbox label */
  optIn: string;
  submitLabel: string;
  successMessage: string;
  headingLevel?: "h2" | "h3";
  id?: string;
};

/* Only the Email field is validated (contact.md §3). No asterisks are drawn. */
const RULES: FieldRule[] = [
  {
    name: "email",
    kind: "email",
    required: true,
    missing: "Enter your email address",
    invalid: "Enter an email address in the correct format, like name@example.com",
  },
];

/**
 * B41 ContactEnquiryForm (CONTACT §3 "Send us a message"). Surface band, 80/80 padding,
 * two equal columns 64px apart at 1024+, stacked below. Bold 36 heading + 17/1.5 muted body on
 * the left; the "contact" field family on the right (16px gaps) and a dark Submit.
 * First/last name stack at 390 and sit side by side from 768. Submit is full width at 390.
 */
export function ContactEnquiryForm({
  title,
  body,
  enquiryTypes,
  optIn,
  submitLabel,
  successMessage,
  headingLevel: H = "h2",
  id,
}: ContactEnquiryFormProps) {
  const headingId = useId();
  const [sent, setSent] = useState(false);
  const { errors, onSubmit, onChange } = useValidatedForm(RULES, () => setSent(true));

  return (
    <Section
      id={id}
      bg="surface"
      className={PAD.data}
      containerClassName="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16"
    >
      <div className="flex flex-col gap-2.5">
        <H id={headingId} className={`${T.h36b} lg:leading-[1.18]`}>
          {title}
        </H>
        <p className="text-[16px] leading-[1.5] text-muted-surface lg:text-[17px]">{body}</p>
      </div>
      {sent ? (
        <FormConfirmation message={successMessage} onReset={() => setSent(false)} />
      ) : (
        <form noValidate aria-labelledby={headingId} onSubmit={onSubmit} onChange={onChange} className="flex min-w-0 flex-col gap-4">
          <SelectField family="contact" name="enquiryType" label="Enquiry type" placeholder="Select an enquiry type" options={enquiryTypes} />
          <div className="grid gap-4 md:grid-cols-2">
            <InputField family="contact" name="firstName" label="First name" autoComplete="given-name" />
            <InputField family="contact" name="lastName" label="Last name" autoComplete="family-name" />
          </div>
          <InputField family="contact" name="email" type="email" label="Email" autoComplete="email" required error={errors.email} />
          <InputField family="contact" name="company" label="Company" autoComplete="organization" />
          <TextAreaField family="contact" name="message" label="Message" />
          <CheckboxField family="contact" name="optIn" label={optIn} />
          <div className="flex">
            <Button type="submit" variant="dark" className="w-full px-8 md:w-auto">
              {submitLabel}
            </Button>
          </div>
        </form>
      )}
    </Section>
  );
}
