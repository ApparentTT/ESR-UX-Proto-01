"use client";

import { useRef } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { useCarousel, ChevronArrow, PagerDots } from "@/components/ui/Carousel";
import { Section, type SectionBg } from "@/components/ui/Section";
import { T } from "@/components/ui/type";

export type FeatureBandAction = { label: string; href: string | null; variant?: "primary" | "secondary" };
export type FeatureBandControls = "carousel-lg" | "carousel-sm" | "arrow-only" | "none";

type Props = {
  /** Medium 40 title; "\n" forces a line break ("Creating value in action\n[Case study title]") */
  title: string;
  body?: string;
  /** Buttons, 16px apart. primary (default) or secondary */
  actions?: FeatureBandAction[];
  /**
   * carousel-lg: 60px chevrons ~43px from the band edge + dots (HOME, PORT, DEV).
   * carousel-sm: 40px chevrons 8px from the edge + dots (SUS).
   * arrow-only: one 60px right chevron, no dots, no left arrow (SGOV).
   * none: a static band (DC, ABOUT, CAP).
   */
  controls?: FeatureBandControls;
  /** Carousel slide count. Only slide 1 is designed, so every slide repeats the same content. */
  slides?: number;
  bg?: SectionBg;
  /** arrow-only: id of an element the arrow smooth-scrolls to (e.g. the past disclosures). Inert when omitted. */
  arrowTargetId?: string;
  /** arrow-only: accessible name of the arrow */
  arrowLabel?: string;
  /** Accessible name of the carousel region; defaults to the title's first line */
  label?: string;
  headingLevel?: "h2" | "h3";
};

/**
 * B9 FeatureBand: full-bleed grey band (644 tall at desktop) with a 638px text block vertically centred
 * at the gutter. Doubles as the text-only case-study carousel. Below 768 the arrows sit beside the dots
 * under the content; from 768 they sit at the band edges.
 */
export function FeatureBand({
  title,
  body,
  actions = [],
  controls = "none",
  slides = 3,
  bg = "surface",
  arrowTargetId,
  arrowLabel,
  label,
  headingLevel = "h2",
}: Props) {
  const carousel = controls === "carousel-lg" || controls === "carousel-sm";
  const count = carousel ? Math.max(1, slides) : 1;
  const { index, go, next, prev, swipe } = useCarousel(count, { loop: true });
  const size = controls === "carousel-sm" ? "sm" : "lg";
  const name = label ?? title.split("\n")[0];

  // Carousel arrows sit inside the 40px gutter at 768-1023, so the text keeps the page edge. The arrow-only
  // band keeps a right inset at 768-1023 so its 60px arrow never meets the text.
  const inset = controls === "arrow-only" ? "md:pr-12 lg:pr-0" : "";
  const content = <BandContent title={title} body={body} actions={actions} H={headingLevel} className={inset} />;

  const scrollToTarget = () => {
    const target = arrowTargetId ? document.getElementById(arrowTargetId) : null;
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    // Take keyboard focus along to where the arrow led, not leave it on an off-screen button.
    target.querySelector<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")?.focus({ preventScroll: true });
  };

  // The prev arrow is hidden on slide 1 (as drawn), so going back to slide 1 hands focus to Next rather than dropping it.
  const ctrlRefs = useRef<HTMLDivElement[]>([]);
  const back = () => {
    const wrap = ctrlRefs.current.find((w) => w?.contains(document.activeElement));
    prev();
    if (index === 1 && wrap) requestAnimationFrame(() => wrap.querySelector<HTMLButtonElement>('button[aria-label="Next slide"]')?.focus());
  };

  return (
    <Section
      bg={bg}
      contained={false}
      aria-roledescription={carousel ? "carousel" : undefined}
      aria-label={carousel ? name : undefined}
    >
      <div className="relative mx-auto max-w-[1440px]">
        <Container
          className={`flex flex-col justify-center py-12 lg:min-h-[644px] lg:py-2.5 ${carousel ? "md:min-h-[440px] md:py-16 md:pb-24 lg:pb-2.5" : "md:py-20"}`}
        >
          {carousel ? (
            <div className="-m-1 overflow-hidden p-1" style={{ touchAction: "pan-y" }} {...swipe}>
              <div
                className="flex gap-8 transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(calc(${-index} * (100% + 2rem)))` }}
              >
                {Array.from({ length: count }, (_, i) => (
                  <div
                    key={i}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}`}
                    inert={i !== index}
                    className="w-full shrink-0"
                  >
                    {content}
                  </div>
                ))}
              </div>
              <p className="sr-only" aria-live="polite" aria-atomic="true">
                Slide {index + 1} of {count}
              </p>
            </div>
          ) : (
            content
          )}

          {/* Mobile: prev, dots, next in one row under the content */}
          {carousel && (
            <div ref={(el) => void (el && (ctrlRefs.current[0] = el))} className="mt-8 flex items-center justify-center gap-2 md:hidden">
              <ChevronArrow dir="prev" size="sm" onClick={back} className={index === 0 ? "invisible" : ""} />
              <PagerDots count={count} index={index} onGo={go} />
              <ChevronArrow dir="next" size="sm" onClick={next} />
            </div>
          )}
          {controls === "arrow-only" && (
            <div className="mt-6 flex justify-end md:hidden">
              <ChevronArrow dir="next" size="sm" onClick={scrollToTarget} label={arrowLabel} />
            </div>
          )}
        </Container>

        {/* 768+: arrows at the band edges, dots near the bottom. The wrappers own the display toggles
            because the primitives carry their own display classes. 768-1023: 40px arrows in the 40px gutter
            (spec: "arrows at the sides", SUS "40px"), so the text lines up with the other sections; their focus
            ring is drawn inside so the viewport edge does not clip it. */}
        {carousel && (
          <>
            <div ref={(el) => void (el && (ctrlRefs.current[1] = el))} className="hidden md:block lg:hidden">
              {index > 0 && <ChevronArrow dir="prev" size="sm" onClick={back} className="focus-inset absolute left-0 top-1/2 -translate-y-1/2" />}
              <ChevronArrow dir="next" size="sm" onClick={next} className="focus-inset absolute right-0 top-1/2 -translate-y-1/2" />
            </div>
            <div ref={(el) => void (el && (ctrlRefs.current[2] = el))} className="hidden lg:block">
              {index > 0 && <ChevronArrow dir="prev" size={size} onClick={back} className="absolute left-2 top-1/2 -translate-y-1/2" />}
              <ChevronArrow
                dir="next"
                size={size}
                onClick={next}
                className={`absolute top-1/2 -translate-y-1/2 ${size === "lg" ? "right-[43px]" : "right-2"}`}
              />
            </div>
            <div className="hidden md:block">
              <PagerDots
                count={count}
                index={index}
                onGo={go}
                className={`absolute inset-x-0 ${size === "lg" ? "bottom-8 lg:bottom-10" : "bottom-6 lg:bottom-[25px]"}`}
              />
            </div>
          </>
        )}
        {controls === "arrow-only" && (
          <div className="hidden md:block">
            <ChevronArrow
              dir="next"
              size="lg"
              onClick={scrollToTarget}
              label={arrowLabel}
              className="absolute right-2 top-1/2 -translate-y-1/2 lg:right-[43px]"
            />
          </div>
        )}
      </div>
    </Section>
  );
}

function BandContent({ title, body, actions, H, className }: { title: string; body?: string; actions: FeatureBandAction[]; H: "h2" | "h3"; className: string }) {
  return (
    <div className={className}>
      <div className="max-w-[638px]">
        <H className={`${T.h40m} whitespace-pre-line`}>{title}</H>
        {body && <p className={`mt-4 lg:mt-5 ${T.bodyLg}`}>{body}</p>}
        {actions.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3 md:gap-4 lg:mt-8">
            {actions.map((a) => (
              <Button key={a.label} href={a.href} variant={a.variant ?? "primary"}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
