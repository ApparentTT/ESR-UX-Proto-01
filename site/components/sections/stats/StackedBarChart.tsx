"use client";

import { useEffect, useRef, useState } from "react";
import { Legend, FootnoteText } from "@/components/ui/DataBits";
import { T } from "@/components/ui/type";

/**
 * Two-segment stacked bar chart in a white card (inventory B26, INV §3c).
 * Desktop and tablet: vertical columns in a 300px area, value label above and year below each bar,
 * top segment ink, bottom segment mid grey, no axes or gridlines.
 * Mobile (< 768): the same data as horizontal stacked bars, one row per year, so every label stays
 * legible without a horizontal scroller (the spec's listed alternative).
 * The drawn bars are hidden from assistive tech; a visually hidden table carries the data.
 *
 * Motion: the first time the chart scrolls into view (30% visible) the bars grow from 0 to full height
 * (width on mobile) over 3s, ease-out, 120ms apart. A clip-path reveal, so nothing reflows. With
 * prefers-reduced-motion the bars are simply drawn in full.
 */

/** Growth timing: 3s ease-out (cubic), 120ms stagger. */
const GROW = "motion-safe:transition-[clip-path] motion-safe:duration-[3000ms] motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)]";
const STAGGER_MS = 120;

/** "idle" until the chart first scrolls into view, then "play" (once). */
function useGrowOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"idle" | "play">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("play");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, state] as const;
}

export type StackedBar = {
  /** Category label under the bar, e.g. "2019" */
  label: string;
  /** Value label above the bar, verbatim, e.g. "US $XXbn" */
  value: string;
  /** Top segment size (ink), in the chart's own units */
  top: number;
  /** Bottom segment size (mid grey), in the chart's own units */
  bottom: number;
};

export type StackedBarChartProps = {
  title: string;
  /** Series names: top segment (ink) and bottom segment (mid grey) */
  topLabel: string;
  bottomLabel: string;
  bars: StackedBar[];
  /** Scale maximum (tallest bar total). Defaults to the largest total. */
  max?: number;
  /** 13px footnote paragraph inside the card */
  footnote?: React.ReactNode;
  /** Heading level of the chart title (default h3, under the band's h2) */
  as?: "h2" | "h3" | "h4";
  /** Category column name for the hidden data table (default "Year") */
  categoryName?: string;
  /** Value column name for the hidden data table (default: the title) */
  valueName?: string;
  className?: string;
  id?: string;
};

/** Tallest bar in px at 768+ (300px area, room left for the labels). */
const MAX_BAR_PX = 210;

export function StackedBarChart({
  title,
  topLabel,
  bottomLabel,
  bars,
  max,
  footnote,
  as: H = "h3",
  categoryName = "Year",
  valueName,
  className = "",
  id = "stacked-bar-chart",
}: StackedBarChartProps) {
  const scaleMax = max ?? Math.max(1, ...bars.map((b) => b.top + b.bottom));
  const titleId = `${id}-title`;
  const first = bars[0]?.label;
  const last = bars[bars.length - 1]?.label;
  const [ref, grow] = useGrowOnView<HTMLElement>();

  return (
    <figure
      ref={ref}
      aria-labelledby={titleId}
      data-grow={grow}
      className={`group/bars relative flex flex-col gap-5 rounded-card bg-white p-5 md:px-8 md:py-7 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <H id={titleId} className={`flex-1 ${T.title20m}`}>
          {title}
        </H>
        <Legend
          items={[
            { label: bottomLabel, tone: "mid" },
            { label: topLabel, tone: "dark" },
          ]}
        />
      </div>

      {/* Vertical columns, 768+ */}
      <div aria-hidden="true" className="hidden h-[300px] grid-cols-8 items-end gap-3 md:grid lg:gap-5">
        {bars.map((b, i) => {
          const total = b.top + b.bottom;
          return (
            <div key={b.label} className="flex min-w-0 flex-col items-center gap-2.5">
              <span className="whitespace-nowrap text-[12px] font-medium leading-[1.45] text-ink lg:text-[13px]">{b.value}</span>
              <span
                className={`flex w-full flex-col overflow-hidden rounded-[6px] [clip-path:inset(0_0_0_0)] motion-safe:group-data-[grow=idle]/bars:[clip-path:inset(100%_0_0_0)] ${GROW}`}
                style={{ height: `${(total / scaleMax) * MAX_BAR_PX}px`, transitionDelay: `${i * STAGGER_MS}ms` }}
              >
                <span className="w-full bg-ink" style={{ flexGrow: b.top }} />
                <span className="w-full bg-[#A1A6AD]" style={{ flexGrow: b.bottom }} />
              </span>
              <span className="text-[12px] leading-[1.45] text-muted lg:text-[13px]">{b.label}</span>
            </div>
          );
        })}
      </div>

      {/* Horizontal rows, < 768 */}
      <div aria-hidden="true" className="flex flex-col gap-3 md:hidden">
        {bars.map((b, i) => {
          const total = b.top + b.bottom;
          return (
            <div key={b.label} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-[13px] leading-[1.45] text-muted">{b.label}</span>
              <span className="flex h-4 min-w-0">
                <span
                  className={`flex h-full overflow-hidden rounded-[4px] [clip-path:inset(0_0_0_0)] motion-safe:group-data-[grow=idle]/bars:[clip-path:inset(0_100%_0_0)] ${GROW}`}
                  style={{ width: `${(total / scaleMax) * 100}%`, transitionDelay: `${i * STAGGER_MS}ms` }}
                >
                  <span className="h-full bg-[#A1A6AD]" style={{ flexGrow: b.bottom }} />
                  <span className="h-full bg-ink" style={{ flexGrow: b.top }} />
                </span>
              </span>
              <span className="whitespace-nowrap text-[12px] font-medium leading-[1.45] text-ink">{b.value}</span>
            </div>
          );
        })}
      </div>

      <div className="sr-only">
        <table>
          <caption>
            {`${title}: stacked bars from ${first} to ${last}, each split into ${topLabel} (top segment) and ${bottomLabel} (bottom segment).`}
          </caption>
          <thead>
            <tr>
              <th scope="col">{categoryName}</th>
              <th scope="col">{valueName ?? title}</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.label}>
                <th scope="row">{b.label}</th>
                <td>{b.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && <FootnoteText>{footnote}</FootnoteText>}
    </figure>
  );
}
