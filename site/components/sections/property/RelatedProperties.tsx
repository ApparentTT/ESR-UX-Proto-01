"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ScrollRow } from "@/components/sections/cards/ScrollRow";
import { LocalPropertyCard, type LocalPropertyCardData } from "@/components/sections/local/LocalPropertyCards";
import { CircleArrow } from "@/components/ui/Carousel";
import { T } from "@/components/ui/type";

const PREV = "Previous properties";
const NEXT = "Next properties";

/**
 * "Related properties" (1138:10824): Medium 40 heading (72 top), the 32px circle arrows at the top right of the row
 * (under the row at 390), then Japan property cards (LocalPropertyCard, each opening its detail page) in a sideways
 * scroll-snap row: 4 visible at 1280+, 3 at 1024, ~2 at 768, ~1.2 at 390. Arrows step one card and grey out at the
 * ends; swipe and Tab also scroll (ScrollRow keeps a focused card in view). Arrows hidden in print.
 */
export function RelatedProperties({ title, cards }: { title: string; cards: LocalPropertyCardData[] }) {
  const headingId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const row = wrapRef.current?.querySelector("ul");
    if (!row) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = row.scrollWidth - row.clientWidth;
        const next = { start: row.scrollLeft <= 1, end: row.scrollLeft >= max - 1 };
        // An arrow about to be disabled would drop keyboard focus: hand it to the other visible arrow first.
        const active = document.activeElement;
        const label = active instanceof HTMLButtonElement && sectionRef.current?.contains(active) ? active.getAttribute("aria-label") : null;
        if ((label === NEXT && next.end) || (label === PREV && next.start)) {
          const others = sectionRef.current?.querySelectorAll<HTMLButtonElement>(`button[aria-label="${label === NEXT ? PREV : NEXT}"]`);
          Array.from(others ?? []).find((b) => b.offsetParent !== null)?.focus();
        }
        setEdges((cur) => (cur.start === next.start && cur.end === next.end ? cur : next));
      });
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(row);
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const row = wrapRef.current?.querySelector("ul");
    const item = row?.querySelector("li");
    if (!row || !item) return;
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: dir * (item.getBoundingClientRect().width + gap), behavior: reduce ? "auto" : "smooth" });
  };

  // Rendered twice (above the row from 768, below it on mobile); the hidden copy is display:none, never focusable.
  const controls = (className: string) => (
    <div className={`-mr-1.5 justify-end ${className}`} data-print-hide>
      <CircleArrow dir="prev" onClick={() => step(-1)} disabled={edges.start} label={PREV} />
      <CircleArrow dir="next" onClick={() => step(1)} disabled={edges.end} label={NEXT} />
    </div>
  );

  return (
    <section ref={sectionRef} aria-labelledby={headingId} className="bg-white py-12 md:py-16 lg:pb-[72px] lg:pt-[72px]" data-print-section>
      <Container>
        <h2 id={headingId} className={T.h40m}>
          {title}
        </h2>
        {controls("-mb-1.5 mt-6 hidden md:flex lg:mt-[30px]")}
        <div ref={wrapRef} className="mt-8 md:mt-5" data-print-grid>
          <ScrollRow className="no-scrollbar -mx-6 -my-1 flex snap-x snap-mandatory scroll-px-6 gap-8 overflow-x-auto px-6 py-1 md:-mx-10 md:scroll-px-10 md:gap-6 md:px-10 lg:-mx-1 lg:scroll-px-1 lg:gap-[30px] lg:px-1">
            {cards.map((c) => (
              <li
                key={c.title}
                className="w-[80%] max-w-[300px] shrink-0 snap-start md:w-[42%] md:max-w-none lg:w-[calc((100%-60px)/3)] xl:w-[calc((100%-90px)/4)]"
                data-print-avoid
              >
                <LocalPropertyCard {...c} />
              </li>
            ))}
          </ScrollRow>
        </div>
        {controls("-mb-1.5 mt-6 flex md:hidden")}
      </Container>
    </section>
  );
}
