/**
 * Page-only copy for /portfolio/data-centres (DC), verbatim from portfolio-data-centres.md.
 * Shared section data (pipeline, features, stats, stories, bento, contact person...) lives in the
 * data/site modules of each component family.
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";

/** DC §1 */
export const DC_INTRO = {
  title: "Data centres",
  body: "ESR builds and operates the digital infrastructure behind Asia Pacific's growth. Hyperscale and colocation facilities, with the land, power and delivery capability to match the pace our customers are moving at.",
};

/** DC §6 static band */
export const DC_SUSTAINABLE_APPROACH: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Our sustainable approach",
  body: "Designed around water usage, PUE and energy efficiency from the first drawing, not retrofitted later. Every facility is built to hold its value as regulation tightens.",
  actions: [{ label: "Explore sustainability", href: "/sustainability" }],
};

/** DC §7a */
export const DC_STORIES_HEADING = "Featured sustainability stories";

/** DC §9 */
export const DC_LEADERSHIP: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Data centre leadership",
  body: "The team running our digital infrastructure business across Asia Pacific.",
  cta: { label: "Meet our leadership", href: "/about/leadership" },
};
