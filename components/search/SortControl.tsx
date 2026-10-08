"use client";

import { Icon } from "@/components/ui/Icon";
import type { SortId } from "@/lib/filters";

const OPTIONS: { id: SortId; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "size", label: "Size" },
  { id: "availability", label: "Availability" },
];

/** Native select under a styled face: keyboard and screen reader behaviour for free. */
export function SortControl({ value, onChange }: { value: SortId; onChange: (s: SortId) => void }) {
  const label = OPTIONS.find((o) => o.id === value)!.label;
  return (
    <div className="relative inline-flex h-10 shrink-0 items-center gap-1.5 rounded-btn border border-line bg-white pl-3 pr-2 text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink">
      <span aria-hidden="true">
        <span className="hidden sm:inline">Sort: </span>
        {label}
      </span>
      <Icon name="keyboard_arrow_down" />
      <select
        aria-label="Sort results"
        value={value}
        onChange={(e) => onChange(e.target.value as SortId)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
