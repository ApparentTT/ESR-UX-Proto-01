"use client";

import { useEffect, useRef } from "react";
import type { Property } from "@/data/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { sizeText, statusText } from "@/lib/display";

type Props = {
  items: Property[];
  selectedId: string | null;
  /** Called when a card settles in the centre, so its pin can highlight */
  onCentre: (id: string) => void;
  onNearEnd: () => void;
};

export const CAROUSEL_HEIGHT = 112;

/** Card carousel along the base of the mobile map. Swiping highlights the matching pin; tapping a pin scrolls here. */
export function MapCarousel({ items, selectedId, onCentre, onNearEnd }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  const fromScroll = useRef(false);

  // Pin tapped: bring its card into view.
  useEffect(() => {
    if (!selectedId || fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    const el = listRef.current?.querySelector<HTMLElement>(`[data-card="${selectedId}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedId]);

  // Swipe: whichever card sits in the middle becomes selected.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const mid = list.getBoundingClientRect().left + list.clientWidth / 2;
        let best: { id: string; d: number } | null = null;
        for (const el of Array.from(list.querySelectorAll<HTMLElement>("[data-card]"))) {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (!best || d < best.d) best = { id: el.dataset.card!, d };
        }
        if (best) {
          fromScroll.current = true;
          onCentre(best.id);
        }
        if (list.scrollLeft + list.clientWidth > list.scrollWidth - 400) onNearEnd();
      }, 120);
    };
    list.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      list.removeEventListener("scroll", onScroll);
    };
  }, [onCentre, onNearEnd]);

  return (
    <ul
      ref={listRef}
      aria-label="Properties on the map"
      className="no-scrollbar absolute inset-x-0 bottom-4 z-30 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4"
      style={{ height: CAROUSEL_HEIGHT - 16 }}
    >
      {items.map((p) => (
        <li key={p.id} data-card={p.id} className="w-[min(320px,82vw)] shrink-0 snap-center">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            title="Property pages are not part of this prototype"
            className={`flex h-full items-center gap-3 rounded-card bg-white p-3 shadow-panel ${selectedId === p.id ? "ring-2 ring-ink" : ""}`}
          >
            <ImagePlaceholder className="size-[72px] shrink-0 rounded-[8px]" iconSize={24} />
            <span className="min-w-0 flex-1">
              <span className="inline-block rounded-[4px] bg-surface px-1.5 py-0.5 text-[11px] font-medium">{statusText(p)}</span>
              <span className="mt-1 block truncate text-[15px] font-medium">{p.name}</span>
              <span className="block text-sm text-muted">{sizeText(p)}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
