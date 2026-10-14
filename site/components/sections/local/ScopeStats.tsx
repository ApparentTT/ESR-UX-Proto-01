"use client";

import { useId, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Footnotes } from "@/components/ui/DataBits";
import { StatList, type StatItem } from "@/components/sections/stats/StatRow";

/**
 * "Key stats / opt 2" (About 1348:77195): a pill toggle (Global / Local) over a row of four Medium 48 stats
 * and a footnote under a #858585 rule. 30 / 30 padding, 30px between the parts at desktop.
 * The toggle is a pair of pressed buttons; the stats below change with it (announced politely).
 */
export function ScopeStats({
  label,
  options,
  footnotes,
}: {
  /** Accessible name of the toggle */
  label: string;
  options: { id: string; label: string; stats: StatItem[] }[];
  footnotes?: string[];
}) {
  const [active, setActive] = useState(options[0].id);
  const current = options.find((o) => o.id === active) ?? options[0];
  const listId = useId();
  return (
    <Section as="div" className="py-6 lg:py-[30px]" containerClassName="flex flex-col gap-6 lg:gap-[30px]">
      <div role="group" aria-label={label} className="flex w-fit gap-0.5 rounded-full border border-black p-0.5">
        {options.map((o) => {
          const on = o.id === active;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              aria-controls={listId}
              onClick={() => setActive(o.id)}
              className={`rounded-full px-4 py-2 text-[14px] leading-7 transition-colors ${
                on ? "bg-[#2f2f2f] font-semibold text-white" : "font-normal text-[#3e3e3e] hover:bg-surface"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <div id={listId} aria-live="polite">
        <StatList stats={current.stats} variant="people" label={`${current.label} figures`} />
      </div>
      {footnotes && footnotes.length > 0 && <Footnotes items={footnotes} />}
    </Section>
  );
}
