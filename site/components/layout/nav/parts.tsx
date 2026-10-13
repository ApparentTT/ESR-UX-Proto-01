"use client";

import { Fragment, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { InertLink } from "@/components/ui/InertLink";
import { SmartLink } from "@/components/ui/SmartLink";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { NAV_COPY, type LangPart, type LatestCard, type NavMarket } from "@/config/nav";
import { NAV_MAP_DOTS, NAV_MAP_H, NAV_MAP_LAND, NAV_MAP_W } from "./mapArt";

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

/** Locks page scroll while a nav layer is open (the scrollbar gutter is kept, see globals.css). */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [active]);
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
export function ExploreLink({ href, context, label = NAV_COPY.explore, className = "" }: { href: string | null; context?: string; label?: string; className?: string }) {
  const pathname = usePathname();
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

/** A market site card (desktop 4-column grid and mobile list). Market sites are not built, so cards are inert. */
export function MarketCard({ market, compact = false }: { market: NavMarket; compact?: boolean }) {
  return (
    <InertLink
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
    </InertLink>
  );
}

/** "Latest" article card (News menu, desktop row and mobile carousel). The whole card is one link. */
export function LatestCardLink({ card, className = "" }: { card: LatestCard; className?: string }) {
  return (
    <SmartLink
      href={card.href}
      className={`group flex min-h-[280px] flex-col overflow-clip rounded-[4px] border border-line bg-white shadow-[0_2px_13.4px_rgba(0,0,0,0.10)] hover:border-ink/30 ${className}`}
    >
      <ImagePlaceholder iconSize={24} className="ml-[10px] mr-[13px] mt-[11px] h-[140px] shrink-0 rounded-[4px]" />
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

function MapArt() {
  const sx = NAV_MAP_W / 100;
  const sy = NAV_MAP_H / 100;
  return (
    <svg viewBox={`0 0 ${NAV_MAP_W} ${NAV_MAP_H}`} aria-hidden="true" focusable="false" className="block size-full">
      <path d={NAV_MAP_LAND} className="fill-[#F7F7F7]" />
      {NAV_MAP_DOTS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x * sx} cy={y * sy} r={3.27} className="fill-black" />
      ))}
    </svg>
  );
}

/**
 * The "Our portfolio" map: faint land and 29 market dots on a #EEE sea, drawn at the 460 x 244 Figma frame.
 * panel: fills the space left of the stats; when narrower than 460 it crops from the left so the dots stay in view.
 * sheet: the mobile frame (390 x 214), the same art at 0.918 scale, centred as drawn.
 */
export function NavMap({ variant }: { variant: "panel" | "sheet" }) {
  if (variant === "panel")
    return (
      <div aria-hidden="true" className="relative min-w-0 flex-1 overflow-hidden bg-[#EEEEEE]">
        <div className="absolute top-0 h-[244px] w-[460px]" style={{ left: "clamp(-190px, calc(100% - 460px), 0px)" }}>
          <MapArt />
        </div>
      </div>
    );
  return (
    <div aria-hidden="true" className="relative min-h-[214px] grow overflow-hidden bg-[#EEEEEE]">
      <div className="absolute top-0 h-[224px] w-[422.3px]" style={{ left: "calc(50% - 220.3px)" }}>
        <MapArt />
      </div>
    </div>
  );
}
