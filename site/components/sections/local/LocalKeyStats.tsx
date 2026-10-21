"use client";

import { useId, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Footnotes } from "@/components/ui/DataBits";
import { TextLink } from "@/components/ui/TextLink";
import { T } from "@/components/ui/type";
import { CountUp } from "@/components/ui/CountUp";

export type LocalStat = { value: string; label: string; /** Footnote marker after the label */ sup?: number };

export type LocalKeyStatsProps = {
  title: string;
  sub?: string;
  /** Section link at the top right ("Explore our portfolio") */
  link?: { label: string; href: string | null };
  /** One stat set, or a Local / Group pair with the pill toggle above the stats (Local first and shown by default) */
  stats: LocalStat[] | { group: LocalStat[]; local: LocalStat[] };
  footnotes?: string[];
};

const VALUE =
  "text-[clamp(26px,8.2vw,32px)] leading-[1.25] md:text-[36px] md:leading-[44px] xl:text-[48px] xl:leading-[56px] font-medium tracking-[-0.02em] text-ink";
const COLS: Record<number, string> = { 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/**
 * "Key stats" (Figma "Key stats / opt 2" 1110:53502 on the Japan homepage, "opt 3" 1290:29645 on the Japan
 * portfolio): SemiBold 24 heading, 18/28 muted sub and an optional section link, then (opt 2) a pill toggle
 * between the Japan ("Local", first and selected by default) and group ("Group") figures, the stats in one
 * row (Medium 48 values, 16/24 labels, 30 apart), and the footnote under a #858585 rule. The Local figures
 * are placeholders until ESR Japan supplies them. 390: stats 2 x 2.
 */
export function LocalKeyStats({ title, sub, link, stats, footnotes }: LocalKeyStatsProps) {
  const uid = useId();
  const headingId = `${uid}-title`;
  const toggled = !Array.isArray(stats);
  const [view, setView] = useState<"group" | "local">("local");
  const list = Array.isArray(stats) ? stats : stats[view];
  return (
    <section aria-labelledby={headingId} className="bg-white pb-10 pt-12 md:pb-14 md:pt-16 lg:pb-16 lg:pt-[72px]">
      <Container>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="max-w-[893px] lg:pr-[120px]">
            <h2 id={headingId} className={T.eyebrow24}>
              {title}
            </h2>
            {sub && <p className="mt-4 text-[16px] leading-6 text-muted lg:mt-5 lg:text-[18px] lg:leading-7">{sub}</p>}
          </div>
          {link && (
            <TextLink href={link.href} variant="section">
              {link.label}
            </TextLink>
          )}
        </div>

        {toggled && (
          <div role="group" aria-label="Show figures for" className="mt-8 inline-flex gap-0.5 rounded-full border border-black p-0.5 lg:mt-[60px]">
            {(["local", "group"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`inline-flex h-11 items-center rounded-full px-4 text-[14px] leading-7 transition-colors motion-reduce:transition-none ${
                  view === v ? "bg-[#2F2F2F] font-semibold text-white" : "text-[#3E3E3E] hover:bg-surface"
                }`}
              >
                {v === "group" ? "Group" : "Local"}
              </button>
            ))}
          </div>
        )}

        <ul
          role="list"
          aria-label={title}
          aria-live={toggled ? "polite" : undefined}
          className={`grid grid-cols-2 gap-x-4 gap-y-6 md:gap-x-[30px] ${COLS[list.length] ?? "lg:grid-cols-4"} ${toggled ? "mt-6 lg:mt-[30px]" : "mt-6 lg:mt-8"}`}
        >
          {list.map((s, i) => (
            <li key={`${s.label}-${i}`} className={`flex min-w-0 flex-col gap-2 lg:gap-3 lg:py-6 ${i > 0 ? "min-[1400px]:px-6" : ""}`}>
              <span className={VALUE}><CountUp value={s.value} /></span>
              <span className="text-[14px] leading-5 text-muted md:text-[16px] md:leading-6">
                {s.label}
                {s.sup !== undefined && <sup className="text-[10px]">{s.sup}</sup>}
              </span>
            </li>
          ))}
        </ul>

        {footnotes && footnotes.length > 0 && <Footnotes items={footnotes} className="mt-6 lg:mt-8" />}
      </Container>
    </section>
  );
}
