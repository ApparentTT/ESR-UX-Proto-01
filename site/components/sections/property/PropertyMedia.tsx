"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { ScrollRow } from "@/components/sections/cards/ScrollRow";
import { pageScale } from "@/lib/pageScale";

export type PropertyMediaItem = { kind: "video" | "image"; height: number };

/**
 * Media column (1138:10624): a video, then four images, stacked 30px apart at the drawn 649px column width
 * (heights kept as aspect ratios). Below 1024 (mobile 1273:90949): one sideways scroll-snap row of uniform 326 x 392 tiles (4:3 at 768), each ~88%
 * wide, with a grey round arrow on the right edge (and a back arrow once scrolled). The video is a placeholder:
 * its play button is an inert link (the "not part of the prototype" notice). Hidden in print.
 */
export function PropertyMedia({ items, name }: { items: PropertyMediaItem[]; name: string }) {
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
        const next = { start: row.scrollLeft <= 1, end: max <= 1 || row.scrollLeft >= max - 1 };
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: dir * (item.getBoundingClientRect().width / pageScale() + 16), behavior: reduce ? "auto" : "smooth" });
  };

  const arrow = (dir: 1 | -1) => (
    <button
      type="button"
      onClick={() => step(dir)}
      aria-label={dir === 1 ? "Next image" : "Previous image"}
      className={`absolute top-1/2 z-[1] flex size-11 -translate-y-1/2 items-center justify-center rounded-full lg:hidden ${dir === 1 ? "right-2" : "left-2"}`}
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-[#9CA3AF] text-ink shadow-sm">
        <Icon name={dir === 1 ? "arrow_forward" : "arrow_back"} size={18} />
      </span>
    </button>
  );

  return (
    <div ref={wrapRef} className="relative" data-print-hide role="group" aria-label={`Images of ${name}`}>
      <ScrollRow className="no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:flex-col lg:gap-[30px] lg:overflow-visible lg:px-0">
        {items.map((m, i) => (
          <li key={i} className="w-[88%] shrink-0 snap-start md:w-[70%] lg:w-full">
            <div
              className="relative aspect-[326/392] overflow-hidden rounded-control border border-muted md:aspect-[4/3] lg:aspect-[var(--ar)]"
              style={{ "--ar": `649 / ${m.height}` } as React.CSSProperties}
            >
              <ImagePlaceholder className="absolute inset-0" iconSize={48} icon={m.kind === "image"} />
              {m.kind === "video" && (
                <SmartLink href={null} aria-label={`Play video of ${name}`} className="absolute inset-0 flex items-center justify-center text-white">
                  <Icon name="play_arrow" size={72} filled />
                </SmartLink>
              )}
            </div>
          </li>
        ))}
      </ScrollRow>
      {!edges.start && arrow(-1)}
      {!edges.end && arrow(1)}
    </div>
  );
}
