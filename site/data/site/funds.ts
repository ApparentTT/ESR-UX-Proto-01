/**
 * Investor fund content (INV `investors.md` §4c, §5, §6; inventory B28, B29, B30), verbatim.
 * Every flagship card and fund row links to the placeholder fund detail page (/investors/funds/[slug], Figma
 * "Fund Detail" 1289:101635); REIT sites and the factsheet are external or not wireframed, so they stay inert.
 * "Strategy  ·  Region" and "Market  ·  Exchange" lines keep the wireframe's two spaces either side of the dot.
 */
import type { FundListProps } from "@/components/sections/listings/FundList";
import type { FundRow } from "@/components/sections/listings/FundTable";
import type { ContactEnquiryFormProps } from "@/components/sections/forms/ContactEnquiryForm";
import { INVESTOR_ENQUIRY_SUCCESS } from "@/components/sections/forms/formPresets";

/** Fund detail route for a slug */
export const fundHref = (slug: string) => `/investors/funds/${slug}`;

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

const viewFlagship = (n: number) => ({ label: "View fund", href: fundHref(`flagship-fund-${n}`) });

export const FLAGSHIP_FUNDS: FlagshipFund[] = [
  { name: "Flagship fund name", meta: "Core and core plus  ·  Pan Asia Pacific", stats: FUND_STATS, cta: viewFlagship(1) },
  { name: "Flagship fund name", meta: "Development  ·  Japan and South Korea", stats: FUND_STATS, cta: viewFlagship(2) },
  { name: "Flagship fund name", meta: "Data centre  ·  Pan Asia Pacific", stats: FUND_STATS, cta: viewFlagship(3) },
];

/* ---------------------------------------------------------------------------------------------
 * INV §6 "Our funds" (B30 FundList)
 * ------------------------------------------------------------------------------------------- */

const viewFund = (n: number) => ({ label: "View fund", href: fundHref(`fund-${n}`) });

/** INV §6c rows, top to bottom. */
export const FUND_ROWS: FundRow[] = [
  { fund: "Fund name placeholder", strategy: "Core and core plus", markets: "Asia Pacific", sector: "Logistics", link: viewFund(1) },
  { fund: "Fund name placeholder", strategy: "Development", markets: "Japan", sector: "Logistics", link: viewFund(2) },
  { fund: "Fund name placeholder", strategy: "Value add", markets: "South Korea", sector: "Data centres", link: viewFund(3) },
  { fund: "Fund name placeholder", strategy: "Core", markets: "Australia and NZ", sector: "Logistics", link: viewFund(4) },
  { fund: "Fund name placeholder", strategy: "Development", markets: "Greater China", sector: "Cold storage", link: viewFund(5) },
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

/* ---------------------------------------------------------------------------------------------
 * Fund detail (Figma "Fund Detail" 1289:101635 / mob 1289:101636), placeholder wireframe content.
 * Statically generated for every flagship fund and fund row; only the name and slug change.
 * ------------------------------------------------------------------------------------------- */

export type FundPage = { slug: string; name: string };

const slugOf = (href: string | null) => href?.split("/").pop() ?? "";

export const FUND_PAGES: FundPage[] = [
  ...FLAGSHIP_FUNDS.map((f) => ({ slug: slugOf(f.cta.href), name: f.name })),
  ...FUND_ROWS.map((r) => ({ slug: slugOf(r.link.href), name: r.fund })),
];

/** FundOverview + KeyStats copy, verbatim */
export const FUND_DETAIL = {
  tags: ["Core and core plus", "Industrial and logistics", "Formed [year]"],
  mandate:
    "[Investment mandate and objective, to be supplied by ESR investment management. One short paragraph on what the fund invests in, where, and what it is trying to achieve for investors.]",
  statsTitle: "Key stats",
  stats: [
    { value: "US $XXm", label: "Equity commitment" },
    { value: "XX%", label: "ESR co-investment" },
    { value: "XX", label: "Properties" },
    { value: "XX%", label: "Occupancy" },
  ],
  statsNote: "Figures as at [date]. Fund performance is not a reliable indicator of future performance.",
};

/** The drawn InvestorEnquiryForm (1246:27683): First / Last name, Email, Message, Submit */
export const FUND_ENQUIRY_FORM: ContactEnquiryFormProps = {
  title: "Investor enquiry",
  body: "Tell us what you are looking for and our capital partnerships team will come back to you.",
  company: false,
  submitLabel: "Submit",
  success: INVESTOR_ENQUIRY_SUCCESS,
};
