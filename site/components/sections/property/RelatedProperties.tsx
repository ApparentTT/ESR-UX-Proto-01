"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ScrollRow } from "@/components/sections/cards/ScrollRow";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import type { RelatedPropertyCardData } from "@/data/site/local/property-detail";
import { GUTTER, SECTION_H2 } from "./PropertyBlocks";

/**
 * Related property card (1507:52376): white, 1px line border, radius 10, a 180px image (170 at 390), then the
 * region (muted 12), the name (Medium 18), "Logistics · [GFA TBC]" (muted 14) and "Explore →" (Medium 14).
 * The whole card links to the property's detail page.
 */
function RelatedCard({ region, title, meta, href }: RelatedPropertyCardData) {
  return (
    <SmartLink href={href} className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-line bg-white transition-colors hover:border-ink">
      <ImagePlaceholder className="h-[170px] w-full shrink-0 lg:h-[180px]" />
      <span className="flex flex-1 flex-col gap-1.5 px-[18px] pb-[18px] pt-4 leading-[1.5] lg:px-5 lg:pb-5 lg:pt-[18px]">
        <span className="text-[12px] text-muted">{region}</span>
        <h3 className="text-[18px] font-medium text-ink underline-offset-4 group-hover:underline">{title}</h3>
        <span className="whitespace-pre-wrap text-[14px] text-muted">{meta}</span>
        <span className="mt-auto inline-flex items-center gap-2 pt-1 text-[14px] font-medium text-ink">
          Explore
          <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </span>
    </SmartLink>
  );
}

/**
 * "Related properties" (1507:52372): Bold 36 heading over four cards in a row, 20px apart. Below 1024
 * (1507:59286): a sideways scroll-snap row (272px cards, 16px apart) with page dots under it (the current one a
 * 20px ink pill) that follow the scroll. The dots are an indicator only: swipe, or Tab through the cards
 * (ScrollRow keeps the focused card in view).
 */
export function RelatedProperties({ title, cards }: { title: string; cards: RelatedPropertyCardData[] }) {
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
        const max = row.scrollWidth - row.clientWidth;
        setOverflow(max > 1);
        // Last dot once the row reaches its end; otherwise the card nearest the start (scroll offsets are page pixels)
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

  return (
    <section aria-labelledby={headingId} className="bg-white py-14 lg:py-[72px]">
      <div className={GUTTER}>
        <h2 id={headingId} className={SECTION_H2}>
          {title}
        </h2>
        <div ref={wrapRef} data-print="grid" className="mt-4 lg:mt-6">
          <ScrollRow className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0">
            {cards.map((c) => (
              <li key={c.title} className="w-[272px] shrink-0 snap-start lg:w-auto">
                <RelatedCard {...c} />
              </li>
            ))}
          </ScrollRow>
        </div>
        {overflow && (
          <div aria-hidden="true" data-print="hide" className="mt-4 flex items-center gap-2 lg:hidden">
            {cards.map((c, i) => (
              <span key={c.title} className={`h-2 rounded-full transition-[width,background-color] motion-reduce:transition-none ${i === active ? "w-5 bg-ink" : "w-2 bg-line"}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
