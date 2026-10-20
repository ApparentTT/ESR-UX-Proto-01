import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";

/** Verbatim HOME copy (specs/home.md). Shared data sets (stats, latest, explore cards, markets) live in their own modules. */

export const HOME_HERO = {
  title: "New economy assets, REITs and asset management across the group",
  sub: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

/** §2 Who we are */
export const HOME_WHO_WE_ARE = {
  eyebrow: "Who we are",
  body: "Our history, values and people shape how we create long-term value for our investors, customers and communities.",
  statement: "A leading Asia-Pacific real asset owner and manager focused on logistics real estate and data centres.",
};

/** §3a Scale that delivers (heading row) */
export const HOME_SCALE_HEADING = {
  title: "Scale that delivers",
  sub: "A leading platform with the scale, expertise and local presence to create value across Asia-Pacific.",
  link: { label: "Explore our group portfolio", href: "/portfolio" },
};

/** §6 Invest with ESR */
export const HOME_INVEST = {
  title: "Invest with ESR",
  body: "[Description about Invest with ESR]",
  cta: { label: "Learn more", href: "/investors" },
};

/** §7 Case study carousel (3 identical slides) */
export const HOME_CASE_STUDY: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Creating value in action\n[Case study title]",
  body: "Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.",
  actions: [
    { label: "View case study", href: null },
    { label: "Explore our capabilities", href: "/about/proven-capability", variant: "secondary" },
  ],
};

/** §9a */
export const HOME_EXPLORE_HEADING = "Explore more about us";
