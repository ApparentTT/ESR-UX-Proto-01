"use client";

import { Icon } from "./Icon";

const fmtCount = (n: number) => n.toLocaleString("en-US");

export function CheckboxRow({
  label,
  count,
  checked,
  onChange,
  icon,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: string;
}) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-center gap-3 py-1.5 text-[15px]">
      <span className="relative inline-flex size-5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer size-5 cursor-pointer appearance-none rounded-[4px] border border-placeholder bg-white transition-colors checked:border-ink checked:bg-ink group-hover:border-ink"
        />
        <span aria-hidden="true" className="icon pointer-events-none absolute inset-0 hidden items-center justify-center text-white peer-checked:flex" style={{ fontSize: 16, width: 20, height: 20 }}>
          check
        </span>
      </span>
      {icon && <Icon name={icon} className="text-muted" />}
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-sm tabular-nums text-muted">{fmtCount(count)}</span>}
    </label>
  );
}

export function RadioRow({
  name,
  label,
  count,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex min-h-11 cursor-pointer items-center gap-3 py-1.5 text-[15px]">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-5 shrink-0 cursor-pointer appearance-none rounded-full border border-placeholder bg-white transition-all checked:border-[6px] checked:border-ink group-hover:border-ink"
      />
      <span className="flex-1">{label}</span>
      {count != null && <span className="text-sm tabular-nums text-muted">{fmtCount(count)}</span>}
    </label>
  );
}

/** Pill toggle used in the all-filters panel and for size presets. */
export function TogglePill({
  label,
  count,
  pressed,
  onClick,
  role,
}: {
  label: string;
  count?: number;
  pressed: boolean;
  onClick: () => void;
  role?: "radio";
}) {
  const a11y = role === "radio" ? { role: "radio", "aria-checked": pressed } : { "aria-pressed": pressed };
  return (
    <button
      type="button"
      {...a11y}
      onClick={onClick}
      className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
        pressed ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      {label}
      {count != null && <span className={`text-xs tabular-nums ${pressed ? "text-white/80" : "text-muted"}`}>{fmtCount(count)}</span>}
    </button>
  );
}
