"use client";

import { useId, useEffect, useRef } from "react";
import { Section } from "@/components/ui/Section";
import { T, PAD } from "@/components/ui/type";
import { CheckboxField, InputField, RadioGroupField, SelectField, useValidatedForm, type FieldRule } from "./fields";
import { EnquirySuccess, ErrorSummary, SubmitButton, useEnquiryStatus } from "./FormConfirmation";
import { EMAIL_INVALID, FORM_FIELD_COPY as COPY } from "./formPresets";
import { JOB_ALERTS_FORM as F } from "@/data/site/pages/job-alerts";

/* Email (validated) and the consent box are required; the rest are optional, as on a newsletter sign-up. */
const RULES: FieldRule[] = [
  { name: "email", kind: "email", required: true, missing: "Enter your email address", invalid: EMAIL_INVALID },
  { name: "consent", kind: "checkbox", required: true, missing: "Tick the box to agree before you sign up" },
];

/**
 * Job alerts sign-up (/about/careers/job-alerts). Not drawn: the FormBlock (B18) layout and "form" field family,
 * on the grey form band. Medium 40 heading + 18/28 body on the left, the form on the right (two equal columns,
 * 30px gap), stacked below 1024; first/last name side by side from 768. Fields: names, Email, Market and Area
 * of interest selects (side by side from 768), Frequency radios, consent. The shared enquiry states: error
 * summary under the intro, ~1.2s "Sending", then the success card in place of the row. Nothing is sent.
 */
export function JobAlertsForm({ id }: { id?: string }) {
  const headingId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const { status, send, reset } = useEnquiryStatus();
  const sending = status === "sending";
  const { errors, onSubmit, onChange, resetErrors } = useValidatedForm(RULES, () => {
    // Keep focus on Submit while the fields are disabled; the success heading takes it next.
    formRef.current?.querySelector<HTMLElement>("[type=submit]")?.focus();
    send();
  });

  // "Sign up another email address" brings the empty form back with focus on its first field.
  const refocus = useRef(false);
  useEffect(() => {
    if (status !== "idle" || !refocus.current) return;
    refocus.current = false;
    formRef.current?.querySelector<HTMLElement>("input, select")?.focus();
  }, [status]);
  const startAgain = () => {
    refocus.current = true;
    resetErrors();
    reset();
  };

  return (
    <Section id={id} bg="grey" className={PAD.block} containerClassName="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-[30px]">
      {status === "sent" ? (
        <EnquirySuccess copy={F.success} onReset={startAgain} card="white" className="lg:col-span-2" />
      ) : (
        <>
          <div>
            <h2 id={headingId} className={T.h40m}>
              {F.title}
            </h2>
            <p className={`mt-4 lg:mt-5 ${T.bodyLg}`}>{F.body}</p>
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
              <div className="grid gap-8 md:grid-cols-2 md:gap-x-6">
                <InputField name="firstName" label={COPY.firstName.label} placeholder={COPY.firstName.placeholder} autoComplete="given-name" />
                <InputField name="lastName" label={COPY.lastName.label} placeholder={COPY.lastName.placeholder} autoComplete="family-name" />
              </div>
              <InputField
                name="email"
                type="email"
                label={COPY.email.label}
                placeholder={COPY.email.placeholder}
                autoComplete="email"
                required
                error={errors.email}
              />
              <div className="grid gap-8 md:grid-cols-2 md:gap-x-6">
                <SelectField name="market" label={F.market.label} placeholder={F.market.placeholder} options={F.market.options} />
                <SelectField name="area" label={F.area.label} placeholder={F.area.placeholder} options={F.area.options} />
              </div>
              <RadioGroupField name="frequency" label={F.frequency.label} options={F.frequency.options} defaultValue={F.frequency.defaultValue} />
              <CheckboxField name="consent" label={F.consent} required error={errors.consent} />
            </fieldset>
            <div className="flex">
              <SubmitButton sending={sending} label={F.submitLabel} className="w-full md:w-auto" />
            </div>
          </form>
        </>
      )}
    </Section>
  );
}
