/**
 * Page-only copy for /portfolio/developments (DEV), verbatim from portfolio-developments.md.
 * Shared section data (process steps, stats, map, case studies, bento, FAQ...) lives in the data/site
 * modules of each component family; "Invest with ESR" is shared with PORT/PROP (data/site/pages/portfolio.ts).
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";

/** DEV §1 */
export const DEV_INTRO = {
  title: "Developments",
  body: "We design and build industrial and logistics facilities across Asia Pacific, from first plan to first day of operation. Global experience, local expertise, and a pipeline built around where our customers are heading next.",
  /** heroCta: the flow board draws an arrow from this hero back to Portfolio overview */
  cta: { label: "Explore our portfolio", href: "/portfolio" },
};

/** DEV §5a */
export const DEV_CASE_STUDIES_HEADING = "Development case studies";

/** DEV §8 "Featured sustainability stories" text carousel (slides 2-3 repeat slide 1, as designed) */
export const DEV_STORIES_BAND: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Featured sustainability stories",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  actions: [{ label: "Learn more", href: "/sustainability/case-studies" }],
};
