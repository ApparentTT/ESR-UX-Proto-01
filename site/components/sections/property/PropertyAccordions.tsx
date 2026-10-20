"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export type PropertyAccordionItem = { label: string; content: React.ReactNode };

/**
 * "Features and amenities" groups (1507:52174): Amenities, Sustainability and Property features between line
 * rules, each a Medium 20 label (19 at 390) with a muted 24px arrow on the right, drawn open (arrow up). Every
 * group starts open; the labels toggle them independently and the arrow turns when closed. 20px padding
 * (18 at 390), 16px (14) between the label and the panel. Printed open (data-print="expand", app/globals.css).
 */
export function PropertyAccordions({ items }: { items: PropertyAccordionItem[] }) {
  const base = useId();
  const [closed, setClosed] = useState<number[]>([]);
  const toggle = (i: number) => setClosed((cur) => (cur.includes(i) ? cur.filter((v) => v !== i) : [...cur, i]));
  return (
    <div className="border-y border-line">
      {items.map((item, i) => {
        const isOpen = !closed.includes(i);
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={item.label} className={`py-2.5 md:py-3 ${i > 0 ? "border-t border-line" : ""}`}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex min-h-11 w-full items-center gap-3 rounded-btn py-1 text-left text-[19px] font-medium leading-[1.5] text-ink lg:text-[20px]"
              >
                <span className="min-w-0 flex-1">{item.label}</span>
                <Icon
                  name="keyboard_arrow_up"
                  size={24}
                  className={`text-muted transition-transform motion-reduce:transition-none print:hidden ${isOpen ? "" : "rotate-180"}`}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen} data-print="expand" className="anim-fade pb-2 pt-2.5 md:pt-3">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
