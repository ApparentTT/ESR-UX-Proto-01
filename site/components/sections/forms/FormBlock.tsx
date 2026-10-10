"use client";

import { useId, useMemo, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { T, PAD } from "@/components/ui/type";
import { CheckboxField, InputField, SelectField, TextAreaField, useValidatedForm, type FieldRule } from "./fields";
import { FormConfirmation } from "./FormConfirmation";
import {
  CONSENT_COPY,
  COUNTRY_OPTIONS,
  FORM_FIELD_COPY as COPY,
  FORM_PRESETS,
  MESSAGE_MAX,
  type FormBlockVariant,
  type FormFieldKey,
  type FormRequiredKey,
} from "./formPresets";

export type FormBlockProps = {
  /** Picks the wireframe copy, fields, required set and submit label (see formPresets.ts) */
  variant: FormBlockVariant;
  /** Column alignment at desktop. Default from the preset: newsletter "center" (PORT, PROP); pass "start" for DEV. */
  align?: "start" | "center";
  /** Band colour. Default from the preset: "grey" (#ECECEC block), careers "white" (PEOPLE). */
  bg?: "grey" | "white";
  /** Optional overrides of the preset copy */
  title?: string;
  body?: string;
  submitLabel?: string;
  successMessage?: string;
  fields?: FormFieldKey[];
  required?: FormRequiredKey[];
  headingLevel?: "h2" | "h3";
  /** id on the section (e.g. an in-page anchor) */
  id?: string;
};

const MISSING: Record<FormRequiredKey, string> = {
  firstName: "Enter your first name",
  lastName: "Enter your last name",
  email: "Enter your email address",
  country: "Select a country",
  message: "Enter your message",
  consent: "Tick the box to agree before you submit",
};

/**
 * B18 FormBlock: the shared Figma "Form" block (newsletter and enquiry forms).
 * Medium 40 heading + 18/28 body on the left, the form on the right (two equal columns, 30px gap).
 * Stacks below 1024 (heading over form, 32px gap); first/last name stack at 390 and sit side by
 * side from 768; Submit is full width at 390. Client-side validation only, then an inline
 * confirmation replaces the form. Nothing is sent and the page does not navigate.
 */
export function FormBlock({
  variant,
  align,
  bg,
  title,
  body,
  submitLabel,
  successMessage,
  fields,
  required,
  headingLevel: H = "h2",
  id,
}: FormBlockProps) {
  const preset = FORM_PRESETS[variant];
  const headingId = useId();
  const a = align ?? preset.align;
  return (
    <Section
      id={id}
      bg={bg ?? preset.bg}
      className={PAD.block}
      containerClassName={`grid gap-8 lg:grid-cols-2 lg:gap-[30px] ${a === "center" ? "lg:items-center" : "lg:items-start"}`}
    >
      <div>
        <H id={headingId} className={T.h40m}>
          {title ?? preset.title}
        </H>
        <p className={`mt-4 lg:mt-5 ${T.bodyLg}`}>{body ?? preset.body}</p>
      </div>
      <FormBlockForm
        labelledBy={headingId}
        fields={fields ?? preset.fields}
        required={required ?? preset.required}
        submitLabel={submitLabel ?? preset.submitLabel}
        successMessage={successMessage ?? preset.successMessage}
      />
    </Section>
  );
}

function FormBlockForm({
  labelledBy,
  fields,
  required,
  submitLabel,
  successMessage,
}: {
  labelledBy: string;
  fields: FormFieldKey[];
  required: FormRequiredKey[];
  submitLabel: string;
  successMessage: string;
}) {
  const [sent, setSent] = useState(false);
  const has = (k: FormFieldKey) => fields.includes(k);
  const req = (k: FormRequiredKey) => required.includes(k);

  const rules = useMemo<FieldRule[]>(() => {
    const r: FieldRule[] = [];
    if (fields.includes("name")) {
      r.push({ name: "firstName", kind: "text", required: required.includes("firstName"), missing: MISSING.firstName });
      r.push({ name: "lastName", kind: "text", required: required.includes("lastName"), missing: MISSING.lastName });
    }
    if (fields.includes("email"))
      r.push({
        name: "email",
        kind: "email",
        required: required.includes("email"),
        missing: MISSING.email,
        invalid: "Enter an email address in the correct format, like name@example.com",
      });
    if (fields.includes("country")) r.push({ name: "country", kind: "select", required: required.includes("country"), missing: MISSING.country });
    if (fields.includes("message")) r.push({ name: "message", kind: "text", required: required.includes("message"), missing: MISSING.message });
    if (fields.includes("consent")) r.push({ name: "consent", kind: "checkbox", required: required.includes("consent"), missing: MISSING.consent });
    return r;
  }, [fields, required]);

  const { errors, onSubmit, onChange } = useValidatedForm(rules, () => setSent(true));

  if (sent) return <FormConfirmation message={successMessage} onReset={() => setSent(false)} />;

  return (
    <form noValidate aria-labelledby={labelledBy} onSubmit={onSubmit} onChange={onChange} className="flex min-w-0 flex-col gap-8">
      {has("name") && (
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-6">
          <InputField
            name="firstName"
            label={COPY.firstName.label}
            placeholder={COPY.firstName.placeholder}
            autoComplete="given-name"
            required={req("firstName")}
            error={errors.firstName}
          />
          <InputField
            name="lastName"
            label={COPY.lastName.label}
            placeholder={COPY.lastName.placeholder}
            autoComplete="family-name"
            required={req("lastName")}
            error={errors.lastName}
          />
        </div>
      )}
      {has("email") && (
        <InputField
          name="email"
          type="email"
          label={COPY.email.label}
          placeholder={COPY.email.placeholder}
          autoComplete="email"
          required={req("email")}
          error={errors.email}
        />
      )}
      {has("country") && (
        <SelectField
          name="country"
          label={COPY.country.label}
          placeholder={COPY.country.placeholder}
          options={COUNTRY_OPTIONS}
          required={req("country")}
          error={errors.country}
        />
      )}
      {has("message") && (
        <TextAreaField
          name="message"
          label={COPY.message.label}
          placeholder={COPY.message.placeholder}
          maxLength={MESSAGE_MAX}
          required={req("message")}
          error={errors.message}
        />
      )}
      {has("consent") && (
        /* The drawn row is 72px tall, which leaves extra space above Submit */
        <CheckboxField name="consent" label={CONSENT_COPY} required={req("consent")} error={errors.consent} className="lg:min-h-[72px]" />
      )}
      <div className="flex">
        <Button type="submit" className="w-full md:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
