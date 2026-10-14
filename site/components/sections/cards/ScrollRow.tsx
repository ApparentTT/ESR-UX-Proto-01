"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { pageScale } from "@/lib/pageScale";

/**
 * A card list that can be a horizontal scroll-snap row at small widths (its classes decide).
 * When a card inside receives keyboard focus while only partly visible, the row scrolls it fully into
 * view (respecting the row's scroll-padding and prefers-reduced-motion). Once the classes switch the row
 * to a static grid (overflow visible), the handler does nothing.
 *
 * `indicator` adds a slider under the row (MarketCards): see ScrollIndicator.
 */
export function ScrollRow({
  className = "",
  indicator,
  children,
}: {
  className?: string;
  /** Show a scroll indicator under the row; the string is extra classes on it (e.g. "xl:hidden") */
  indicator?: boolean | string;
  children: React.ReactNode;
}) {
  const rowRef = useRef<HTMLUListElement>(null);
  const onFocus = (e: React.FocusEvent<HTMLUListElement>) => {
    const row = e.currentTarget;
    const item = (e.target as HTMLElement).closest("li");
    if (!item || row.scrollWidth <= row.clientWidth) return;
    const cs = getComputedStyle(row);
    if (cs.overflowX === "visible") return;
    const padL = parseFloat(cs.scrollPaddingLeft) || 0;
    const padR = parseFloat(cs.scrollPaddingRight) || 0;
    const r = row.getBoundingClientRect();
    const it = item.getBoundingClientRect();
    let delta = 0;
    if (it.left < r.left + padL) delta = it.left - (r.left + padL);
    else if (it.right > r.right - padR) delta = Math.min(it.right - (r.right - padR), it.left - (r.left + padL));
    if (!delta) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: delta / pageScale(), behavior: reduce ? "auto" : "smooth" });
  };
  const list = (
    <ul ref={rowRef} role="list" className={className} onFocus={onFocus}>
      {children}
    </ul>
  );
  if (!indicator) return list;
  return (
    <>
      {list}
      <ScrollIndicator rowRef={rowRef} className={typeof indicator === "string" ? indicator : ""} />
    </>
  );
}

type Metrics = { show: boolean; size: number; pos: number };

/**
 * Slider under a scrolling row: a 4px line-grey track with a muted thumb sized to the visible share of the
 * row, tracking its scroll. Drag the thumb to scroll (snap is paused while dragging), or click / tap the
 * track to jump there. Shown only while the row overflows. Pointer only and hidden from assistive tech:
 * keyboard users scroll the row by tabbing through its cards (ScrollRow keeps the focused card in view).
 * Sits ~30px under the cards (with the row's 8px bottom padding), in a 24px-tall hit area.
 */
function ScrollIndicator({ rowRef, className = "" }: { rowRef: RefObject<HTMLUListElement | null>; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; ratio: number } | null>(null);
  const [m, setM] = useState<Metrics>({ show: true, size: 0.3, pos: 0 });

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = row.scrollWidth - row.clientWidth;
        const show = max > 1 && getComputedStyle(row).overflowX !== "visible";
        const next = { show, size: show ? row.clientWidth / row.scrollWidth : 1, pos: show ? Math.min(1, Math.max(0, row.scrollLeft / max)) : 0 };
        setM((cur) => (cur.show === next.show && cur.size === next.size && cur.pos === next.pos ? cur : next));
      });
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(row);
    Array.from(row.children).forEach((c) => ro.observe(c));
    return () => {
      cancelAnimationFrame(frame);
      row.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [rowRef]);

  const geometry = () => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return null;
    const r = track.getBoundingClientRect();
    const thumbW = m.size * r.width;
    const max = row.scrollWidth - row.clientWidth;
    return { row, r, thumbW, thumbL: r.left + m.pos * (r.width - thumbW), max, ratio: max / Math.max(1, r.width - thumbW) };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const g = geometry();
    if (!g) return;
    const { row, r, thumbW, thumbL, max, ratio } = g;
    let start = row.scrollLeft;
    if (e.clientX < thumbL || e.clientX > thumbL + thumbW) {
      // Jump: centre the thumb on the pointer, then keep dragging from there.
      start = Math.min(max, Math.max(0, (e.clientX - r.left - thumbW / 2) * ratio));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollTo({ left: start, behavior: reduce ? "auto" : "smooth" });
    }
    drag.current = { x: e.clientX, scroll: start, ratio };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const row = rowRef.current;
    if (!d || !row) return;
    if (Math.abs(e.clientX - d.x) > 2) row.style.scrollSnapType = "none";
    row.scrollLeft = d.scroll + (e.clientX - d.x) * d.ratio;
  };

  const endDrag = () => {
    drag.current = null;
    const row = rowRef.current;
    if (row) row.style.scrollSnapType = "";
  };

  return (
    <div
      aria-hidden="true"
      hidden={!m.show}
      className={`group mt-3 cursor-pointer touch-pan-y select-none py-2.5 ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="relative h-1 rounded-full bg-line">
        <div
          className="absolute inset-y-0 rounded-full bg-muted transition-colors group-hover:bg-ink group-active:bg-ink motion-reduce:transition-none"
          style={{ width: `${m.size * 100}%`, left: `${m.pos * (1 - m.size) * 100}%` }}
        />
      </div>
    </div>
  );
}
