"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Legend, ProgressBar } from "@/components/ui/DataBits";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PAD, T } from "@/components/ui/type";
import { StatList, type StatItem } from "./StatRow";

/**
 * "Our global pipeline" (inventory B21, DC §3).
 * Surface band, 80/80, column with a 36px gap: Bold 40 head + sub (max 820), StatRow bold4,
 * then the market list card (white, r12) beside a map frame (646:571, r12) with status dots,
 * then a 13px footnote.
 *
 * Behaviour: each market row is an aria-pressed toggle. Selecting one tints the row with a 3px ink
 * bar, mutes the other rows, and on the map brings that market's dots to full opacity with a
 * white ring (others fade to 25%). Re-click, or Esc while focus is in the block, clears it.
 * Clicking a dot (mouse) selects its market. Stacks list-then-map below 1024.
 */
export type PipelineMarket = {
  name: string;
  /** Secured value, verbatim, e.g. "XX MW" */
  secured: string;
  /** Total value, verbatim, e.g. "XXX MW" */
  total: string;
  /** Bar segment widths in percent of the track */
  securedPct: number;
  developmentPct: number;
};

export type PipelineDot = {
  /** Dot centre as % of the map frame */
  left: number;
  top: number;
  /** Diameter in px at the 646px desktop frame (scales with the frame) */
  size: number;
  status: "secured" | "development";
  /** Must match a PipelineMarket name */
  market: string;
};

export type PowerPipelineProps = {
  title: string;
  sub?: string;
  stats: StatItem[];
  /** Column heads of the market list */
  listHead: { market: string; secured: string; total: string };
  markets: PipelineMarket[];
  legend: { secured: string; development: string; future: string };
  dots: PipelineDot[];
  /** Accessible description of the map frame */
  mapLabel?: string;
  footnote?: React.ReactNode;
  id?: string;
};

/** Desktop map frame width the dot sizes are drawn against. */
const FRAME_W = 646;

export function PowerPipeline({
  title,
  sub,
  stats,
  listHead,
  markets,
  legend,
  dots,
  mapLabel = "Map of the pipeline across Asia Pacific",
  footnote,
  id = "pipeline",
}: PowerPipelineProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const headingId = `${id}-heading`;
  const toggle = (name: string) => setSelected((cur) => (cur === name ? null : name));

  return (
    <Section bg="surface" id={id} aria-labelledby={headingId} className={PAD.data} containerClassName="flex flex-col gap-8 lg:gap-9">
      <div className="flex flex-col gap-2.5">
        <h2 id={headingId} className={T.h40b}>
          {title}
        </h2>
        {sub && <p className="max-w-[820px] text-[16px] leading-[1.45] text-muted-surface lg:text-[18px]">{sub}</p>}
      </div>

      <StatList variant="bold4" stats={stats} />

      <div
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,620fr)_minmax(0,646fr)] lg:gap-10"
        onKeyDown={(e) => {
          if (e.key === "Escape" && selected) {
            e.stopPropagation();
            setSelected(null);
          }
        }}
      >
        {/* Market list card */}
        <div className="flex flex-col rounded-card bg-white px-4 py-5 md:px-7 md:py-6">
          <div className="flex items-center gap-3 border-b border-line pb-3.5 text-[12px] font-medium leading-[1.45] text-muted">
            <span className="flex-1">{listHead.market}</span>
            <span>{listHead.secured}</span>
            <span aria-hidden="true" className="w-4 md:w-7" />
            <span>{listHead.total}</span>
          </div>
          <ul role="list">
            {markets.map((m) => {
              const isSel = selected === m.name;
              const dim = selected !== null && !isSel;
              return (
                <li key={m.name} className="border-b border-line">
                  <button
                    type="button"
                    aria-pressed={isSel}
                    onClick={() => toggle(m.name)}
                    className={`-mx-3 flex w-[calc(100%+24px)] flex-col gap-2.5 rounded-control px-3 py-4 text-left focus-inset motion-safe:transition-colors ${
                      isSel ? "bg-surface shadow-[inset_3px_0_0_var(--color-ink)]" : "hover:bg-surface"
                    }`}
                  >
                    <span className="flex w-full items-center gap-3">
                      <span
                        className={`min-w-0 flex-1 text-[16px] font-medium leading-[1.45] md:text-[17px] ${dim ? "text-muted" : "text-ink"}`}
                      >
                        {m.name}
                      </span>
                      <span className={`whitespace-nowrap text-[14px] leading-[1.45] md:text-[15px] ${isSel ? "text-muted-surface" : "text-muted"}`}>
                        <span className="sr-only">, {listHead.secured.toLowerCase()} </span>
                        {m.secured}
                      </span>
                      <span aria-hidden="true" className="w-4 md:w-7" />
                      <span
                        className={`whitespace-nowrap text-[14px] font-medium leading-[1.45] md:text-[15px] ${dim ? "text-muted" : "text-ink"}`}
                      >
                        <span className="sr-only">, {listHead.total.toLowerCase()} </span>
                        {m.total}
                      </span>
                    </span>
                    <span aria-hidden="true" className="block w-full">
                      <ProgressBar
                        segments={[m.securedPct, m.developmentPct]}
                        label={`${m.name} capacity`}
                        className={`motion-safe:transition-opacity ${dim ? "opacity-50" : ""}`}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Legend
            className="pt-4"
            items={[
              { label: legend.secured, tone: "dark" },
              { label: legend.development, tone: "mid" },
              { label: legend.future, tone: "track" },
            ]}
          />
        </div>

        {/* Map frame */}
        <figure className="relative aspect-[646/571] w-full overflow-hidden rounded-card bg-white">
          <ImagePlaceholder className="absolute inset-0 size-full" icon={false} />
          {/* Lightens the placeholder like the wireframe's 60%-opacity map so the grey dots read */}
          <span aria-hidden="true" className="absolute inset-0 bg-white/55" />
          {dots.map((d, i) => {
            const isSel = selected === d.market;
            const faded = selected !== null && !isSel;
            return (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                title={d.market}
                onClick={() => toggle(d.market)}
                className={`absolute aspect-square -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full motion-safe:transition-[opacity,transform,box-shadow] motion-safe:duration-200 ${
                  d.status === "secured" ? "bg-ink" : "bg-[#A1A6AD]"
                } ${isSel ? "scale-115 opacity-100 shadow-[0_0_0_2px_#fff,0_2px_8px_rgb(17_24_38/0.3)]" : faded ? "opacity-25" : "opacity-85"}`}
                style={{ left: `${d.left}%`, top: `${d.top}%`, width: `${(d.size / FRAME_W) * 100}%` }}
              />
            );
          })}
          <figcaption className="sr-only">{mapLabel}</figcaption>
        </figure>
      </div>

      <p className="sr-only" aria-live="polite">
        {selected ? `${selected} selected and highlighted on the map.` : ""}
      </p>

      {footnote && <p className="text-[13px] leading-[1.45] text-muted-surface">{footnote}</p>}
    </Section>
  );
}
