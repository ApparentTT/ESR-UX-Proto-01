/**
 * "The latest" news card sets (inventory B12), verbatim from the page specs.
 * Articles are not wireframed, so every card is an inert link (href omitted = null).
 */
import type { NewsCardData } from "@/components/sections/cards/NewsCard";

/** HOME §8b (also SUS §8b): `<NewsCardRow cards={HOME_LATEST} />` */
export const HOME_LATEST: NewsCardData[] = [
  { date: "1 July 2026", meta: "Press release · Japan", title: "Norem ipsum dolor sit amet consectetur" },
  { date: "1 July 2026", meta: "Case study · Australia", title: "Building core logistics that endures" },
  { date: "1 July 2026", meta: "Thought leadership · Group", title: "Norem ipsum dolor sit amet consectetur" },
  { date: "1 July 2026", meta: "News · Group", title: "Norem ipsum dolor sit amet consectetur" },
];

/** SUS §8b uses the same four cards as the homepage. */
export const SUS_LATEST = HOME_LATEST;

/**
 * INV §8b: `<NewsCardRow cards={INV_LATEST} />`.
 * Cards 1–3 have two spaces either side of the "·" in the source, card 4 has one; kept as drawn.
 */
export const INV_LATEST: NewsCardData[] = [
  { date: "1 July 2026", meta: "Press release  ·  Group", title: "Fund close announcement placeholder" },
  { date: "1 July 2026", meta: "Thought leadership  ·  Group", title: "Market outlook placeholder" },
  { date: "1 July 2026", meta: "Case study  ·  Japan", title: "Norem ipsum dolor sit amet consectetur" },
  { date: "1 July 2026", meta: "News · Group", title: "Norem ipsum dolor sit amet consectetur" },
];

/** Heading rows that sit above these cards (`<SectionHeading title sub link />`). */
export const LATEST_HEADINGS = {
  home: {
    title: "The latest from across our markets",
    sub: "Quis nis ullarper vestibulum eros. Suspendisse lacus lectus molestie id et, nibh tellus in.",
    link: { label: "Explore the latest", href: "/news" },
  },
  investors: {
    title: "The latest from across our markets",
    sub: "Fund closes, capital raises and what our teams are seeing on the ground.",
    link: { label: "Explore the latest", href: "/news" },
  },
  sustainability: {
    title: "News",
    sub: "Group news about our ESG initiatives, and recognition from third parties.",
    link: { label: "Explore the latest", href: "/news" },
  },
} as const;
