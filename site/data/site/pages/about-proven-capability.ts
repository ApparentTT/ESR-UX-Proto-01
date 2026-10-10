/**
 * Page-only copy for /about/proven-capability (CAP), verbatim from about-proven-capability.md.
 * The case-study listing (§2–3) is in data/site/caseStudies.ts, the featured properties (§5) in
 * components/sections/cards/presets.ts and the contact CTA (§8) in data/site/offices.ts.
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";

/** CAP §1 (PageIntro default; the hidden button and image are not built) */
export const CAP_INTRO = {
  title: "Proven capability",
  body: "Case studies from every market we operate in, showing how we manage assets, work with customers, deliver developments and build for the long term.",
};

/** CAP §4 */
export const CAP_FEATURED_PROPERTIES_HEADING = "Featured properties";

/** CAP §6 "Properties" tile (static grey band) → /portfolio/properties */
export const CAP_PROPERTIES: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Properties",
  body: "Every property we own and manage across the region, and the asset management team behind them.",
  actions: [{ label: "Explore properties", href: "/portfolio/properties" }],
};

/** CAP §7 "Invest with ESR" (real copy on this page, not the placeholder) → /investors */
export const CAP_INVEST: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Invest with ESR",
  body: "Our funds, our strategy and the track record behind them.",
  cta: { label: "Learn more", href: "/investors" },
};
