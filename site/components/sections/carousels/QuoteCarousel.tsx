"use client";

import { useId } from "react";
import { Button } from "@/components/ui/Button";
import { useCarousel, LineArrow, PagerDots, PagerBars } from "@/components/ui/Carousel";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { T } from "@/components/ui/type";

export type QuoteSlide = {
  /** The quote, verbatim with its curly quotes */
  quote: string;
  /** Plain attribution text, e.g. "Jane DOE • CEO of MyCompany" or "Name • Role, Market" */
  attribution: string;
  /**
   * Optional link after the attribution, separated by the drawn "  ·  " (PEOPLE "Read their story").
   * Rendered with an arrow_forward icon in place of the wireframe's text arrow.
   */
  attributionLink?: { label: string; href: string | null };
  /** Optional primary button under the attribution (PROP "Watch the story") */
  cta?: { label: string; href: string | null };
};

export type QuoteCarouselProps = {
  /** One entry per slide. Only one slide is designed, so the data repeats it verbatim. */
  slides: QuoteSlide[];
  /** dots: customer variant (PROP §5); bars: employee variant (PEOPLE §5) */
  pager?: "dots" | "bars";
  /** A 30px white strip above the band (PROP §5) */
  topStrip?: boolean;
  /** Accessible name of the carousel region */
  label: string;
};

/**
 * B10 QuoteCarousel. A surface band (80/80, 30px sides so the arrows reach the edges) with a centred
 * 733px quote box between thin ← / → arrows, then a pager (dots or bars). Loops, no autoplay, swipe on touch.
 * Below 768 the arrows move beside the pager.
 */
export function QuoteCarousel({ slides, pager = "dots", topStrip = false, label }: QuoteCarouselProps) {
  const count = Math.max(1, slides.length);
  const { index, go, next, prev, swipe } = useCarousel(count, { loop: true });
  const liveId = useId();
  const multi = count > 1;
  const Pager = pager === "bars" ? PagerBars : PagerDots;

  return (
    <section aria-roledescription="carousel" aria-label={label} className={topStrip ? "bg-white pt-5 lg:pt-[30px]" : ""}>
      <div className="bg-surface">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-12 md:gap-8 md:px-8 md:py-16 lg:gap-9 lg:px-[30px] lg:py-20">
          <div className="flex items-center justify-center md:justify-between md:gap-4">
            {multi && (
              <div className="hidden md:block">
                <LineArrow dir="prev" onClick={prev} label="Previous quote" />
              </div>
            )}

            <div className="w-full max-w-[733px] min-w-0 overflow-clip" style={{ touchAction: "pan-y" }} {...(multi ? swipe : {})}>
              <div
                className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(${-index * 100}%)` }}
              >
                {slides.map((s, i) => (
                  <div
                    key={i}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}`}
                    inert={i !== index}
                    className="w-full shrink-0"
                  >
                    <QuoteBox slide={s} />
                  </div>
                ))}
              </div>
            </div>

            {multi && (
              <div className="hidden md:block">
                <LineArrow dir="next" onClick={next} label="Next quote" />
              </div>
            )}
          </div>

          {multi && (
            <div className={`flex items-center justify-center gap-2 ${pager === "dots" ? "md:py-2 lg:py-4" : ""}`}>
              <div className="md:hidden">
                <LineArrow dir="prev" onClick={prev} label="Previous quote" />
              </div>
              <Pager count={count} index={index} onGo={go} itemLabel="quote" />
              <div className="md:hidden">
                <LineArrow dir="next" onClick={next} label="Next quote" />
              </div>
            </div>
          )}
          <p id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
            {multi ? `Quote ${index + 1} of ${count}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

/** The quote box: placeholder logo/photo slot, quote, attribution, optional CTA (24px padding, 40px gaps). */
function QuoteBox({ slide }: { slide: QuoteSlide }) {
  const { quote, attribution, attributionLink, cta } = slide;
  return (
    <figure className="flex flex-col items-center gap-6 p-2 text-center md:gap-8 md:p-4 lg:gap-10 lg:p-6">
      <ImagePlaceholder className="h-[68px] w-[100px] shrink-0 rounded-control" iconSize={23} />
      <blockquote className="max-w-[685px]">
        <p className={T.quote32}>{quote}</p>
      </blockquote>
      <figcaption className="text-[15px] leading-6 text-black md:text-[16px]">
        <span>{attribution}</span>
        {attributionLink && (
          <>
            <span aria-hidden="true" className="whitespace-pre">
              {"  ·  "}
            </span>
            <SmartLink
              href={attributionLink.href}
              className="group inline-flex items-center gap-1 whitespace-nowrap underline-offset-4 hover:underline"
            >
              {attributionLink.label}
              <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-0.5" />
            </SmartLink>
          </>
        )}
      </figcaption>
      {cta && (
        <Button href={cta.href} variant="primary">
          {cta.label}
        </Button>
      )}
    </figure>
  );
}
