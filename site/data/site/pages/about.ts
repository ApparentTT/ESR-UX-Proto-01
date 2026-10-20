/**
 * Page-only copy for /about (ABOUT), verbatim from specs/about.md.
 * Shared section data lives in the component families' modules:
 * stats (ABOUT_STAT_ROWS / ABOUT_FOOTNOTES), purpose cards (ABOUT_PURPOSE) and the featured cards (ABOUT_FEATURED_CARDS).
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { LeaderGridItem } from "@/components/sections/blocks/LeaderGrid";
import { LEADERS } from "@/data/site/leaders";

/** ABOUT §1 */
export const ABOUT_INTRO = {
  title: "About us",
  body: "Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.",
};

/**
 * ABOUT §5 "Our leadership" module: the first eight leaders of the Our leadership page (same names and
 * titles), each with a one-line bio, then a link to the full page.
 */
const ABOUT_LEADER_SUMMARIES: Record<string, string> = {
  "Brett Robson": "Former Global Head of Macquarie Capital Real Estate Investments.",
  "Jeffrey Shen": "Co-founded e-Shang in 2011; over 25 years in China industrial real estate.",
  "Stuart Gibson": "Co-founded the Redwood Group; formerly country head of Prologis Japan.",
  "Phil Pearce": "Built ESR's Australia and New Zealand business; leads strategy and operations.",
  "Matthew Lawson": "Group CFO since 2025, formerly Group Chief Operating Officer.",
  "Karine Scelles": "Leads people and culture strategy across the group.",
  "David Matheson": "Leads group strategy and investments; formerly at Starwood Capital Group.",
  "Justin Gabbani": "Leads the group's fund management platform and capital raising.",
};

export const ABOUT_LEADERSHIP: { title: string; leaders: LeaderGridItem[]; cta: { label: string; href: string } } = {
  title: "Our leadership",
  leaders: LEADERS.slice(0, 8).map((l) => ({ name: l.name, title: l.title, summary: ABOUT_LEADER_SUMMARIES[l.name] ?? "" })),
  cta: { label: "Meet our full leadership team", href: "/about/leadership" },
};

/** ABOUT §6 "Proven capability" static band (no carousel controls). */
export const ABOUT_PROVEN_CAPABILITY: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Proven capability",
  body: "Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
  actions: [{ label: "View all case studies", href: "/about/proven-capability" }],
};
