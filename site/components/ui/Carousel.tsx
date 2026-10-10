"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Shared carousel state (inventory A9). No autoplay. Swipe on touch via pointer events.
 * `loop` wraps around; otherwise prev/next disable at the ends.
 */
export function useCarousel(count: number, { loop = false }: { loop?: boolean } = {}) {
  const [index, setIndex] = useState(0);
  const go = useCallback((i: number) => setIndex(loop ? (i + count) % count : Math.max(0, Math.min(count - 1, i))), [count, loop]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);
  const canPrev = loop || index > 0;
  const canNext = loop || index < count - 1;

  // Horizontal swipe: 40px threshold, ignores vertical scrolls.
  const start = useRef<{ x: number; y: number } | null>(null);
  const swipe = {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return;
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: React.PointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.clientX - s.x;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y)) (dx < 0 ? next : prev)();
    },
  };
  return { index, go, next, prev, canPrev, canNext, swipe };
}

/** Bold ">" chevron with no box. lg: 60px hit area; sm: 40px. */
export function ChevronArrow({ dir, onClick, disabled, size = "lg", label, className = "" }: { dir: "prev" | "next"; onClick: () => void; disabled?: boolean; size?: "lg" | "sm"; label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label ?? (dir === "next" ? "Next slide" : "Previous slide")}
      className={`inline-flex items-center justify-center rounded-btn text-muted transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30 ${size === "lg" ? "size-[60px]" : "size-10"} ${className}`}
    >
      <Icon name={dir === "next" ? "chevron_right" : "chevron_left"} size={size === "lg" ? 48 : 32} />
    </button>
  );
}

/** Thin ← / → arrows in a 64px hit area (quote carousels). */
export function LineArrow({ dir, onClick, disabled, label, className = "" }: { dir: "prev" | "next"; onClick: () => void; disabled?: boolean; label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label ?? (dir === "next" ? "Next" : "Previous")}
      className={`inline-flex size-12 items-center justify-center rounded-btn text-ink hover:bg-black/5 disabled:opacity-30 lg:size-16 ${className}`}
    >
      <Icon name={dir === "next" ? "arrow_forward" : "arrow_back"} size={24} />
    </button>
  );
}

/** 32px outlined circle arrows; grey when disabled. */
export function CircleArrow({ dir, onClick, disabled, label }: { dir: "prev" | "next"; onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label ?? (dir === "next" ? "Next" : "Previous")}
      className="inline-flex size-11 items-center justify-center rounded-full text-ink disabled:text-[#9CA3AF]"
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full border-2 border-current">
        <Icon name={dir === "next" ? "arrow_forward" : "arrow_back"} size={18} />
      </span>
    </button>
  );
}

/** 8px dots, 16px gap. Each dot is a button. */
export function PagerDots({ count, index, onGo, className = "", tone = "dark", itemLabel = "slide" }: { count: number; index: number; onGo: (i: number) => void; className?: string; tone?: "dark" | "light"; itemLabel?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onGo(i)}
          aria-label={`Go to ${itemLabel} ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          className="inline-flex size-6 items-center justify-center rounded-full"
        >
          <span className={`block size-2 rounded-full transition-colors ${i === index ? (tone === "dark" ? "bg-[#756F6F]" : "bg-white") : "bg-[#C0C0C0]"}`} />
        </button>
      ))}
    </div>
  );
}

/** 30x10 bars, 12px gap (employee quote carousel). */
export function PagerBars({ count, index, onGo, className = "", itemLabel = "slide" }: { count: number; index: number; onGo: (i: number) => void; className?: string; itemLabel?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <button key={i} type="button" onClick={() => onGo(i)} aria-label={`Go to ${itemLabel} ${i + 1}`} aria-current={i === index ? "true" : undefined} className="inline-flex h-6 items-center">
          <span className={`block h-2.5 w-[30px] transition-colors ${i === index ? "bg-white ring-1 ring-black/10" : "bg-[#D9D9D9]"}`} />
        </button>
      ))}
    </div>
  );
}

/** "01/11" counter. */
export function PagerFraction({ index, count, className = "", live = true }: { index: number; count: number; className?: string; /** false when the carousel announces its own richer status */ live?: boolean }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <p aria-live={live ? "polite" : undefined} className={`text-[17px] leading-8 tabular-nums text-ink lg:text-[20px] ${className}`}>
      <span className="sr-only">Slide </span>
      {pad(index + 1)}/{pad(count)}
    </p>
  );
}
