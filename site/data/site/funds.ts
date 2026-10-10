/**
 * Investor fund content (INV `investors.md` §4c, §5, §6; inventory B28, B29, B30), verbatim.
 * Fund pages, REIT sites and the factsheet are external or not wireframed, so every link is inert (href null).
 * "Strategy  ·  Region" and "Market  ·  Exchange" lines keep the wireframe's two spaces either side of the dot.
 */
import type { FundListProps } from "@/components/sections/listings/FundList";
import type { FundRow } from "@/components/sections/listings/FundTable";

/* ---------------------------------------------------------------------------------------------
 * INV §5 "Flagship funds across the group" (B29 FundCards)
 * ------------------------------------------------------------------------------------------- */

export type FlagshipFund = {
  name: string;
  meta: string;
  stats: { value: string; label: string }[];
  cta: { label: string; href: string | null };
};

const FUND_STATS = [
  { value: "US $XXbn", label: "Fund size" },
  { value: "XX", label: "Assets" },
];

export const FLAGSHIP_FUNDS_HEAD = {
  title: "Flagship funds across the group",
  sub: "Our largest vehicles, and the strategies behind them.",
};

export const FLAGSHIP_FUNDS: FlagshipFund[] = [
  { name: "Flagship fund name", meta: "Core and core plus  ·  Pan Asia Pacific", stats: FUND_STATS, cta: { label: "View fund", href: null } },
  { name: "Flagship fund name", meta: "Development  ·  Japan and South Korea", stats: FUND_STATS, cta: { label: "View fund", href: null } },
  { name: "Flagship fund name", meta: "Data centre  ·  Pan Asia Pacific", stats: FUND_STATS, cta: { label: "View fund", href: null } },
];

/* ---------------------------------------------------------------------------------------------
 * INV §6 "Our funds" (B30 FundList)
 * ------------------------------------------------------------------------------------------- */

const VIEW_FUND = { label: "View fund", href: null };

/** INV §6c rows, top to bottom. */
export const FUND_ROWS: FundRow[] = [
  { fund: "Fund name placeholder", strategy: "Core and core plus", markets: "Asia Pacific", sector: "Logistics", link: VIEW_FUND },
  { fund: "Fund name placeholder", strategy: "Development", markets: "Japan", sector: "Logistics", link: VIEW_FUND },
  { fund: "Fund name placeholder", strategy: "Value add", markets: "South Korea", sector: "Data centres", link: VIEW_FUND },
  { fund: "Fund name placeholder", strategy: "Core", markets: "Australia and NZ", sector: "Logistics", link: VIEW_FUND },
  { fund: "Fund name placeholder", strategy: "Development", markets: "Greater China", sector: "Cold storage", link: VIEW_FUND },
];

/**
 * INV §6 section props. Filter options are not designed: Strategy, Market and Sector use the table values;
 * Status has no data ("[Options to be confirmed with ESR]"). The "All …" clear items, the live count and
 * the empty state are prototype conveniences flagged in the spec.
 */
export const FUND_LIST: FundListProps = {
  title: "Our funds",
  sub: "Core, value add and development funds across Asia Pacific. Fund detail sits on the relevant market site.",
  filters: [
    { key: "strategy", label: "Strategy", allLabel: "All strategies", options: ["Core and core plus", "Development", "Value add", "Core"] },
    { key: "markets", label: "Market", allLabel: "All markets", options: ["Asia Pacific", "Japan", "South Korea", "Australia and NZ", "Greater China"] },
    { key: "sector", label: "Sector", allLabel: "All sectors", options: ["Logistics", "Data centres", "Cold storage"] },
    { key: "status", label: "Status", pending: "[Options to be confirmed with ESR]" },
  ],
  columns: { fund: "Fund", strategy: "Strategy", markets: "Markets", sector: "Sector", link: "Link" },
  rows: FUND_ROWS,
  countText: "{n} funds and mandates",
  countPlaceholder: "XX",
  empty: { text: "No funds match these filters", clearLabel: "Clear filters" },
  footnote: "Fund information is provided for institutional investors only. Figures as at [date].",
  download: { label: "Download the fund factsheet", href: null },
};

/* ---------------------------------------------------------------------------------------------
 * INV §4c "Our listed REITs" (B28 LinkTileGrid `reit`)
 * ------------------------------------------------------------------------------------------- */

export type ListedReit = { name: string; meta: string; href: string | null };

export const REITS_LABEL = "Our listed REITs";

/** Reading order: row 1 left to right, then row 2. */
export const REITS: ListedReit[] = [
  { name: "ESR-REIT", meta: "Singapore  ·  SGX", href: null },
  { name: "ESR C-REIT", meta: "China  ·  SSE", href: null },
  { name: "ESR Kendall Square REIT", meta: "South Korea  ·  KOSPI", href: null },
  { name: "Fortune REIT", meta: "Hong Kong  ·  HKEX", href: null },
  { name: "Prosperity REIT", meta: "Hong Kong  ·  HKEX", href: null },
  { name: "Sabana Industrial REIT", meta: "Singapore  ·  SGX", href: null },
];
