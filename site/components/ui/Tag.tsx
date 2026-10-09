"use client";

import { Icon } from "./Icon";

/** Small labels on cards (inventory A6). outline: white with a line border; filled: surface grey. */
export function Tag({ children, variant = "outline", size = "sm", className = "" }: { children: React.ReactNode; variant?: "outline" | "filled"; size?: "sm" | "md"; className?: string }) {
  if (variant === "filled")
    return <span className={`inline-flex items-center rounded-[4px] bg-surface px-2.5 py-[5px] text-[12px] font-medium leading-[1.45] text-muted-surface ${className}`}>{children}</span>;
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border border-line bg-white text-muted ${size === "sm" ? "h-[22px] px-1.5 text-[12px] leading-5" : "px-1.5 py-1.5 text-[14px] leading-5"} ${className}`}
    >
      {children}
    </span>
  );
}

/** Removable applied-filter chip. square: news results; pill: proven capability. */
export function AppliedChip({ label, onRemove, shape = "square" }: { label: string; onRemove: () => void; shape?: "square" | "pill" }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className={`anim-pop inline-flex h-10 shrink-0 items-center gap-2 bg-ink pl-4 pr-3 text-[14px] font-medium leading-[1.45] text-white hover:bg-black ${shape === "pill" ? "rounded-full" : "rounded-control"}`}
    >
      <span className="whitespace-nowrap">{label}</span>
      <Icon name="close" size={16} />
    </button>
  );
}

/** Single-select pill group (e.g. office regions). */
export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={`inline-flex min-h-10 items-center rounded-full border px-4 py-2.5 text-[14px] font-medium leading-[1.5] transition-colors ${
              on ? "border-transparent bg-ink text-white" : "border-line bg-white text-ink hover:border-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
