/**
 * "The latest" news card sets (inventory B12), verbatim from the page specs.
 * Each card opens its own article page (data/site/news-detail.ts builds one per card href).
 */
import type { NewsCardData } from "@/components/sections/cards/NewsCard";

/** HOME §8b (also SUS §8b): `<NewsCardRow cards={HOME_LATEST} />` */
export const HOME_LATEST: NewsCardData[] = [
  { date: "1 July 2026", meta: "Press release · Japan", title: "Norem ipsum dolor sit amet consectetur", href: "/news/latest-1" },
  { date: "1 July 2026", meta: "Case study · Australia", title: "Building core logistics that endures", href: "/news/latest-2" },
  { date: "1 July 2026", meta: "Thought leadership · Group", title: "Norem ipsum dolor sit amet consectetur", href: "/news/latest-3" },
  { date: "1 July 2026", meta: "News · Group", title: "Norem ipsum dolor sit amet consectetur", href: "/news/latest-4" },
];

/** SUS §8b uses the same four cards as the homepage. */
export const SUS_LATEST = HOME_LATEST;

/**
 * INV §8b: `<NewsCardRow cards={INV_LATEST} />`.
 * Cards 1–3 have two spaces either side of the "·" in the source, card 4 has one; kept as drawn.
 */
export const INV_LATEST: NewsCardData[] = [
  { date: "1 July 2026", meta: "Press release  ·  Group", title: "Fund close announcement placeholder", href: "/news/investors-latest-1" },
  { date: "1 July 2026", meta: "Thought leadership  ·  Group", title: "Market outlook placeholder", href: "/news/investors-latest-2" },
  { date: "1 July 2026", meta: "Case study  ·  Japan", title: "Norem ipsum dolor sit amet consectetur", href: "/news/investors-latest-3" },
  { date: "1 July 2026", meta: "News · Group", title: "Norem ipsum dolor sit amet consectetur", href: "/news/investors-latest-4" },
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
