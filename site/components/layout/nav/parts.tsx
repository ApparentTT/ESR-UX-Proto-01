"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { HIT } from "@/components/ui/type";
import { GROUP_SITE_SUFFIX } from "@/config/local-nav";
import { MARKET_SITE_HREF, NAV_COPY, type LangPart, type LatestCard, type NavMarket } from "@/config/nav";
import { NAV_MAP_DOTS, NAV_MAP_FOCUS, NAV_MAP_H, NAV_MAP_LAND, NAV_MAP_W, navMapPoint } from "./mapArt";

/** Desktop nav (header items, mega menus, market panel) from this width. */
export const DESKTOP_QUERY = "(min-width: 1180px)";

/**
 * Whether a nav link is the page being viewed. Links with a query (the News type filters) also need
 * that param to match, so a free-text search does not mark every type. In-page anchors never match.
 * Only called from menus that render after an interaction, so reading window.location is hydration-safe.
 */
export function isCurrentChild(href: string | null, pathname: string) {
  if (!href || href.includes("#")) return false;
  const [path, query] = href.split("?");
  if (!query) return pathname === path;
  if (pathname !== path || typeof window === "undefined") return false;
  const have = new URLSearchParams(window.location.search);
  return [...new URLSearchParams(query)].every(([k, v]) => have.get(k) === v);
}

/**
 * Locks page scroll while a nav layer is open. A classic (space-taking) scrollbar disappears with the lock,
 * so body is padded by its width and --sb is set for the nav surfaces that run on to the window edge
 * (sb-bleed / sb-pad in globals.css): nothing shifts, and the overlay covers the whole window.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const body = document.body;
    // Overlay scrollbars measure 0; the upper bound ignores pinch-zoom differences on touch screens.
    const sb = window.innerWidth - root.clientWidth;
    const gutter = sb > 0 && sb <= 30 ? `${sb}px` : null;
    const prev = { overflow: root.style.overflow, padding: body.style.paddingRight };
    root.style.overflow = "hidden";
    if (gutter) {
      root.style.setProperty("--sb", gutter);
      body.style.paddingRight = gutter;
    }
    return () => {
      root.style.overflow = prev.overflow;
      root.style.removeProperty("--sb");
      body.style.paddingRight = prev.padding;
    };
  }, [active]);
}

/** A link click that stays on the page being viewed (same path, no in-page anchor), where focus would otherwise be lost. */
export function isSamePageLink(a: HTMLAnchorElement) {
  const url = new URL(a.href, window.location.href);
  return url.pathname === window.location.pathname && !url.hash;
}

const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** true at the desktop nav width. Server render assumes desktop; only used in layers opened by the user. */
export function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, () => window.matchMedia(DESKTOP_QUERY).matches, () => true);
}

/** "Explore" (Bold 13 underlined + arrow), with the block title as a visually hidden suffix so each link is unique. */
/**
 * "Explore" (Bold 13 underlined + arrow), with the block title as a visually hidden suffix. external: a link
 * from a local site to the ESR Group site, drawn with open_in_new 16 instead of the arrow (as on the local
 * Data centres item) and named so for screen readers.
 */
export function ExploreLink({
  href,
  context,
  label = NAV_COPY.explore,
  external,
  className = "",
}: {
  href: string | null;
  context?: string;
  label?: string;
  external?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  if (external)
    return (
      <SmartLink
        href={href}
        className={`${HIT} group inline-flex items-center gap-3 text-[13px] font-bold leading-5 text-[#393939] underline underline-offset-2 ${className}`}
      >
        {label}
        {context && <span className="sr-only"> {context}</span>}
        <span className="sr-only"> {GROUP_SITE_SUFFIX}</span>
        <Icon name="open_in_new" size={16} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
      </SmartLink>
    );
  return (
    <TextLink variant="explore" href={href} aria-current={isCurrentChild(href, pathname) ? "page" : undefined} className={className}>
      {label}
      {context && <span className="sr-only"> {context}</span>}
    </TextLink>
  );
}

/** A link marked aria-current="page" when it points at the page being viewed. */
export function CurrentLink({ href, className = "", children }: { href: string | null; className?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <SmartLink href={href} aria-current={isCurrentChild(href, pathname) ? "page" : undefined} className={className}>
      {children}
    </SmartLink>
  );
}

/** Language names joined with " · ", non-English names tagged with their language. */
export function Languages({ parts }: { parts: LangPart[] }) {
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={p.text}>
          {i > 0 && " · "}
          <span lang={p.lang}>{p.text}</span>
        </Fragment>
      ))}
    </>
  );
}

/** A market site card (desktop 4-column grid and mobile list). Every market goes to the Japan local site (MARKET_SITE_HREF). */
export function MarketCard({ market, compact = false }: { market: NavMarket; compact?: boolean }) {
  return (
    <SmartLink
      href={MARKET_SITE_HREF}
      className={`group flex h-full items-start gap-6 rounded-card border border-line bg-white hover:border-ink/30 ${
        compact ? "py-2 pl-3 pr-6" : "min-h-24 px-3 py-6"
      }`}
    >
      {/* The spaces keep the parts apart in the link's accessible name ("Asia Greater China 简体中文 · English") */}
      <Tag className={compact ? "w-[73px] shrink-0 justify-center whitespace-nowrap px-1!" : "shrink-0 whitespace-nowrap"}>{market.region}</Tag>{" "}
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[15px] font-bold leading-5 text-ink group-hover:underline">{market.name}</span>{" "}
        <span className="text-[14px] font-medium leading-5 text-muted">
          <Languages parts={(compact && market.mobileLanguages) || market.languages} />
        </span>
      </span>
    </SmartLink>
  );
}

/** "Latest" article card (News menu, desktop row and mobile carousel). The whole card is one link. */
export function LatestCardLink({ card, className = "" }: { card: LatestCard; className?: string }) {
  return (
    <SmartLink
      href={card.href}
      className={`group flex min-h-[280px] flex-col overflow-clip rounded-[4px] border border-line bg-white shadow-[0_2px_13.4px_rgba(0,0,0,0.10)] hover:border-ink/30 ${className}`}
    >
      <ImagePlaceholder iconSize={24} className="ml-[10px] mr-[11px] mt-[11px] h-[140px] shrink-0 rounded-[4px]" />
      <span className="mt-[15px] block pl-3 pr-5">
        <span className="block text-[14px] font-bold leading-5 text-body group-hover:underline">{card.title}</span>
        <span className="block text-[10px] leading-5 text-body">{card.text}</span>
      </span>
      <span aria-hidden="true" className="mb-3 mr-3 mt-auto inline-flex size-8 shrink-0 items-center justify-center self-end rounded-full bg-line">
        <Icon name="arrow_forward" size={18} className="text-ink transition-transform group-hover:translate-x-0.5" />
      </span>
    </SmartLink>
  );
}

/** Status text read out (politely) when a market is chosen for the Our portfolio map, or all markets again. */
export const marketFocusMessage = (market: string | null) => (market ? `Map zoomed to ${market}. ESR at a glance: ${market}.` : "Map showing all APAC markets.");

/** The map's art frame in each variant: size, its left edge for a container W wide, and the dot radius. */
const MAP_FRAMES = {
  // Fills the space left of the stats; when narrower than 460 it crops from the left (up to 190) so the dots stay in view
  panel: { w: NAV_MAP_W, h: NAV_MAP_H, css: "clamp(-190px, calc(100% - 460px), 0px)", left: (W: number) => Math.min(0, Math.max(-190, W - NAV_MAP_W)) },
  // The mobile frame (390 x 214): the same art at 0.918 scale, centred as drawn
  sheet: { w: 422.3, h: 224, css: "calc(50% - 220.3px)", left: (W: number) => W / 2 - 220.3 },
} as const;

/** Zoom moves: the land and every dot travel together (instant with reduced motion). */
const MOVE = "transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

/** Keeps v within [lo, hi]; centres it when the range is empty (the art is smaller than the view). */
const within = (v: number, lo: number, hi: number) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));

/**
 * The "Our portfolio" map: faint land and 29 market dots on a #EEE sea, drawn at the 460 x 244 Figma frame.
 * panel: fills the space left of the stats. sheet: the mobile frame.
 * focus (a market name): the land zooms in on that market (a scale and move on the art) and the dots move
 * with it at their own size, as far as the art allows without showing its edge. null is the drawn APAC view.
 */
export function NavMap({ variant, focus = null }: { variant: "panel" | "sheet"; focus?: string | null }) {
  const frame = MAP_FRAMES[variant];
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  // The zoom is worked out against the map's size; the APAC view needs no measuring (the frame sits by CSS).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setBox((b) => (b && b.w === el.clientWidth && b.h === el.clientHeight ? b : { w: el.clientWidth, h: el.clientHeight }));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const k = frame.w / NAV_MAP_W;
  const target = focus ? NAV_MAP_FOCUS[focus] : undefined;
  let tx = 0;
  let ty = 0;
  let s = 1;
  if (target && box) {
    const [x, y] = navMapPoint(target.lon, target.lat);
    const left = frame.left(box.w);
    s = target.zoom;
    // Bring the market to the middle of the view, keeping the art's edges outside it
    tx = within(box.w / 2 - left - s * x * k, box.w - left - s * frame.w, -left);
    ty = within(box.h / 2 - s * y * k, box.h - s * frame.h, 0);
  }
  const r = 3.27 * k;

  return (
    <div ref={ref} aria-hidden="true" className={`relative overflow-hidden bg-[#EEEEEE] ${variant === "panel" ? "min-w-0 flex-1" : "min-h-[214px] grow"}`}>
      <div className="absolute top-0" style={{ left: frame.css, width: frame.w, height: frame.h }}>
        <svg
          viewBox={`0 0 ${NAV_MAP_W} ${NAV_MAP_H}`}
          focusable="false"
          className={`absolute inset-0 block size-full origin-top-left ${MOVE}`}
          style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})` }}
        >
          <path d={NAV_MAP_LAND} className="fill-[#F7F7F7]" />
        </svg>
        {NAV_MAP_DOTS.map(([x, y]) => (
          <span
            key={`${x}-${y}`}
            className={`absolute left-0 top-0 rounded-full bg-black ${MOVE}`}
            style={{ width: r * 2, height: r * 2, transform: `translate(${tx + s * (x / 100) * frame.w - r}px, ${ty + s * (y / 100) * frame.h - r}px)` }}
          />
        ))}
      </div>
    </div>
  );
}
