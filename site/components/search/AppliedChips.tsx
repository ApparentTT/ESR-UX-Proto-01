"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { EMPTY_FILTERS, appliedChips, type Filters } from "@/lib/filters";

/** Every applied filter as a removable chip. Scrolls sideways on mobile, wraps from tablet up. */
export function AppliedChips({ filters, onApply }: { filters: Filters; onApply: (f: Filters) => void }) {
  const chips = appliedChips(filters);
  const listRef = useRef<HTMLUListElement>(null);
  if (!chips.length) return null;

  const remove = (i: number) => {
    onApply(chips[i].remove(filters));
    // Keep keyboard focus in the row after the chip disappears.
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button");
      if (buttons?.length) buttons[Math.min(i, buttons.length - 1)].focus();
    });
  };

  return (
    <div className="no-scrollbar -mx-6 mt-3 flex items-center gap-2 overflow-x-auto px-6 md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0">
      <h2 className="sr-only">Applied filters</h2>
      <ul ref={listRef} className="flex shrink-0 items-center gap-2 md:shrink md:flex-wrap">
        {chips.map((c, i) => (
          <li key={c.key} className="shrink-0">
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove filter: ${c.label}`}
              className="anim-pop inline-flex h-9 items-center gap-1.5 rounded-full bg-ink pl-3.5 pr-2.5 text-[13px] text-white transition-colors hover:bg-black"
            >
              <span className="whitespace-nowrap">{c.label}</span>
              <Icon name="close" size={16} />
            </button>
          </li>
        ))}
        <li className="shrink-0">
          <button type="button" onClick={() => onApply(EMPTY_FILTERS)} className="h-9 whitespace-nowrap rounded-btn px-2 text-[13px] text-muted hover:text-ink hover:underline">
            Clear all
          </button>
        </li>
      </ul>
    </div>
  );
}
