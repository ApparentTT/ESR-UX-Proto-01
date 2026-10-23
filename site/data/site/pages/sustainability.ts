/**
 * Page-only copy for the sustainability pages, verbatim from the specs:
 * - /sustainability (SUS), sustainability.md
 * - /sustainability/case-studies (SCS), sustainability-case-studies.md
 * - /sustainability/governance (SGOV), sustainability-governance.md
 * Section data (pillar and governance cards, targets, proof points, news cards, case-study listing,
 * past disclosures, policies) lives in the data modules of each component family.
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";
import type { NewsCardData } from "@/components/sections/cards/NewsCard";

type Intro = { title: string; body: string };
type Split = { title: string; body: string; cta: SplitBlockCta };
type Band = { title: string; body: string; actions: FeatureBandAction[] };

/* ---------- /sustainability (SUS) ---------- */

/** SUS §1 */
export const SUS_INTRO: Intro = {
  title: "Sustainability",
  body: "Our approach to sustainability runs through development, asset management, funds and the way we operate as a business. Here is what we have committed to and how we are tracking.",
};

/** SUS §3a */
export const SUS_PILLARS_HEADING = "Strategic pillars";

/** SUS §5a */
export const SUS_PROOF_POINTS_HEADING = {
  title: "Proof points",
  sub: "Evidence of outcomes across the portfolio, not just intent.",
};

/** SUS §6 */
export const SUS_REPORTS: Split = {
  title: "Reports and policies",
  body: "Our sustainability report, ESG data pack, disclosures and published policies, all in one place.",
  cta: { label: "Go to governance", href: "/sustainability/governance" },
};

/** SUS §7 (every slide repeats slide 1; "View case study" is inert: detail pages are not wireframed) */
/** SUS §7 "Featured sustainability stories": four curated case studies in a grid (like the news cards below), not a carousel */
export const SUS_STORIES = {
  heading: {
    title: "Featured sustainability stories",
    sub: "Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
    link: { label: "View all case studies", href: "/sustainability/case-studies" },
  },
  cards: [
    { date: "12 June 2026", meta: "Case study  ·  Australia", title: "Powering Upparel’s next chapter with a logistics facility built to scale", href: "/sustainability/case-studies" },
    { date: "28 May 2026", meta: "Case study  ·  Australia", title: "Delivering EV infrastructure in new developments", href: "/sustainability/case-studies" },
    { date: "14 May 2026", meta: "Case study  ·  Australia", title: "Woody Meadows bringing new life into industrial and logistics facilities", href: "/sustainability/case-studies" },
    { date: "30 April 2026", meta: "Case study  ·  Australia", title: "Pollinating change through our industrial facilities", href: "/sustainability/case-studies" },
  ] satisfies NewsCardData[],
};

/* ---------- /sustainability/case-studies (SCS) ---------- */

/** SCS §1 */
export const SCS_INTRO: Intro = {
  title: "Sustainability case studies",
  body: "Sustainability at ESR runs through development, asset management and the way we operate. These are the projects where that shows up in practice, across our markets.",
};

/** SCS §3 */
export const SCS_GOVERNANCE: Split = {
  title: "Governance",
  body: "The frameworks, disclosures and published policies behind the work on this page.",
  cta: { label: "Go to governance", href: "/sustainability/governance" },
};

/* ---------- /sustainability/governance (SGOV) ---------- */

/** SGOV §1 */
export const SGOV_INTRO: Intro = {
  title: "Governance and management",
  body: "Our approach to sustainability is set at board level and managed through the business, with the disclosures, reports and policies that sit behind it published here.",
};

/** SGOV §5 ("Download the report" is inert: no PDF exists in the prototype) */
export const SGOV_DISCLOSURE: Band = {
  title: "Disclosure 2026",
  body: "Our most recent disclosure, covering performance against targets, assurance and the year ahead.",
  actions: [{ label: "Download the report", href: null }],
};

/** SGOV §6 anchor: the §5 arrow smooth-scrolls here */
export const SGOV_PAST_DISCLOSURES_ID = "past-disclosures";

/** SGOV §8 */
export const SGOV_SUSTAINABILITY: Split = {
  title: "Sustainability at ESR",
  body: "Our targets, the work behind them and the case studies showing how it plays out across our portfolio.",
  cta: { label: "Explore sustainability", href: "/sustainability" },
};
