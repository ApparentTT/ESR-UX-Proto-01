/**
 * Investor fund content (INV `investors.md` §4c, §5; inventory B28, B29), verbatim.
 * Every flagship card links to the placeholder fund detail page (/investors/funds/[slug], Figma
 * "Fund Detail" 1289:101635); REIT sites are external, so they stay inert.
 * "Strategy  ·  Region" and "Market  ·  Exchange" lines keep the wireframe's two spaces either side of the dot.
 */
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
 * Statically generated for every flagship fund; only the name and slug change.
 * ------------------------------------------------------------------------------------------- */

export type FundPage = { slug: string; name: string };

const slugOf = (href: string | null) => href?.split("/").pop() ?? "";

export const FUND_PAGES: FundPage[] = [
  ...FLAGSHIP_FUNDS.map((f) => ({ slug: slugOf(f.cta.href), name: f.name })),
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
