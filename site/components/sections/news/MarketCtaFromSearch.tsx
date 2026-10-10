"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NEWS_MARKET_CTA } from "@/data/site/news";
import { MarketCtaStrip } from "./MarketCtaStrip";
import { marketLabel, parseNewsParams, toNewsState, type NewsSearchState } from "./newsSearch";

export type MarketCtaFromSearchProps = {
  /** Copy; defaults to NEWS_MARKET_CTA */
  copy?: typeof NEWS_MARKET_CTA;
  /** Keep the 13px designer note line (default false on the results page) */
  showNote?: boolean;
  /** Use a fixed state instead of the URL (previews) */
  state?: Partial<NewsSearchState>;
};

/**
 * B35 on /news/search (NEWS §5, NSR composition step 5): renders MarketCtaStrip only while a market filter
 * is applied, with that market's name. "Group" is not a market (no local site), so it shows nothing.
 * The "fewer than three articles" rule is skipped (the mock set is tiny). Reads the URL in its own Suspense.
 */
export function MarketCtaFromSearch(props: MarketCtaFromSearchProps) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  );
}

function Inner({ copy = NEWS_MARKET_CTA, showNote = false, state: override }: MarketCtaFromSearchProps) {
  const params = useSearchParams();
  const state = override ? toNewsState(override) : parseNewsParams(params);
  if (!state.market || state.market === "group") return null;
  const market = marketLabel(state.market);
  if (!market) return null;
  return <MarketCtaStrip market={market} {...copy} showNote={showNote} />;
}
