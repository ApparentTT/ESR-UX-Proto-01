"use client";

import { useId, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { HIT } from "@/components/ui/type";

export type IndustrySector = {
  name: string;
  /** Share shown in the row ("XX%") */
  share: string;
  /** Relative size of the donut segment. The drawn split stands in until ESR leasing supplies the figures. */
  weight: number;
  description: string;
  /** Stats row in the detail: "XX%" of portfolio, "XX" customers, "X.X m" sqm leased */
  stats: { value: string; label: string }[];
  /** Number of placeholder customer logos in the detail (4 as drawn) */
  logos?: number;
  /** "Explore this sector": a built route, or null (inert) */
  link: { label: string; href: string | null };
};

export type IndustriesWeServeProps = {
  title: string;
  /** Centre of the donut ("XX m" / "sqm leased") */
  total: { value: string; label: string };
  sectors: IndustrySector[];
  /** "Customers in this sector" */
  customersLabel: string;
  footnote: string;
};

/** Segment and dot colours as drawn: near-black, mid grey, light grey. */
const TONES = ["#111827", "#6B7380", "#BDC2C9"];
/** While a sector is open its segment is near-black and the others this light grey (1416:98770). */
const ACTIVE = "#111827";
const DIM = "#D9DBE0";
/** Figma arcData: segments start at 12 o'clock with 0.028 rad between them, inner radius 62%. */
const GAP = 0.028;
const INNER = 0.62;

/** One ring segment in a 100 x 100 viewBox, clockwise from angle a0 to a1 (radians, 0 = 3 o'clock). */
function segmentPath(a0: number, a1: number) {
  const R = 50;
  const r = R * INNER;
  const pt = (rad: number, a: number) => `${(50 + rad * Math.cos(a)).toFixed(3)} ${(50 + rad * Math.sin(a)).toFixed(3)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${pt(R, a0)} A${R} ${R} 0 ${large} 1 ${pt(R, a1)} L${pt(r, a1)} A${r.toFixed(3)} ${r.toFixed(3)} 0 ${large} 0 ${pt(r, a0)} Z`;
}

function segments(weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const span = 2 * Math.PI - weights.length * GAP;
  let a = -Math.PI / 2 + GAP / 2;
  return weights.map((w) => {
    const a0 = a;
    const a1 = a0 + (w / total) * span;
    a = a1 + GAP;
    return segmentPath(a0, a1);
  });
}

/**
 * "Industries we serve" (Our customers, Figma PortfolioBySector 1463:46678; hover 1416:98770; mobile 1463:46800 /
 * 1463:46623). Grey band: Bold 26 title, a three-segment donut with the total in the centre, and the sector list
 * (dot, name, share, chevron). Opening a sector darkens its segment, greys the others and expands its row:
 * description, stats, customer logo placeholders and "Explore this sector →". One sector open at a time.
 *
 * Mouse: hovering a segment or a row opens that sector, clicking opens it too, and moving away keeps it open.
 * Touch: tapping a row or a segment toggles it (accordion). Keyboard: focusing a row opens it; Enter / Space
 * toggle it. Rows are buttons with aria-expanded. The donut is one image with a short text alternative; the list
 * carries the figures. Segment colours fade (none under prefers-reduced-motion).
 *
 * 390: stacked, 260 donut. 768: title above, donut beside the list. 1280: title column | donut 380 | list 400.
 */
export function IndustriesWeServe({ title, total, sectors, customersLabel, footnote }: IndustriesWeServeProps) {
  const base = useId();
  const titleId = `${base}-title`;
  const [open, setOpen] = useState<number | null>(null);
  /** Pointer type of the last press, so a click knows whether it came from a mouse or a touch. */
  const pointer = useRef("mouse");
  const paths = segments(sectors.map((s) => s.weight));

  const onHover = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setOpen(i);
  };
  const onPress = (e: React.PointerEvent) => {
    pointer.current = e.pointerType;
  };
  /** Keyboard (detail 0) and touch toggle; a mouse click only opens (hover has usually opened it already). */
  const onActivate = (i: number) => (e: React.MouseEvent) => {
    if (e.detail !== 0 && pointer.current === "mouse") setOpen(i);
    else setOpen((cur) => (cur === i ? null : i));
  };
  const onFocus = (i: number) => (e: React.FocusEvent<HTMLButtonElement>) => {
    if (e.currentTarget.matches(":focus-visible")) setOpen(i);
  };

  const fill = (i: number) => (open === null ? TONES[i % TONES.length] : open === i ? ACTIVE : DIM);

  return (
    <Section bg="surface" aria-labelledby={titleId} className="py-14 md:py-16 lg:py-20">
      <div className="flex flex-col gap-7 md:gap-8 xl:flex-row xl:gap-10">
        <h2 id={titleId} className="text-[28px] font-bold leading-[1.18] text-ink xl:w-[205px] xl:shrink-0 xl:text-[26px]">
          {title}
        </h2>

        <div className="flex flex-col items-center gap-7 md:flex-row md:items-start md:gap-10 lg:gap-12 xl:min-w-0 xl:flex-1">
          {/* Donut: one image for assistive tech; the segments respond to the pointer only (the list is the keyboard route). */}
          <div
            role="img"
            aria-label={`${total.value} ${total.label} in total, split by sector as listed`}
            className="relative aspect-square w-[260px] shrink-0 md:w-[280px] lg:w-[380px]"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  style={{ fill: fill(i) }}
                  className="cursor-pointer transition-[fill] duration-300 ease-out motion-reduce:transition-none"
                  onPointerEnter={onHover(i)}
                  onPointerDown={onPress}
                  onClick={onActivate(i)}
                />
              ))}
            </svg>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
              <span className="text-[28px] font-bold leading-[1.18] text-ink lg:text-[40px]">{total.value}</span>
              <span className="text-[12px] leading-[1.48] text-muted-surface lg:text-[14px]">{total.label}</span>
            </div>
          </div>

          <div className="w-full md:min-w-0 md:max-w-[400px] md:flex-1 lg:w-[400px] lg:flex-none">
            {sectors.map((s, i) => {
              const isOpen = open === i;
              const btnId = `${base}-btn-${i}`;
              const panelId = `${base}-panel-${i}`;
              return (
                <div key={s.name} className="border-b border-line">
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onPointerEnter={onHover(i)}
                      onPointerDown={onPress}
                      onClick={onActivate(i)}
                      onFocus={onFocus(i)}
                      className="focus-inset flex w-full items-center gap-3 py-[13px] text-left md:min-h-[74px] md:py-[14px]"
                    >
                      <span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ background: TONES[i % TONES.length] }} />
                      <span className="min-w-0 flex-1 text-[16px] font-bold leading-[1.48] text-ink">{s.name}</span>
                      <span className="shrink-0 whitespace-nowrap text-[15px] font-medium leading-[1.48] text-ink md:text-[16px]">{s.share}</span>
                      <span aria-hidden="true" className="hidden h-5 w-6 shrink-0 items-center justify-center text-muted-surface md:flex">
                        <Icon
                          name="expand_more"
                          size={20}
                          className={`transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen} className="anim-fade flex-col gap-4 pb-3 [&:not([hidden])]:flex">
                    {/* 390 (1463:46623): a rule between the row and its description; none from 768 (1416:98770) */}
                    <div aria-hidden="true" className="-mb-3 h-px bg-line md:hidden" />
                    <p className="pr-7 text-[13px] leading-[1.48] text-muted-surface">{s.description}</p>
                    <div aria-hidden="true" className="h-px bg-line" />
                    <ul role="list" className="flex gap-8 pr-7">
                      {s.stats.map((st) => (
                        <li key={st.label} className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.48]">
                          <span className="whitespace-nowrap text-[22px] font-bold text-ink">{st.value}</span>
                          <span className="text-[12px] text-muted-surface">{st.label}</span>
                        </li>
                      ))}
                    </ul>
                    <div aria-hidden="true" className="h-px bg-line" />
                    <div className="flex flex-col gap-2 pr-7">
                      <p className="text-[12px] font-medium leading-[1.48] text-muted-surface">{customersLabel}</p>
                      <div role="img" aria-label="Customer logos to be supplied" className="grid max-w-[318px] grid-cols-4 gap-2.5">
                        {Array.from({ length: s.logos ?? 4 }, (_, j) => (
                          <span key={j} className="h-9 rounded-[4px] bg-line" />
                        ))}
                      </div>
                    </div>
                    <SmartLink
                      href={s.link.href}
                      className={`${HIT} group inline-flex items-center gap-2 self-start pt-1 text-[15px] font-medium leading-[1.48] text-ink`}
                    >
                      <span className="underline-offset-4 group-hover:underline">
                        {s.link.label}<span className="sr-only">: {s.name}</span>
                      </span>
                      <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </SmartLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-7 text-[12px] leading-[1.48] text-muted-surface md:mt-8 lg:mt-10 lg:text-[13px]">{footnote}</p>
    </Section>
  );
}
