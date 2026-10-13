"use client";

import { useId } from "react";
import { MARKET_PANEL, NAV_MARKETS } from "@/config/nav";
import { MarketCard } from "./parts";

/** "Currently viewing: Global (EN)", static text. */
export function CurrentMarket({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[14px] leading-5 text-body ${className}`}>
      {MARKET_PANEL.currentLabel} <b className="font-bold">{MARKET_PANEL.current}</b>
    </p>
  );
}

/**
 * Desktop market selector (Figma Group_Find your market 672:25832): white full-bleed panel under the
 * header, intro and "Currently viewing" over a 4-column grid of the 11 market cards (gap 12).
 */
export function MarketMenu({ id, animate }: { id: string; animate: boolean }) {
  const titleId = useId();
  return (
    <div id={id} className={`absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain bg-white ${animate ? "anim-pop" : ""}`}>
      <div className="mx-auto max-w-[1440px] px-[67px] pb-[81px] pt-[26px]">
        <div className="flex items-start justify-between gap-6">
          <div className="text-[14px] leading-5 text-body">
            <p id={titleId} className="font-bold">
              {MARKET_PANEL.title}
            </p>
            <p>{MARKET_PANEL.body}</p>
          </div>
          <CurrentMarket className="text-right" />
        </div>
        <ul aria-labelledby={titleId} className="mt-[18px] grid grid-cols-4 gap-3">
          {NAV_MARKETS.map((m) => (
            <li key={m.name}>
              <MarketCard market={m} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
