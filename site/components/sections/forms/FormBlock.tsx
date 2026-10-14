"use client";

import { useId, useMemo, useEffect, useRef } from "react";
import { Section } from "@/components/ui/Section";
import { T, PAD } from "@/components/ui/type";
import { CheckboxField, InputField, SelectField, TextAreaField, useValidatedForm, type FieldRule } from "./fields";
import { EnquirySuccess, ErrorSummary, SubmitButton, useEnquiryStatus } from "./FormConfirmation";
import {
  CONSENT_COPY,
  COUNTRY_OPTIONS,
  EMAIL_INVALID,
  FORM_FIELD_COPY as COPY,
  FORM_PRESETS,
  MESSAGE_MAX,
  type EnquirySuccessCopy,
  type FormBlockVariant,
  type FormFieldKey,
  type FormRequiredKey,
} from "./formPresets";

export type FormBlockProps = {
  /** Picks the wireframe copy, fields, required set and submit label (see formPresets.ts) */
  variant: FormBlockVariant;
  /** Column alignment at desktop. Every preset is "start": the copy is top-aligned beside the form. */
  align?: "start" | "center";
  /** Band colour. Default from the preset: "grey" (#ECECEC block), careers "white" (PEOPLE). */
  bg?: "grey" | "white";
  /** Optional overrides of the preset copy */
  title?: string;
  body?: string;
  submitLabel?: string;
  success?: EnquirySuccessCopy;
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
 * side from 768; Submit is full width at 390. Client-side validation only, with the shared enquiry
 * states (Figma 1265:30373): an error summary under the intro copy, a ~1.2s "Sending" state (form disabled,
 * aria-busy), then the success card in place of the whole row. Nothing is sent and the page does not navigate.
 */
export function FormBlock({
  variant,
  align,
  bg,
  title,
  body,
  submitLabel,
  success,
  fields: fieldsProp,
  required: requiredProp,
  headingLevel: H = "h2",
  id,
}: FormBlockProps) {
  const preset = FORM_PRESETS[variant];
  const headingId = useId();
  const a = align ?? preset.align;
  const band = bg ?? preset.bg;
  const fields = fieldsProp ?? preset.fields;
  const required = requiredProp ?? preset.required;
  const has = (k: FormFieldKey) => fields.includes(k);
  const req = (k: FormRequiredKey) => required.includes(k);

  const rules = useMemo<FieldRule[]>(() => {
    const r: FieldRule[] = [];
    if (fields.includes("name")) {
      r.push({ name: "firstName", kind: "text", required: required.includes("firstName"), missing: MISSING.firstName });
      r.push({ name: "lastName", kind: "text", required: required.includes("lastName"), missing: MISSING.lastName });
    }
    if (fields.includes("email"))
      r.push({ name: "email", kind: "email", required: required.includes("email"), missing: MISSING.email, invalid: EMAIL_INVALID });
    if (fields.includes("country")) r.push({ name: "country", kind: "select", required: required.includes("country"), missing: MISSING.country });
    if (fields.includes("message")) r.push({ name: "message", kind: "text", required: required.includes("message"), missing: MISSING.message });
    if (fields.includes("consent")) r.push({ name: "consent", kind: "checkbox", required: required.includes("consent"), missing: MISSING.consent });
    return r;
  }, [fields, required]);

  const formRef = useRef<HTMLFormElement>(null);
  const { status, send, reset } = useEnquiryStatus();
  const sending = status === "sending";
  const { errors, onSubmit, onChange, resetErrors } = useValidatedForm(rules, () => {
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
      bg={band}
      className={PAD.block}
      containerClassName={`grid gap-8 lg:grid-cols-2 lg:gap-[30px] ${a === "center" ? "lg:items-center" : "lg:items-start"}`}
    >
      {status === "sent" ? (
        <EnquirySuccess
          copy={success ?? preset.success}
          onReset={startAgain}
          headingLevel={H}
          card={band === "grey" ? "white" : "clear"}
          className="lg:col-span-2"
        />
      ) : (
        <>
          <div>
            <H id={headingId} className={T.h40m}>
              {title ?? preset.title}
            </H>
            <p className={`mt-4 lg:mt-5 ${T.bodyLg}`}>{body ?? preset.body}</p>
            <ErrorSummary count={Object.keys(errors).length} className="mt-4 lg:mt-5" />
          </div>
          <form
            ref={formRef}
            noValidate
            aria-labelledby={headingId}
            aria-busy={sending || undefined}
            onSubmit={(e) => (sending ? e.preventDefault() : onSubmit(e))}
            onChange={onChange}
            className="flex min-w-0 flex-col gap-8"
          >
            <fieldset disabled={sending} className="m-0 flex min-w-0 flex-col gap-8 border-0 p-0">
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
            </fieldset>
            <div className="flex">
              <SubmitButton sending={sending} label={submitLabel ?? preset.submitLabel} className="w-full md:w-auto" />
            </div>
          </form>
        </>
      )}
    </Section>
  );
}
