"use client";

import { useId } from "react";
import { CurrentMarket, MarketColumns } from "@/components/layout/nav/MarketMenu";
import { MarketRow } from "@/components/layout/nav/parts";
import { MARKET_PANEL, NAV_MARKETS } from "@/config/nav";
import { GROUP_SITE_ROW, LOCAL_SITE } from "@/config/local-nav";

/** The market rows, then the ESR Group row (English to the group home, its other languages inert). */
function rows() {
  const g = GROUP_SITE_ROW;
  return [
    ...NAV_MARKETS.map((m) => (
      // This site is Japan in English: that link is marked as the version being viewed
      <MarketRow key={m.name} name={m.name} languages={m.languages} current={m.name === LOCAL_SITE.market ? "English" : undefined} />
    )),
    <MarketRow key={g.name} name={g.name} languages={g.languages} hrefFor={(p) => (p.lang ? null : g.href)} />,
  ];
}

/**
 * Local market selector (Figma 672:26096, reworked as the group panel): the group market list under the
 * 112px local header, reading "Currently viewing: Japan (EN)", with Japan's English link marked as current
 * and the ESR Group row added at the end.
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
      <div className="mx-auto max-w-(--page-max) px-[67px] pb-[61px] pt-[26px]">
        <div className="flex items-start justify-between gap-6">
          <div className="text-[14px] leading-5 text-body">
            <h2 id={titleId} className="font-bold">
              {MARKET_PANEL.title}
            </h2>
            <p>{MARKET_PANEL.body}</p>
          </div>
          <CurrentMarket className="text-right" current={LOCAL_SITE.current} />
        </div>
        <div className="mt-[18px]">
          <MarketColumns labelledBy={titleId} columns={4}>
            {rows()}
          </MarketColumns>
        </div>
      </div>
    </div>
  );
}

/** Mobile market list (Figma 719:1563, reworked): intro, current market, the rows in one column. */
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
      <CurrentMarket className="mt-[21px]" current={LOCAL_SITE.current} />
      <div className="mt-3">
        <MarketColumns labelledBy={uid} columns={1}>
          {rows()}
        </MarketColumns>
      </div>
    </div>
  );
}
