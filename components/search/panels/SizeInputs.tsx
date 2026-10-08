"use client";

import { useEffect, useState } from "react";
import { fmt, type Filters } from "@/lib/filters";

type Props = { draft: Filters; onDraft: (f: Filters) => void };

const parse = (s: string) => {
  const n = Number(s.replace(/[^0-9]/g, ""));
  return s.trim() && Number.isFinite(n) && n > 0 ? n : null;
};

/** Typed min and max. Commits on blur or Enter; formats with thousands separators. */
export function SizeInputs({ draft, onDraft }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <NumberField
        id="size-min"
        label="Min"
        value={draft.min}
        placeholder="No min"
        onCommit={(v) => onDraft({ ...draft, min: v, max: v != null && draft.max != null && v > draft.max ? v : draft.max })}
      />
      <NumberField
        id="size-max"
        label="Max"
        value={draft.max}
        placeholder="No max"
        onCommit={(v) => onDraft({ ...draft, max: v, min: v != null && draft.min != null && v < draft.min ? v : draft.min })}
      />
    </div>
  );
}

function NumberField({ id, label, value, placeholder, onCommit }: { id: string; label: string; value: number | null; placeholder: string; onCommit: (v: number | null) => void }) {
  const [text, setText] = useState(value != null ? fmt(value) : "");
  const [focused, setFocused] = useState(false);

  // Follow outside changes (slider, presets) unless the user is typing.
  useEffect(() => {
    if (!focused) setText(value != null ? fmt(value) : "");
  }, [value, focused]);

  const commit = () => {
    const v = parse(text);
    setText(v != null ? fmt(v) : "");
    if (v !== value) onCommit(v);
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] text-muted">
        {label}
      </label>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        value={text}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onChange={(e) => setText(e.target.value.replace(/[^0-9,]/g, ""))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className="field h-12 w-full rounded-btn border border-line bg-white px-3.5 text-[15px] tabular-nums placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
      />
    </div>
  );
}
