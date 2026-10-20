"use client";

import { useId } from "react";
import { MARKET_PANEL, NAV_MARKETS } from "@/config/nav";
import { MarketRow } from "./parts";

/** "Currently viewing: Group (EN)", static text. */
export function CurrentMarket({ className = "", current = MARKET_PANEL.current }: { className?: string; current?: string }) {
  return (
    <p className={`text-[14px] leading-5 text-body ${className}`}>
      {MARKET_PANEL.currentLabel} <b className="font-bold">{current}</b>
    </p>
  );
}

/**
 * The market list (group and local panels): rows of market name and language links, filled column by column
 * (4 columns from the desktop nav width, 1 below), each row on a 1px line.
 */
export function MarketColumns({ labelledBy, columns, children }: { labelledBy: string; columns: 1 | 4; children: React.ReactNode[] }) {
  return (
    <ul
      aria-labelledby={labelledBy}
      className={columns === 4 ? "grid grid-flow-col grid-cols-4 gap-x-6" : "flex flex-col"}
      style={columns === 4 ? { gridTemplateRows: `repeat(${Math.ceil(children.length / 4)}, auto)` } : undefined}
    >
      {children.map((row, i) => (
        <li key={i} className="flex min-h-12 items-center border-b border-line py-2.5">
          {row}
        </li>
      ))}
    </ul>
  );
}

/**
 * Desktop market selector (Figma Group_Find your market 672:25832, reworked from the presentation feedback):
 * white full-bleed panel under the header, intro and "Currently viewing" over a 4-column text list of the
 * markets, each with its language versions as separate links (no cards, no region tags).
 */
export function MarketMenu({ id, labelledBy, animate }: { id: string; labelledBy: string; animate: boolean }) {
  const titleId = useId();
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`sb-pad absolute inset-x-0 top-full max-h-[calc(var(--full-h)-72px)] overflow-y-auto overscroll-contain bg-white ${animate ? "anim-pop" : ""}`}
    >
      <div className="mx-auto max-w-(--page-max) px-[67px] pb-[61px] pt-[26px]">
        <div className="flex items-start justify-between gap-6">
          <div className="text-[14px] leading-5 text-body">
            <h2 id={titleId} className="font-bold">
              {MARKET_PANEL.title}
            </h2>
            <p>{MARKET_PANEL.body}</p>
          </div>
          <CurrentMarket className="text-right" />
        </div>
        <div className="mt-[18px]">
          <MarketColumns labelledBy={titleId} columns={4}>
            {NAV_MARKETS.map((m) => (
              <MarketRow key={m.name} name={m.name} languages={m.languages} />
            ))}
          </MarketColumns>
        </div>
      </div>
    </div>
  );
}
