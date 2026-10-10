/**
 * Page-only copy for /about (ABOUT), verbatim from specs/about.md.
 * Shared section data lives in the component families' modules:
 * stats (ABOUT_STAT_ROWS / ABOUT_FOOTNOTES), purpose cards (ABOUT_PURPOSE) and the featured cards (ABOUT_FEATURED_CARDS).
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";

/** ABOUT §1 */
export const ABOUT_INTRO = {
  title: "About us",
  body: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
};

/** ABOUT §5 "Our leadership" teaser (image left). The CTA keeps the drawn double space ("Meet  our"). */
export const ABOUT_LEADERSHIP: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Our leadership",
  body: "[Description about leadership team with ESR]",
  cta: { label: "Meet  our leadership team", href: "/about/leadership" },
};

/** ABOUT §6 "Proven capability" static band (no carousel controls). */
export const ABOUT_PROVEN_CAPABILITY: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Proven capability",
  body: "Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
  actions: [{ label: "View all case studies", href: "/about/proven-capability" }],
};
