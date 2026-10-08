"use client";

import { useCallback, useRef, useState } from "react";
import { HISTOGRAM_BINS, SIZE_MAX, SIZE_MIN, SIZE_STEP, fmt, sizeHistogram, type Filters } from "@/lib/filters";

type Props = { draft: Filters; onDraft: (f: Filters) => void };
type Handle = "min" | "max";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const snap = (v: number) => Math.round(v / SIZE_STEP) * SIZE_STEP;
const pct = (v: number) => ((v - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)) * 100;
const MIN_GAP = SIZE_STEP;

/**
 * Dual-handle range slider over a histogram of where stock actually sits.
 * Min at the far left means no minimum; max at the far right means no maximum.
 * Dragging updates the draft continuously, so the footer count moves with the handle.
 */
export function SizeRange({ draft, onDraft }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Handle | null>(null);
  const [dragging, setDragging] = useState(false);

  const lo = draft.min ?? SIZE_MIN;
  const hi = draft.max ?? SIZE_MAX;
  const { bins, width } = sizeHistogram(draft);
  const peak = Math.max(1, ...bins);

  const commit = useCallback(
    (h: Handle, raw: number) => {
      if (h === "min") {
        const v = clamp(snap(raw), SIZE_MIN, hi - MIN_GAP);
        onDraft({ ...draft, min: v <= SIZE_MIN ? null : v });
      } else {
        const v = clamp(snap(raw), lo + MIN_GAP, SIZE_MAX);
        onDraft({ ...draft, max: v >= SIZE_MAX ? null : v });
      }
    },
    [draft, onDraft, lo, hi],
  );

  const valueAt = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return SIZE_MIN + clamp((clientX - r.left) / r.width, 0, 1) * (SIZE_MAX - SIZE_MIN);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const v = valueAt(e.clientX);
    // Grab the nearer handle; on a tie, the one that can move toward the pointer.
    const h: Handle = Math.abs(v - lo) < Math.abs(v - hi) || (lo === hi && v < lo) ? "min" : "max";
    setActive(h);
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    commit(h, v);
    requestAnimationFrame(() => trackRef.current?.parentElement?.querySelector<HTMLElement>(`[data-handle="${h}"]`)?.focus({ preventScroll: true }));
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !active) return;
    commit(active, valueAt(e.clientX));
  };
  const endDrag = () => setDragging(false);

  const onKey = (h: Handle) => (e: React.KeyboardEvent) => {
    const cur = h === "min" ? lo : hi;
    const big = 5000;
    const next =
      e.key === "ArrowLeft" || e.key === "ArrowDown" ? cur - SIZE_STEP
      : e.key === "ArrowRight" || e.key === "ArrowUp" ? cur + SIZE_STEP
      : e.key === "PageDown" ? cur - big
      : e.key === "PageUp" ? cur + big
      : e.key === "Home" ? SIZE_MIN
      : e.key === "End" ? SIZE_MAX
      : null;
    if (next == null) return;
    e.preventDefault();
    commit(h, next);
  };

  const valueText = (h: Handle) =>
    h === "min" ? (draft.min == null ? "No minimum" : `${fmt(lo)} sqm`) : draft.max == null ? "No maximum" : `${fmt(hi)} sqm`;
  const bubble = (h: Handle) => (h === "min" ? (draft.min == null ? "Any" : fmt(lo)) : draft.max == null ? `${fmt(SIZE_MAX)}+` : fmt(hi));

  return (
    <div className="select-none pt-6">
      {/* Histogram: bars inside the range are dark, outside are light */}
      <div aria-hidden="true" className="mx-3 flex h-14 items-end gap-[3px]">
        {bins.map((n, i) => {
          const start = SIZE_MIN + i * width;
          const mid = start + width / 2;
          const inRange = mid >= lo && (draft.max == null ? true : mid <= hi);
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-[2px] transition-[background-color,height] duration-150 ${inRange ? "bg-ink" : "bg-line"}`}
              style={{ height: n === 0 ? 2 : `${Math.max(8, (n / peak) * 100)}%` }}
              title={`${fmt(start)}–${i === HISTOGRAM_BINS - 1 ? "+" : fmt(start + width)} sqm: ${n}`}
            />
          );
        })}
      </div>

      {/* Track: tall hit area for touch, thin visible line */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mx-3 h-11 cursor-pointer touch-none"
      >
        <div className="absolute inset-x-[-12px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        {(["min", "max"] as Handle[]).map((h) => {
          const v = h === "min" ? lo : hi;
          const isActive = active === h && dragging;
          return (
            <div key={h} className="absolute top-1/2" style={{ left: `${pct(v)}%`, zIndex: active === h ? 2 : 1 }}>
              {isActive && (
                <span className="anim-pop absolute bottom-[22px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-ink px-2 py-1 text-xs font-medium tabular-nums text-white">
                  {bubble(h)}
                </span>
              )}
              <span
                data-handle={h}
                role="slider"
                tabIndex={0}
                aria-label={h === "min" ? "Minimum size" : "Maximum size"}
                aria-valuemin={SIZE_MIN}
                aria-valuemax={SIZE_MAX}
                aria-valuenow={v}
                aria-valuetext={valueText(h)}
                onKeyDown={onKey(h)}
                onFocus={() => setActive(h)}
                className={`absolute left-0 top-0 block size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-white transition-transform duration-100 ${
                  isActive ? "scale-110 shadow-[0_0_0_6px_rgb(17_24_38/0.1)]" : "hover:scale-105"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
