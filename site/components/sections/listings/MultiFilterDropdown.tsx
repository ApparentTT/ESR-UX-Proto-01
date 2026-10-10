"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { DropdownOption } from "@/components/ui/FilterDropdown";

/**
 * Multi-select variant of the filter trigger (inventory A7, CAP §2b Theme / Market / Asset type).
 * The trigger looks exactly like FilterDropdown and keeps its own label ("Theme"): the applied values
 * show as pill chips after the triggers, as drawn. Picking an option toggles it and closes the menu
 * (closes on select, outside click, Esc and focus leaving). Selected options carry a check.
 */
export function MultiFilterDropdown({
  label,
  options,
  values,
  onToggle,
  align = "left",
}: {
  label: string;
  options: DropdownOption[];
  values: string[];
  onToggle: (id: string) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

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

  const pick = (v: string) => {
    onToggle(v);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const cur = items.indexOf(document.activeElement as HTMLElement);
    const i = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : cur + (e.key === "ArrowDown" ? 1 : -1);
    items[Math.max(0, Math.min(items.length - 1, i))]?.focus();
  };

  const count = values.length;

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-[46px] items-center gap-2 rounded-control border border-line bg-white pl-3.5 pr-2.5 text-[14px] font-medium leading-[1.45] text-ink transition-colors hover:border-[#9CA3AF] md:pl-[18px] md:pr-3.5"
      >
        <span>{label}</span>
        {count > 0 && <span className="sr-only">{`, ${count} selected`}</span>}
        <Icon name="keyboard_arrow_down" size={18} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          id={id}
          ref={listRef}
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
          onKeyDown={onListKey}
          className={`anim-pop absolute top-full z-40 mt-2 min-w-[max(200px,100%)] rounded-control border border-line bg-white p-1.5 shadow-panel ${align === "right" ? "right-0" : "left-0"}`}
        >
          {options.map((o) => {
            const sel = values.includes(o.id);
            return (
              <li
                key={o.id}
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
                className="focus-inset flex min-h-10 cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-btn px-3 text-[14px] text-ink hover:bg-surface aria-selected:font-medium"
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
