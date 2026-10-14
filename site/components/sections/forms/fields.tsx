"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Validating field controls for the prototype forms (inventory A8), shared by FormBlock (B18)
 * and ContactEnquiryForm (B41). The ui/FormControls primitives have no error state, so these
 * mirror their two families and add one:
 * - "form": labels Medium 14 body, 48px inputs, 1px ink border, radius 10, textarea 160 + counter
 * - "contact": labels Regular 13 muted, 46px inputs (52px select), 1px line border, radius 6
 * Errors follow the drawn enquiry error state (Figma 1265:33788): label in the error red, a 1.5px red border
 * (1px border + 0.5px inset shadow, no layout shift) on the error-bg fill with an "error" icon at the right,
 * and a 13/1.48 red message with an icon under the field, wired with aria-invalid / aria-describedby.
 */
export type FieldFamily = "form" | "contact";

const LABEL: Record<FieldFamily, string> = {
  form: "text-[14px] font-medium leading-5 text-body",
  /* muted-surface: #6B7280 is just under 4.5:1 on the surface grey */
  contact: "text-[13px] leading-[1.5] text-muted-surface",
};

const CONTROL: Record<FieldFamily, string> = {
  form: "w-full rounded-[10px] border px-3 text-[14px] leading-5 text-ink placeholder:text-muted",
  contact: "w-full rounded-btn border px-3.5 text-[15px] leading-[1.45] text-ink placeholder:text-muted",
};
const FOCUS = "focus:outline-2 focus:outline-offset-2 focus:outline-ink";
const INVALID = "border-error bg-error-bg shadow-[inset_0_0_0_0.5px_var(--color-error)]";

function controlCls(family: FieldFamily, invalid: boolean) {
  return `${CONTROL[family]} ${FOCUS} ${invalid ? INVALID : family === "contact" ? "bg-white border-line hover:border-[#9CA3AF]" : "bg-white border-ink"}`;
}

function labelCls(family: FieldFamily, invalid: boolean) {
  return invalid ? `${LABEL[family].replace(/text-(body|muted-surface)/, "")} text-error` : LABEL[family];
}

/** The drawn 18px "error" icon inside an invalid control (decorative: the message carries the text) */
function ErrorMark({ pos = "right-3.5 top-1/2 -translate-y-1/2" }: { pos?: string }) {
  return <Icon name="error" size={18} className={`pointer-events-none absolute text-error ${pos}`} />;
}

export function FieldError({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <p id={id} className={`anim-pop flex items-start gap-1.5 pt-0.5 text-[13px] leading-[1.48] text-error ${className}`}>
      <Icon name="error" size={15} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

type BaseProps = {
  label: string;
  name: string;
  family?: FieldFamily;
  error?: string;
  required?: boolean;
  className?: string;
};

export function InputField({
  label,
  name,
  family = "form",
  error,
  required,
  className = "",
  type = "text",
  placeholder,
  autoComplete,
}: BaseProps & { type?: "text" | "email"; placeholder?: string; autoComplete?: string }) {
  const id = useId();
  const errId = `${id}-error`;
  return (
    <div className={`flex flex-col ${family === "form" ? "gap-1" : "gap-1.5"} ${className}`}>
      <label htmlFor={id} className={labelCls(family, !!error)}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          spellCheck={type === "email" ? false : undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={`${controlCls(family, !!error)} block ${family === "form" ? "h-12" : "h-[46px]"} ${error ? "pr-10" : ""}`}
        />
        {error && <ErrorMark />}
      </div>
      {error && <FieldError id={errId}>{error}</FieldError>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  family = "form",
  error,
  required,
  className = "",
  placeholder,
  options,
}: BaseProps & { placeholder: string; options: string[] }) {
  const id = useId();
  const errId = `${id}-error`;
  const [value, setValue] = useState("");
  return (
    <div className={`flex flex-col ${family === "form" ? "gap-1" : "gap-1.5"} ${className}`}>
      <label htmlFor={id} className={labelCls(family, !!error)}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          className={`${controlCls(family, !!error)} cursor-pointer appearance-none ${family === "form" ? "h-12" : "h-[52px] pl-3.5"} ${
            error ? "pr-[72px]" : family === "form" ? "pr-10" : "pr-11"
          } ${value ? "text-ink" : "text-muted"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
        {error && <ErrorMark pos="right-10 top-1/2 -translate-y-1/2" />}
        <Icon
          name="keyboard_arrow_down"
          size={20}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${family === "form" ? "right-3 text-ink" : "right-3 text-muted"}`}
        />
      </div>
      {error && <FieldError id={errId}>{error}</FieldError>}
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  family = "form",
  error,
  required,
  className = "",
  placeholder,
  maxLength,
  counter = family === "form",
}: BaseProps & { placeholder?: string; maxLength?: number; counter?: boolean }) {
  const id = useId();
  const errId = `${id}-error`;
  const countId = `${id}-count`;
  const [len, setLen] = useState(0);
  const describedBy = [error ? errId : "", counter && maxLength ? countId : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`flex flex-col ${family === "form" ? "gap-1" : "gap-1.5"} ${className}`}>
      <label htmlFor={id} className={labelCls(family, !!error)}>
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          name={name}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => setLen(e.target.value.length)}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${controlCls(family, !!error)} block resize-none ${family === "form" ? "h-40 pb-7 pt-3.5" : "h-[120px] py-3"} ${error ? "pr-10" : ""}`}
        />
        {error && <ErrorMark pos="right-3.5 top-3.5" />}
        {counter && maxLength && (
          <span id={countId} className="pointer-events-none absolute bottom-1.5 left-3 text-[11px] leading-5 text-muted">
            {len} / {maxLength}
          </span>
        )}
      </div>
      {error && <FieldError id={errId}>{error}</FieldError>}
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  family = "form",
  error,
  required,
  className = "",
}: Omit<BaseProps, "label"> & { label: React.ReactNode }) {
  const id = useId();
  const errId = `${id}-error`;
  const form = family === "form";
  return (
    <div className={className}>
      {/* The whole row is the label, so clicking the consent text toggles the box. */}
      <label htmlFor={id} className={`flex cursor-pointer items-start ${form ? "gap-6" : "gap-2.5"}`}>
        <span className="relative mt-px inline-flex shrink-0">
          <input
            id={id}
            type="checkbox"
            name={name}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            className={`peer cursor-pointer appearance-none border checked:border-ink checked:bg-ink ${FOCUS} ${form ? "size-5 rounded-[3px]" : "size-[18px] rounded-[4px]"} ${
              error ? INVALID : form ? "border-ink bg-white" : "border-line bg-white hover:border-[#9CA3AF]"
            }`}
          />
          <span
            aria-hidden="true"
            className="icon pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex"
            style={{ fontSize: form ? 16 : 14, width: "100%", height: "100%" }}
          >
            check
          </span>
        </span>
        <span className={form ? "text-[14px] font-medium leading-5 text-body" : "text-[13px] leading-[1.5] text-muted-surface"}>{label}</span>
      </label>
      {error && (
        <FieldError id={errId} className={`pt-1.5 ${form ? "pl-11" : "pl-7"}`}>
          {error}
        </FieldError>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ validation */

export type FieldRule = {
  name: string;
  kind: "text" | "email" | "select" | "checkbox";
  required: boolean;
  /** Shown when a required field is empty */
  missing: string;
  /** Shown when an email is not in a valid format */
  invalid?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function check(form: HTMLFormElement, rules: FieldRule[]) {
  const data = new FormData(form);
  const errors: Record<string, string> = {};
  for (const r of rules) {
    const raw = data.get(r.name);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (r.kind === "checkbox") {
      if (r.required && raw === null) errors[r.name] = r.missing;
      continue;
    }
    if (!value) {
      if (r.required) errors[r.name] = r.missing;
      continue;
    }
    if (r.kind === "email" && !EMAIL_RE.test(value)) errors[r.name] = r.invalid ?? r.missing;
  }
  return errors;
}

/**
 * Client-side only validation. Errors appear on the first submit, then update as the user types.
 * On submit with errors, focus moves to the first invalid field. A valid submit calls onValid
 * (no network call: the prototype shows an inline confirmation).
 */
export function useValidatedForm(rules: FieldRule[], onValid: () => void) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errs = check(form, rules);
    setErrors(errs);
    setAttempted(true);
    const first = rules.find((r) => errs[r.name]);
    if (first) {
      const el = form.elements.namedItem(first.name);
      if (el instanceof HTMLElement) el.focus();
      return;
    }
    onValid();
  };

  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    if (attempted) setErrors(check(e.currentTarget, rules));
  };

  /** Back to a fresh, untouched form (after "Send another enquiry") */
  const resetErrors = () => {
    setErrors({});
    setAttempted(false);
  };

  return { errors, onSubmit, onChange, resetErrors };
}
