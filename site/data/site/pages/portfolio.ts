/**
 * Page-only copy for /portfolio (PORT) and /portfolio/properties (PROP), verbatim from the page specs.
 * Shared section data (map, bento, quotes, markets, FAQ...) lives in the data/site modules of each component family.
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";

const INTRO_LOREM =
  "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.";

/** PORT §1 */
export const PORT_INTRO = { title: "Portfolio overview", body: INTRO_LOREM };

/** PORT §4 "Creating value in action" (identical to HOME §7) */
export const PORT_CASE_STUDY_BAND: {
  title: string;
  body: string;
  actions: FeatureBandAction[];
} = {
  title: "Creating value in action\n[Case study title]",
  body: "Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
  actions: [
    { label: "View case study", href: null },
    { label: "Explore our capabilities", href: "/about/proven-capability", variant: "secondary" },
  ],
};

/** PORT §6, PROP §7 (and HOME / DEV) "Invest with ESR" */
export const INVEST_WITH_ESR: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Invest with ESR",
  body: "[Description about Invest with ESR]",
  cta: { label: "Learn more", href: "/investors" },
};

/** PROP §1 (6-line body: the intro lorem twice) */
export const PROP_INTRO = { title: "Properties", body: `${INTRO_LOREM} ${INTRO_LOREM}` };

/** PROP §2 intro CTAs: into the property search */
export const PROP_INTRO_ACTIONS = [
  { label: "Search our portfolio", href: "/properties", variant: "primary" as const },
  { label: "Search available properties", href: "/properties/search?avail=now", variant: "secondary" as const },
];

/** PROP §3 */
export const PROP_MARKETS_HEADING = {
  title: "Explore our properties around the world",
  sub: "Quis nis ullarper vestibulum eros. Suspendisse lacus lectus molestie id et, nibh tellus in.",
};

/** PROP §8 */
export const PROP_PORTFOLIO_HEADING = "Explore our portfolio";
