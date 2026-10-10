"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";

export type DropdownOption = { id: string; label: string };

/**
 * Filter trigger + single-select menu (inventory A7). Trigger 46px, radius 8, border line, dark border when
 * it owns an applied value. The trigger then shows the value ("Japan", SCS) or, with `prefixLabel`, "Label: Value"
 * ("Strategy: Development", INV §6b); either way its accessible name keeps the filter ("Country: Japan").
 * Closes on select, outside click, Esc and focus leaving.
 * `allLabel` adds a clear item at the top ("All markets", ...).
 */
export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  allLabel,
  sortLabel,
  prefixLabel = false,
  align = "left",
}: {
  label: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  allLabel?: string;
  /** Sort variant: shows "Sort" plus the current value (e.g. "Sort · Newest first") */
  sortLabel?: boolean;
  /** Show "Label: Value" once a value is applied (INV); otherwise the trigger shows the value alone */
  prefixLabel?: boolean;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const current = options.find((o) => o.id === value);
  const applied = !sortLabel && value && current ? `${label}: ${current.label}` : null;

  useEffect(() => {
    if (!open) return;
    const outside = (t: EventTarget | null) => !wrapRef.current?.contains(t as Node);
    const onDown = (e: PointerEvent) => outside(e.target) && setOpen(false);
    const onFocus = (e: FocusEvent) => outside(e.target) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => listRef.current?.querySelector<HTMLElement>('[aria-selected="true"], [role="option"]')?.focus());
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (v: string | null) => {
    onChange(v);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement) + (e.key === "ArrowDown" ? 1 : -1);
    items[Math.max(0, Math.min(items.length - 1, i))]?.focus();
  };

  const items: { id: string | null; label: string }[] = [...(allLabel ? [{ id: null, label: allLabel }] : []), ...options];

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={applied && !prefixLabel ? applied : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-[46px] items-center gap-2 rounded-control border bg-white pl-[18px] pr-3.5 text-[14px] font-medium leading-[1.45] text-ink transition-colors ${
          value && !sortLabel ? "border-ink" : "border-line hover:border-[#9CA3AF]"
        }`}
      >
        {sortLabel ? (
          <>
            <span>{label}</span>
            {current && <span className="font-normal text-muted">{current.label}</span>}
          </>
        ) : (
          <span>{applied ? (prefixLabel ? applied : current?.label) : label}</span>
        )}
        <Icon name="keyboard_arrow_down" size={18} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          id={id}
          ref={listRef}
          role="listbox"
          aria-label={label}
          onKeyDown={onListKey}
          className={`anim-pop absolute top-full z-40 mt-2 min-w-[max(200px,100%)] rounded-control border border-line bg-white p-1.5 shadow-panel ${align === "right" ? "right-0" : "left-0"}`}
        >
          {items.map((o) => {
            const sel = o.id === value || (o.id === null && value === null);
            return (
              <li
                key={o.id ?? "__all"}
                role="option"
                aria-selected={sel}
                tabIndex={-1}
                onClick={() => pick(o.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(o.id);
                  }
                }}
                className="focus-inset flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-btn px-3 text-[14px] text-ink hover:bg-surface aria-selected:font-medium"
              >
                {o.label}
                {sel && <Icon name="check" size={18} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
