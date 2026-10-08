"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

/** Direct links so the client can jump to any state without producing it themselves. */
const STATES: { n: number; label: string; href: string }[] = [
  { n: 1, label: "First visit", href: "/properties" },
  { n: 2, label: "All filters panel", href: "/properties/search?pref=kanagawa,tokyo&type=logistics,business-park&min=5000&max=20000&avail=12m&panel=all" },
  { n: 3, label: "Results", href: "/properties/search" },
  { n: 4, label: "Results with filters applied", href: "/properties/search?pref=kanagawa,tokyo&type=logistics,business-park&min=5000&max=20000&avail=12m" },
  { n: 5, label: "Results scrolled (loading more)", href: "/properties/search?pref=kanagawa&demo=scrolled" },
  { n: 6, label: "No results", href: "/properties/search?q=aomori&type=cold-storage&min=20000" },
];

/** A shape drawn around the Kawasaki and Yokohama waterfront, as a worked example of a drawn area. */
const EXAMPLE_AREA = "35.620_139.600,35.600_139.830,35.450_139.830,35.300_139.690,35.380_139.520";

const MAP_LINKS: { label: string; href: string; icon: string; mobileOnly?: boolean }[] = [
  { label: "Draw your own area", href: "/properties/search?pref=kanagawa&draw=1", icon: "gesture" },
  { label: "Results in a drawn area", href: `/properties/search?area=${EXAMPLE_AREA}`, icon: "pentagon" },
  { label: "Map view with card carousel", href: "/properties/search?pref=kanagawa&view=map", icon: "map", mobileOnly: true },
];

const PANELS: { label: string; href: string }[] = [
  { label: "Location", href: "/properties/search?panel=location" },
  { label: "Property type", href: "/properties/search?type=logistics,business-park&panel=type" },
  { label: "Size", href: "/properties/search?min=5000&max=20000&panel=size" },
  { label: "Availability", href: "/properties/search?avail=now&panel=avail" },
];

export function PrototypeBadge() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!pathname?.startsWith("/properties")) return null;

  const link = "flex min-h-10 items-center gap-3 rounded-btn px-2 text-sm hover:bg-surface focus-inset";

  return (
    <div ref={wrapRef} className="fixed bottom-4 right-4 z-40 flex flex-col items-end [[data-mobile-map]_&]:bottom-[132px]">
      {open && (
        <div
          id="prototype-panel"
          role="dialog"
          aria-label="Prototype"
          className="anim-pop mb-3 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-card border border-line bg-white shadow-panel"
        >
          <div className="max-h-[min(560px,calc(100dvh-120px))] overflow-y-auto p-4">
            <p className="text-[13px] leading-relaxed text-muted">
              This is a wireframe prototype. Content and imagery are placeholder, figures are indicative, and the map is simulated.
            </p>

            <h2 className="mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Jump to a state</h2>
            <ul className="mt-1">
              {STATES.map((s) => (
                <li key={s.n}>
                  <Link href={s.href} onClick={() => setOpen(false)} className={link}>
                    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-medium tabular-nums">{s.n}</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Filter panels</h2>
            <ul className="mt-1 grid grid-cols-2 gap-x-2">
              {PANELS.map((p) => (
                <li key={p.label}>
                  <Link href={p.href} onClick={() => setOpen(false)} className={link}>
                    <Icon name="tune" size={18} className="text-muted" />
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Map</h2>
            <ul className="mt-1">
              {MAP_LINKS.filter((m) => !m.mobileOnly).map((m) => (
                <li key={m.label}>
                  <Link href={m.href} onClick={() => setOpen(false)} className={link}>
                    <Icon name={m.icon} size={18} className="text-muted" />
                    {m.label}
                  </Link>
                </li>
              ))}
              {MAP_LINKS.filter((m) => m.mobileOnly).map((m) => (
                <li key={m.label} className="lg:hidden">
                  <Link href={m.href} onClick={() => setOpen(false)} className={link}>
                    <Icon name={m.icon} size={18} className="text-muted" />
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="prototype-panel"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-ink pl-3 pr-4 text-[13px] font-medium text-white shadow-panel"
      >
        <Icon name={open ? "close" : "science"} size={18} />
        Prototype
      </button>
    </div>
  );
}
