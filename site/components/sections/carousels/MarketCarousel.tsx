"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCarousel, CircleArrow, PagerFraction } from "@/components/ui/Carousel";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";

export type MarketCarouselItem = {
  /** Region tag on the featured block, e.g. "Oceania" */
  region: string;
  /** Market name: the featured title and the card label, e.g. "Australia & New Zealand" */
  name: string;
};

export type MarketCarouselProps = {
  /** Ordered markets (11 on PROP §4). The featured block shows the current one, the cards the next three (wrapping). */
  markets: MarketCarouselItem[];
  /** Pill CTA under the featured title ("Explore the market" ↗, an external market site, so href null = inert) */
  cta?: { label: string; href: string | null };
  /** Accessible name of the carousel region */
  label?: string;
  /** Level of the featured market title (the page's section heading above is the h2) */
  headingLevel?: "h2" | "h3";
};

/** Cards that are at least partly in view: ~1.3 at <768, 2.5 at 768–1023, 3 from 1024. */
function useVisibleCards() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setN(mq.matches ? 3 : 2);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return n;
}

/**
 * B16 MarketCarousel (PROP §4 "Featured cards"). A grey band: the featured market (region tag, Medium 36 title,
 * pill CTA) on the left, and a track of 2:3 placeholder cards showing the next three markets on the right, with
 * CircleArrow prev/next and a "01/11" PagerFraction below. Non-wrapping (← disabled at 01, → at the last).
 * → slides the track ~300ms and cross-fades the featured text; clicking a card features that market.
 * Below 1280 the featured block stacks above the track (~1.3 cards at 390, 2.5 at 768, 3 from 1024).
 */
export function MarketCarousel({ markets, cta, label = "Markets", headingLevel: H = "h3" }: MarketCarouselProps) {
  const n = markets.length;
  const { index, go, swipe } = useCarousel(n, { loop: false });
  const visible = useVisibleCards();
  const prevRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const focusTitle = useRef(false);

  // The track lists the markets twice so the "next three" can wrap past the last one.
  const track = [...markets, ...markets];
  const pos = index + 1;
  const current = markets[index];

  // After a card is chosen it leaves the track, so move focus to the newly featured title.
  useEffect(() => {
    if (focusTitle.current) {
      focusTitle.current = false;
      titleRef.current?.focus();
    }
  }, [index]);

  // Arrows disable at the ends; hand focus to the other arrow so it is not dropped on the page.
  const step = (d: 1 | -1) => {
    const to = Math.max(0, Math.min(n - 1, index + d));
    go(to);
    if (to === n - 1) prevRef.current?.querySelector("button")?.focus();
    if (to === 0) nextRef.current?.querySelector("button")?.focus();
  };

  return (
    <Section bg="grey" aria-roledescription="carousel" aria-label={label} className="py-12 md:py-16 xl:pb-[72px] xl:pt-[120px]">
      <div className="grid gap-8 md:gap-10 xl:grid-cols-[minmax(0,10fr)_minmax(0,19fr)]">
        {/* Featured market: re-keyed per index so its text cross-fades in */}
        <div key={index} className="anim-fade flex flex-col items-start">
          <Tag variant="outline" size="sm">
            {current.region}
          </Tag>
          <H
            ref={titleRef}
            tabIndex={-1}
            className="mt-4 text-[28px] font-medium leading-[1.2] text-ink md:text-[32px] lg:mt-6 lg:text-[36px] xl:leading-[1.1]"
          >
            {current.name}
          </H>
          {cta && (
            <Button href={cta.href} variant="pillOutlineLg" icon="arrow_outward" iconSize={24} className="mt-8 md:mt-10 xl:mt-20">
              {cta.label}
            </Button>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
          <div className="overflow-clip" style={{ touchAction: "pan-y" }} {...swipe}>
            <ul
              role="list"
              aria-label="Next markets"
              className="flex gap-[var(--gap)] transition-transform duration-300 ease-out [--card:70%] [--gap:16px] motion-reduce:transition-none md:[--card:calc((100%_-_2*var(--gap))/2.5)] lg:[--card:calc((100%_-_2*var(--gap))/3)] lg:[--gap:24px]"
              style={{ transform: `translateX(calc(${-pos} * (var(--card) + var(--gap))))` }}
            >
              {track.map((m, i) => {
                const shown = i >= pos && i < pos + visible;
                const target = i % n;
                return (
                  <li key={i} className="shrink-0 basis-[var(--card)]" inert={!shown} aria-hidden={shown ? undefined : true}>
                    <button
                      type="button"
                      aria-label={`Feature market: ${m.name}`}
                      onClick={() => {
                        focusTitle.current = true;
                        go(target);
                      }}
                      className="group relative block aspect-[2/3] w-full overflow-hidden rounded-control text-left"
                    >
                      <ImagePlaceholder className="absolute inset-0 size-full" iconSize={48} />
                      <span className="absolute bottom-5 left-5 right-5 text-[18px] font-semibold leading-[1.4] text-ink underline-offset-4 group-hover:underline lg:bottom-[26px] lg:left-6 lg:text-[20px]">
                        {m.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center justify-between">
            <div className="-ml-1.5 flex items-center gap-1">
              <span ref={prevRef}>
                <CircleArrow dir="prev" onClick={() => step(-1)} disabled={index === 0} label="Previous market" />
              </span>
              <span ref={nextRef}>
                <CircleArrow dir="next" onClick={() => step(1)} disabled={index === n - 1} label="Next market" />
              </span>
            </div>
            <PagerFraction index={index} count={n} live={false} />
          </div>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {`Featured market: ${current.name}, ${current.region}`}
          </p>
        </div>
      </div>
    </Section>
  );
}
