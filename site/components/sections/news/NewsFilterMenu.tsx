"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type NewsFilterMenuOption = { id: string; label: string };

/**
 * News filter / sort trigger + single-select menu (inventory A7, NEWS §2 / NSR §1).
 * Same anatomy as the shared FilterDropdown, with the two differences the news wireframes need:
 * - filter: the trigger keeps its own label ("Content type") while a value is applied; the value shows
 *   as an AppliedChip beside it, and the trigger only gets the dark #111827 border.
 * - sort: the trigger shows the current option ("Most recent" / "Most relevant") with the default border.
 * The menu opens on the side that fits the viewport (so it never runs off a 390 screen).
 * Closes on select, outside click, Esc and focus leaving. Arrow keys, Home and End move between options.
 */
export function NewsFilterMenu({
  label,
  options,
  value,
  onChange,
  variant = "filter",
  align = "left",
}: {
  /** Trigger label (filter) or the accessible name of the menu (sort) */
  label: string;
  options: NewsFilterMenuOption[];
  value: string | null;
  /** Filters: choosing the selected option again clears it (null) */
  onChange: (id: string | null) => void;
  variant?: "filter" | "sort";
  /** Preferred menu side; flips when it would overflow the viewport */
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState(align);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const current = options.find((o) => o.id === value) ?? null;
  const isSort = variant === "sort";
  const applied = !isSort && current !== null;

  // Pick the side before paint so the menu never sits off screen.
  useLayoutEffect(() => {
    if (!open || !wrapRef.current || !listRef.current) return;
    const w = listRef.current.offsetWidth;
    const r = wrapRef.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const fitsLeft = r.left + w <= vw - 8;
    const fitsRight = r.right - w >= 8;
    setSide(align === "left" ? (fitsLeft || !fitsRight ? "left" : "right") : fitsRight || !fitsLeft ? "right" : "left");
  }, [open, align]);

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
    const raf = requestAnimationFrame(() =>
      (listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]') ?? listRef.current?.querySelector<HTMLElement>('[role="option"]'))?.focus(),
    );
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (o: NewsFilterMenuOption) => {
    setOpen(false);
    buttonRef.current?.focus();
    if (o.id === value) {
      if (!isSort) onChange(null);
      return;
    }
    onChange(o.id);
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const i = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === "ArrowDown") next = Math.min(items.length - 1, i + 1);
    else if (e.key === "ArrowUp") next = Math.max(0, i - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    items[next]?.focus();
  };

  const triggerText = isSort ? (current?.label ?? label) : label;
  const ariaLabel = isSort ? `${label}: ${triggerText}` : current ? `${label}, ${current.label} applied` : undefined;

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={ariaLabel}
        onClick={() => {
          if (!open) setSide(align);
          setOpen((o) => !o);
        }}
        className={`inline-flex h-[46px] items-center gap-2 whitespace-nowrap rounded-control border bg-white pl-[18px] pr-3.5 text-[14px] font-medium leading-[1.45] text-ink transition-colors ${
          applied ? "border-ink" : "border-line hover:border-[#9CA3AF]"
        }`}
      >
        <span>{triggerText}</span>
        <Icon name="keyboard_arrow_down" size={18} className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          id={id}
          ref={listRef}
          role="listbox"
          aria-label={label}
          onKeyDown={onListKey}
          className={`anim-pop absolute top-full z-40 mt-2 w-max min-w-[max(200px,100%)] max-w-[calc(100vw-48px)] rounded-control border border-line bg-white p-1.5 shadow-panel ${
            side === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((o) => {
            const sel = o.id === value;
            return (
              <li
                key={o.id}
                role="option"
                aria-selected={sel}
                tabIndex={-1}
                onClick={() => choose(o)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(o);
                  }
                }}
                className="focus-inset flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-btn px-3 text-[14px] leading-[1.45] text-ink hover:bg-surface aria-selected:font-medium"
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
