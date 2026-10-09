"use client";

import { useEffect, useRef, useState } from "react";
import type { Property } from "@/data/types";
import { PropertyCard, SkeletonCard } from "./PropertyCard";
import { Icon } from "@/components/ui/Icon";
import { PAGE_SIZE } from "@/config/prototype";

type Props = {
  items: Property[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  /** "pane": the list scrolls inside its own container (desktop). "page": the window scrolls (mobile and tablet). */
  scrollMode: "pane" | "page";
  paneRef: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.MutableRefObject<Map<string, HTMLElement>>;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
};

export function ResultsList({ items, hasMore, loading, onLoadMore, scrollMode, paneRef, cardRefs, hoveredId, selectedId, onHover }: Props) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  // Infinite scroll: load the next batch as the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && onLoadMore(), {
      root: scrollMode === "pane" ? paneRef.current : null,
      rootMargin: "0px 0px 400px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, onLoadMore, scrollMode, paneRef, items.length]);

  // Back to top appears once the user is past the first batch.
  useEffect(() => {
    const target: HTMLElement | Window | null = scrollMode === "pane" ? paneRef.current : window;
    if (!target) return;
    const onScroll = () => {
      const firstOfSecond = items[PAGE_SIZE] ? cardRefs.current.get(items[PAGE_SIZE].id) : null;
      if (!firstOfSecond) return setShowTop(false);
      const top = firstOfSecond.getBoundingClientRect().top;
      const limit = scrollMode === "pane" ? paneRef.current!.getBoundingClientRect().bottom : window.innerHeight;
      setShowTop(top < limit);
    };
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollMode, paneRef, items, cardRefs]);

  const toTop = () => {
    if (scrollMode === "pane") paneRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    else paneRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const first = items[0] && cardRefs.current.get(items[0].id);
    first?.querySelector("a")?.focus({ preventScroll: true });
  };

  return (
    <>
      <h2 className="sr-only">Results</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5" aria-label="Properties">
        {items.map((p) => (
          <li key={p.id} className="flex flex-col [&>article]:flex-1">
            <PropertyCard
              property={p}
              active={hoveredId === p.id || selectedId === p.id}
              onHover={onHover}
              ref={(el) => {
                if (el) cardRefs.current.set(p.id, el);
                else cardRefs.current.delete(p.id);
              }}
            />
          </li>
        ))}
        {loading && (
          <>
            <li aria-hidden="true">
              <SkeletonCard />
            </li>
            <li aria-hidden="true" className="hidden md:block">
              <SkeletonCard />
            </li>
          </>
        )}
      </ul>

      <div ref={sentinel} className="h-px" />
      <div aria-live="polite" className="flex min-h-14 items-center justify-center gap-2 py-4 text-sm text-muted-surface">
        {loading ? (
          <>
            <Icon name="progress_activity" className="spin" />
            Loading more properties
          </>
        ) : !hasMore && items.length > PAGE_SIZE ? (
          <>You have seen all {items.length} properties</>
        ) : null}
      </div>

      {showTop && (
        <div className={`pointer-events-none z-20 flex justify-center ${scrollMode === "pane" ? "sticky bottom-5" : "fixed inset-x-0 bottom-5"}`}>
          <button
            type="button"
            onClick={toTop}
            className="anim-pop pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium shadow-panel"
          >
            <Icon name="arrow_upward" />
            Back to top
          </button>
        </div>
      )}
    </>
  );
}
