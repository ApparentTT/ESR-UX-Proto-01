"use client";

import { useId, useState } from "react";
import { Icon } from "./Icon";

/**
 * Form controls (inventory A8). Two families:
 * - "form": the shared newsletter/enquiry Form (labels Medium 14 body, inputs 48px, dark 1px border, radius 10)
 * - "contact": the Contact page form (labels Regular 13 muted, inputs 46px, line border, radius 6)
 */
export type FieldFamily = "form" | "contact";

const LABEL: Record<FieldFamily, string> = {
  form: "text-[14px] font-medium leading-5 text-body",
  contact: "text-[13px] leading-[1.5] text-muted",
};
const CONTROL: Record<FieldFamily, string> = {
  form: "w-full rounded-[10px] border border-ink bg-white px-3 text-[14px] text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2",
  contact: "w-full rounded-btn border border-line bg-white px-3.5 text-[15px] text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink",
};

export function TextField({
  label,
  family = "form",
  placeholder,
  type = "text",
  required,
  autoComplete,
  name,
}: {
  label: string;
  family?: FieldFamily;
  placeholder?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  name?: string;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col ${family === "form" ? "gap-1" : "gap-1.5"}`}>
      <label htmlFor={id} className={LABEL[family]}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`field ${CONTROL[family]} ${family === "form" ? "h-12" : "h-[46px]"}`}
      />
    </div>
  );
}

export function SelectField({
  label,
  family = "form",
  placeholder,
  options,
  name,
}: {
  label: string;
  family?: FieldFamily;
  placeholder: string;
  options: string[];
  name?: string;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  return (
    <div className={`flex flex-col ${family === "form" ? "gap-1" : "gap-1.5"}`}>
      <label htmlFor={id} className={LABEL[family]}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`field ${CONTROL[family]} ${family === "form" ? "h-12" : "h-[52px]"} cursor-pointer appearance-none pr-10 ${value ? "text-ink" : "text-muted"}`}
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
        <Icon name="keyboard_arrow_down" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </div>
  );
}

export function TextAreaField({
  label,
  family = "form",
  placeholder,
  maxLength = 250,
  counter = family === "form",
  name,
}: {
  label: string;
  family?: FieldFamily;
  placeholder?: string;
  maxLength?: number;
  counter?: boolean;
  name?: string;
}) {
  const id = useId();
  const [len, setLen] = useState(0);
  return (
    <div className={`flex flex-col ${family === "form" ? "gap-1" : "gap-1.5"}`}>
      <label htmlFor={id} className={LABEL[family]}>
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          name={name}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(e) => setLen(e.target.value.length)}
          aria-describedby={counter ? `${id}-count` : undefined}
          className={`field ${CONTROL[family]} block resize-none py-3.5 ${family === "form" ? "h-40 pb-7" : "h-[120px]"}`}
        />
        {counter && (
          <span id={`${id}-count`} className="pointer-events-none absolute bottom-1.5 left-3 text-[11px] leading-5 text-muted">
            {len} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export function CheckboxField({ label, family = "form", name }: { label: React.ReactNode; family?: FieldFamily; name?: string }) {
  return (
    <label className={`group flex cursor-pointer items-start ${family === "form" ? "gap-6" : "gap-2.5"}`}>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          name={name}
          className={`peer cursor-pointer appearance-none bg-white checked:bg-ink ${family === "form" ? "size-5 rounded-[3px] border border-ink" : "size-[18px] rounded-[4px] border border-line checked:border-ink"}`}
        />
        <span aria-hidden="true" className="icon pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex" style={{ fontSize: family === "form" ? 16 : 14, width: "100%", height: "100%" }}>
          check
        </span>
      </span>
      <span className={family === "form" ? "text-[14px] font-medium leading-5 text-body" : "text-[13px] leading-[1.5] text-muted"}>{label}</span>
    </label>
  );
}
