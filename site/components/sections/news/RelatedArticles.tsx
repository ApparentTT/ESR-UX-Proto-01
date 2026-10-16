"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ScrollRow } from "@/components/sections/cards/ScrollRow";
import { ArticleCard, type ArticleCardData } from "./ArticleCard";

/**
 * "Related articles" (1508:34684): Medium 36 heading over three article cards in a row, 24px apart; each card has
 * a 1px line border (the B32 article card). Below 1024 (1519:37092): Medium 28 heading and a sideways scroll-snap
 * row (272px cards, 16px apart) with page dots under it (the current one a 20px ink pill) that follow the scroll.
 * The dots are an indicator only: swipe, or Tab through the cards (ScrollRow keeps the focused card in view).
 */
export function RelatedArticles({ title, cards, gutter }: { title: string; cards: ArticleCardData[]; gutter: string }) {
  const headingId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const row = wrapRef.current?.querySelector("ul");
    if (!row) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Scroll offsets and offsetWidth are both page pixels, so no pageScale() is needed here
        const max = row.scrollWidth - row.clientWidth;
        setOverflow(max > 1);
        const item = row.querySelector("li");
        const step = item ? item.offsetWidth + (parseFloat(getComputedStyle(row).columnGap) || 0) : 1;
        setActive(row.scrollLeft >= max - 1 && max > 1 ? cards.length - 1 : Math.round(row.scrollLeft / step));
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
  }, [cards.length]);

  if (!cards.length) return null;

  return (
    <section aria-labelledby={headingId} className="bg-white py-14 lg:py-[72px]">
      <div className={gutter}>
        <h2 id={headingId} className="text-[28px] font-medium leading-[1.18] text-ink md:text-[32px] lg:text-[36px] lg:leading-[1.15]">
          {title}
        </h2>
        <div ref={wrapRef} className="mt-4 lg:mt-6">
          <ScrollRow className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 py-1 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:py-0">
            {cards.map((c, i) => (
              <li key={`${c.href ?? ""}-${i}`} className="w-[272px] shrink-0 snap-start lg:w-auto">
                <ArticleCard {...c} className="border border-line" />
              </li>
            ))}
          </ScrollRow>
        </div>
        {overflow && (
          <div aria-hidden="true" className="mt-4 flex items-center gap-2 lg:hidden">
            {cards.map((c, i) => (
              <span key={`${c.href ?? ""}-${i}`} className={`h-2 rounded-full transition-[width,background-color] motion-reduce:transition-none ${i === active ? "w-5 bg-ink" : "w-2 bg-line"}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
