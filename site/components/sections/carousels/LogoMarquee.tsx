"use client";

import { useId, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { T } from "@/components/ui/type";

export type LogoMarqueeProps = {
  /** "Our customers" / "Our investors" */
  title: string;
  /** Number of placeholder logo tiles in one set (7 as drawn) */
  count?: number;
  /**
   * customers: heading 64 top / 24 bottom, logo row 32 / 32 (PORT §5, PROP §6).
   * investors: no heading top padding, logo row 64 / 64 (INV §7).
   */
  spacing?: "customers" | "investors";
  /** Accessible name of the logo list; defaults to "<title> logos" */
  listLabel?: string;
  headingLevel?: "h2" | "h3";
};

/** Copies of the set in the track. The animation shifts by one set, so 5 copies cover viewports up to ~2.5x the set width. */
const COPIES = 5;
/** The middle copy is the one centred when motion is reduced, so it is the one exposed to assistive tech. */
const MAIN_COPY = Math.floor(COPIES / 2);

/*
  Keyframes and play-state rules live in one deduplicated <style> (React hoists it by href).
  They are unlayered, so the reduced-motion and pause rules sit here too rather than in utilities.
  ~40px/s at every breakpoint: one set is ~1092px (390), ~1358px (768), ~1727px (1440).
*/
const CSS = `
@keyframes esr-logo-marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(calc(-100% / ${COPIES}),0,0); } }
.esr-marquee-track { animation: esr-logo-marquee 28s linear infinite; }
@media (min-width: 768px) { .esr-marquee-track { animation-duration: 34s; } }
@media (min-width: 1024px) { .esr-marquee-track { animation-duration: 44s; } }
.esr-marquee-row:hover .esr-marquee-track,
.esr-marquee:focus-within .esr-marquee-track,
.esr-marquee[data-paused="true"] .esr-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .esr-marquee-track { animation: none !important; }
  .esr-marquee-toggle { display: none !important; }
}
`;

/**
 * B11 LogoMarquee ("Our customers" / "Our investors"). A Medium 40 heading at the page gutter, then a
 * full-bleed row of placeholder logo tiles (206.67 x 140, 40 gap at desktop) that drifts slowly left in a
 * seamless loop. Pauses on hover, on keyboard focus inside the section, and with the pause button; static and
 * centred (cropped at the edges, as drawn) under prefers-reduced-motion. Logos are not links.
 * The row clips its own overflow, so it never widens the page.
 */
export function LogoMarquee({ title, count = 7, spacing = "customers", listLabel, headingLevel: H = "h2" }: LogoMarqueeProps) {
  const [paused, setPaused] = useState(false);
  const headingId = useId();
  const investors = spacing === "investors";

  const set = (copy: number) => (
    <ul
      key={copy}
      role="list"
      aria-label={copy === MAIN_COPY ? (listLabel ?? `${title} logos`) : undefined}
      aria-hidden={copy === MAIN_COPY ? undefined : true}
      className="flex shrink-0"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="mr-4 shrink-0 md:mr-6 lg:mr-10">
          <ImagePlaceholder className="h-[96px] w-[140px] rounded-control md:h-[115px] md:w-[170px] lg:h-[140px] lg:w-[206.67px]" iconSize={40} />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby={headingId} className="esr-marquee bg-white" data-paused={paused}>
      <style href="esr-logo-marquee" precedence="default">
        {CSS}
      </style>
      <Container
        className={`flex items-end justify-between gap-4 ${investors ? "pt-0" : "pt-12 pb-4 md:pt-14 md:pb-5 lg:pt-16 lg:pb-6"}`}
      >
        <H id={headingId} className={T.h40m}>
          {title}
        </H>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play logo animation" : "Pause logo animation"}
          className="esr-marquee-toggle inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-ink hover:text-ink"
        >
          <Icon name={paused ? "play_arrow" : "pause"} size={20} />
        </button>
      </Container>

      <div className={`esr-marquee-row flex justify-center overflow-hidden ${investors ? "py-8 md:py-12 lg:py-16" : "py-6 md:py-7 lg:py-8"}`}>
        <div className="esr-marquee-track flex w-max shrink-0 will-change-transform">
          {Array.from({ length: COPIES }, (_, c) => set(c))}
        </div>
      </div>
    </section>
  );
}
