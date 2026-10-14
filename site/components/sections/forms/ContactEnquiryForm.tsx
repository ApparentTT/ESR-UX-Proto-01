"use client";

import { useId, useEffect, useRef } from "react";
import { Section } from "@/components/ui/Section";
import { T, PAD } from "@/components/ui/type";
import { CheckboxField, InputField, SelectField, TextAreaField, useValidatedForm, type FieldRule } from "./fields";
import { EnquirySuccess, ErrorSummary, SubmitButton, useEnquiryStatus } from "./FormConfirmation";
import { EMAIL_INVALID, type EnquirySuccessCopy } from "./formPresets";

export type ContactEnquiryFormProps = {
  title: string;
  body: string;
  /** Enquiry type select options (not drawn: the five route titles). Omit for no select (InvestorEnquiryForm). */
  enquiryTypes?: string[];
  /** Company field (default shown; the drawn InvestorEnquiryForm has none) */
  company?: boolean;
  /** Opt-in checkbox label. Omit for no checkbox. */
  optIn?: string;
  submitLabel: string;
  /** Success card copy (Figma "Enquiry form — states") */
  success: EnquirySuccessCopy;
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
    invalid: EMAIL_INVALID,
  },
];

/**
 * B41 ContactEnquiryForm (CONTACT §3 "Send us a message"), also the drawn InvestorEnquiryForm (fund detail,
 * without the enquiry type, company and opt-in). Surface band, 80/80 padding, two equal columns 64px apart
 * at 1024+, stacked below, copy top-aligned. Bold 36 heading + 17/1.5 muted body on the left; the "contact"
 * field family on the right (16px gaps) and a dark Submit. First/last name stack at 390 and sit side by side
 * from 768. Submit is full width at 390. States as drawn (Figma 1265:30373): error summary under the body,
 * ~1.2s "Sending" (fields disabled, aria-busy), then the success card in place of the whole row.
 */
export function ContactEnquiryForm({
  title,
  body,
  enquiryTypes,
  company = true,
  optIn,
  submitLabel,
  success,
  headingLevel: H = "h2",
  id,
}: ContactEnquiryFormProps) {
  const headingId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const { status, send, reset } = useEnquiryStatus();
  const sending = status === "sending";
  const { errors, onSubmit, onChange, resetErrors } = useValidatedForm(RULES, () => {
    // Keep focus on Submit while the fields are disabled; the success heading takes it next.
    formRef.current?.querySelector<HTMLElement>("[type=submit]")?.focus();
    send();
  });

  // "Send another enquiry" brings the empty form back with focus on its first field.
  const refocus = useRef(false);
  useEffect(() => {
    if (status !== "idle" || !refocus.current) return;
    refocus.current = false;
    formRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
  }, [status]);
  const startAgain = () => {
    refocus.current = true;
    resetErrors();
    reset();
  };

  return (
    <Section
      id={id}
      bg="surface"
      className={PAD.data}
      containerClassName="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16"
    >
      {status === "sent" ? (
        <EnquirySuccess copy={success} onReset={startAgain} headingLevel={H} className="lg:col-span-2" />
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            <H id={headingId} className={`${T.h36b} lg:leading-[1.18]`}>
              {title}
            </H>
            <p className="text-[16px] leading-[1.5] text-muted-surface lg:text-[17px]">{body}</p>
            <ErrorSummary count={Object.keys(errors).length} />
          </div>
          <form
            ref={formRef}
            noValidate
            aria-labelledby={headingId}
            aria-busy={sending || undefined}
            onSubmit={(e) => (sending ? e.preventDefault() : onSubmit(e))}
            onChange={onChange}
            className="flex min-w-0 flex-col gap-4"
          >
            <fieldset disabled={sending} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
              {enquiryTypes && (
                <SelectField family="contact" name="enquiryType" label="Enquiry type" placeholder="Select an enquiry type" options={enquiryTypes} />
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <InputField family="contact" name="firstName" label="First name" autoComplete="given-name" />
                <InputField family="contact" name="lastName" label="Last name" autoComplete="family-name" />
              </div>
              <InputField family="contact" name="email" type="email" label="Email" autoComplete="email" required error={errors.email} />
              {company && <InputField family="contact" name="company" label="Company" autoComplete="organization" />}
              <TextAreaField family="contact" name="message" label="Message" />
              {optIn && <CheckboxField family="contact" name="optIn" label={optIn} />}
            </fieldset>
            <div className="flex">
              <SubmitButton sending={sending} label={submitLabel} variant="dark" className="w-full px-8 md:w-auto" />
            </div>
          </form>
        </>
      )}
    </Section>
  );
}
