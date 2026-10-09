/**
 * LEAD §3 "Our REITs" (inventory B27 reitInfo in a surface band), verbatim.
 * Four identical placeholder cards; "lorem.ipsum.com" is an external REIT site, so it is inert.
 */
import type { InfoCardSectionProps } from "@/components/sections/infocards/InfoCardSection";
import type { InfoCardItem } from "@/components/sections/infocards/InfoCardGrid";

const REIT_CARD: InfoCardItem = {
  eyebrow: "Country",
  title: "Lorem ipsum dolor sit amet, consectetur",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
  link: { label: "lorem.ipsum.com", href: null },
};

export const LEAD_REITS: InfoCardSectionProps = {
  title: "Our REITs",
  sub: "ESR manages four listed REITs across the region. Each is run by its own manager with its own board, and reports separately.",
  variant: "reitInfo",
  items: [REIT_CARD, REIT_CARD, REIT_CARD, REIT_CARD],
};
