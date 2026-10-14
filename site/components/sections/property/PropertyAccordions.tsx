"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type PropertyAccordionItem = { label: string; content: React.ReactNode };

/**
 * Amenities / Sustainability / Property Features (1138:10712-10726): Bold 18 (-0.36) labels with a 24px
 * keyboard_arrow_down on the right, 24px apart, no rules or fills (unlike the B17 FAQ accordion). Independent
 * toggles; the arrow turns when open. Panels are 16/24 body copy. Closed panels are display:none (not the hidden attribute, so print:block can open every panel in print).
 */
export function PropertyAccordions({ items }: { items: PropertyAccordionItem[] }) {
  const base = useId();
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen((cur) => (cur.includes(i) ? cur.filter((v) => v !== i) : [...cur, i]));
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={item.label}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex min-h-10 w-full items-center justify-between gap-4 rounded-btn py-2 text-left text-[18px] font-bold tracking-[-0.02em] text-ink"
              >
                {item.label}
                <Icon
                  name="keyboard_arrow_down"
                  size={24}
                  className={`shrink-0 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className={`anim-fade pb-2 pt-1 text-[16px] leading-6 text-body ${isOpen ? "" : "hidden print:block"}`}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
