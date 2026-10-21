"use client";

import { useEffect, useRef, useState } from "react";

/** "US $31.8B" → prefix "US $", 31.8 (1 decimal), suffix "B". Values with no number ("XX", "XXX MW") stay as written. */
const NUMBER = /^(\D*?)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/;
const DURATION = 1400;

function parse(value: string) {
  const m = NUMBER.exec(value);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, suffix, target: parseFloat(num.replace(/,/g, "")), decimals, commas: num.includes(",") };
}

function format(n: number, p: NonNullable<ReturnType<typeof parse>>) {
  const fixed = n.toFixed(p.decimals);
  if (!p.commas) return fixed;
  const [int, dec] = fixed.split(".");
  return Number(int).toLocaleString("en-US") + (dec ? `.${dec}` : "");
}

/**
 * A big stat value that counts up from zero when it scrolls into view (once), and again when the value
 * changes (e.g. a Local / Group toggle). Ease-out over ~1.4s; instant under reduced motion. The final value
 * is always in the DOM: it holds the width (no reflow while counting), is what screen readers read, and is
 * what prints.
 */
export function CountUp({ value }: { value: string }) {
  const parsed = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<string | null>(parsed ? format(0, parsed) : null);
  const seen = useRef(false);

  useEffect(() => {
    const p = parse(value);
    const el = ref.current;
    if (!p || !el) return;
    let raf = 0;
    const run = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(null);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(t < 1 ? format(p.target * eased, p) : null);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (seen.current) {
      run();
      return () => cancelAnimationFrame(raf);
    }
    setShown(format(0, p));
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        seen.current = true;
        io.disconnect();
        run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  if (!parsed) return <>{value}</>;
  return (
    <span ref={ref} className="inline-grid">
      {/* The final value: reserves the width, read by screen readers, printed */}
      <span className={`[grid-area:1/1] ${shown === null ? "" : "opacity-0 print:opacity-100"}`}>{value}</span>
      {shown !== null && (
        <span aria-hidden="true" className="[grid-area:1/1] tabular-nums print:hidden">
          {parsed.prefix}
          {shown}
          {parsed.suffix}
        </span>
      )}
    </span>
  );
}
