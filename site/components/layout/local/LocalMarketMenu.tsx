"use client";

import { useId } from "react";
import { MarketCard } from "@/components/layout/nav/parts";
import { MARKET_PANEL, NAV_MARKETS } from "@/config/nav";
import { LOCAL_SITE } from "@/config/local-nav";
import { CURRENT_MARKET_CARD, GroupSiteCard } from "./parts";

/** "Currently viewing: Japan (EN)", static text. */
function CurrentMarket({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[14px] leading-5 text-body ${className}`}>
      {MARKET_PANEL.currentLabel} <b className="font-bold">{LOCAL_SITE.current}</b>
    </p>
  );
}

/**
 * Local market selector (Figma 672:26096): the group market panel under the 112px local header, reading
 * "Currently viewing: Japan (EN)" with the Japan card drawn with a dark border. The market cards are the
 * group's own (every market goes to this local site for now); the ESR Group card is added at the end.
 */
export function LocalMarketMenu({ id, labelledBy, animate }: { id: string; labelledBy: string; animate: boolean }) {
  const titleId = useId();
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`sb-pad absolute inset-x-0 top-full max-h-[calc(var(--full-h)-112px)] overflow-y-auto overscroll-contain bg-white ${animate ? "anim-pop" : ""}`}
    >
      <div className="mx-auto max-w-(--page-max) px-[67px] pb-[81px] pt-[26px]">
        <div className="flex items-start justify-between gap-6">
          <div className="text-[14px] leading-5 text-body">
            <h2 id={titleId} className="font-bold">
              {MARKET_PANEL.title}
            </h2>
            <p>{MARKET_PANEL.body}</p>
          </div>
          <CurrentMarket className="text-right" />
        </div>
        <ul aria-labelledby={titleId} className="mt-[18px] grid grid-cols-4 gap-3">
          {NAV_MARKETS.map((m) => (
            <li key={m.name} className={m.name === LOCAL_SITE.market ? CURRENT_MARKET_CARD : undefined}>
              <MarketCard market={m} />
            </li>
          ))}
          <li>
            <GroupSiteCard />
          </li>
        </ul>
      </div>
    </div>
  );
}

/** Mobile market list (Figma 719:1563): intro, current market, one column of compact cards. */
export function LocalMarketList() {
  const uid = useId();
  return (
    <div className="px-4 pb-[33px] pt-4">
      <div className="text-[14px] leading-5 text-body">
        <h2 id={uid} className="font-bold">
          {MARKET_PANEL.title}
        </h2>
        <p>{MARKET_PANEL.body}</p>
      </div>
      <CurrentMarket className="mt-[21px]" />
      <ul aria-labelledby={uid} className="mt-5 flex flex-col gap-2">
        {NAV_MARKETS.map((m) => (
          <li key={m.name} className={m.name === LOCAL_SITE.market ? CURRENT_MARKET_CARD : undefined}>
            <MarketCard market={m} compact />
          </li>
        ))}
        <li>
          <GroupSiteCard compact />
        </li>
      </ul>
    </div>
  );
}
