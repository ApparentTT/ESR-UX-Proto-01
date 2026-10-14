/**
 * /jp/proven-capability: Local_ProvenCapability (Primary wireframes 1289:114664, mobile 1289:114665), verbatim.
 * The listing works like the group one (CAP): Theme and Asset type filters, chips, Sort, "Clear all". The card
 * metas are drawn with Australian states; they are kept as drawn. Asset type options and the empty state are the
 * group listing's.
 */
import type { CapListingProps } from "@/components/sections/listings/CaseStudyListing";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";
import { CAP_LISTING } from "@/data/site/caseStudies";
import { JP_INVEST } from "./shared";

export const JP_CAP_INTRO = {
  title: "Proven capability",
  body: "Case studies from every market we operate in, showing how we manage assets, work with customers, deliver developments and build for the long term.",
};

const TITLE = "Case study title placeholder";

export const JP_CAP_LISTING: Omit<CapListingProps, "variant"> = {
  ...CAP_LISTING,
  title: "Local case studies",
  cards: [
    { title: TITLE, meta: "Active management  ·  NSW", href: null },
    { title: TITLE, meta: "Customer  ·  QLD", href: null },
    { title: TITLE, meta: "Development  ·  VIC", href: null },
    { title: TITLE, meta: "ESG  ·  NSW", href: null },
    { title: TITLE, meta: "Active management  ·  NSW", href: null },
    { title: TITLE, meta: "Development  ·  NSW", href: null },
  ],
  // Theme and Asset type only (no Market filter on the local listing)
  filters: CAP_LISTING.filters.filter((f) => f.key !== "market"),
  initial: { theme: ["active-management"], sort: "newest" },
};

export const JP_CAP_FEATURED_HEADING = "Featured properties";

export const JP_CAP_INVEST: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Invest with ESR",
  body: "Our funds, our strategy and the track record behind them.",
  cta: JP_INVEST.cta,
};
