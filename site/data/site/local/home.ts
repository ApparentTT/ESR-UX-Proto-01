/**
 * /jp: Japan local homepage copy, verbatim from Key wireframes R2_Local_homepage_>10Properties (1347:52640;
 * mobile 1347:52641). Sections the group homepage shares (Who we are, What we do) keep the group copy, as drawn.
 */
import type { FeatureCardData } from "@/components/sections/blocks/FeatureCard";
import type { MediaCardData } from "@/components/sections/cards/MediaCard";
import type { NewsCardData } from "@/components/sections/cards/NewsCard";
import type { LocalKeyStatsProps } from "@/components/sections/local/LocalKeyStats";
import { HOME_WHAT_WE_DO, HOME_WHO_WE_ARE } from "@/data/site/pages/home";
import { JP, JP_AUM_FOOTNOTE } from "./shared";

export const JP_HOME_HERO = {
  title: "[Japan heading] New economy assets, REITs and asset management across the group",
  sub: "Vorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

/** 1110:53366 */
export const JP_HOME_WHO_WE_ARE = HOME_WHO_WE_ARE;

/**
 * "Key stats / opt 2" (1110:53502). Group is drawn; the Local (Japan) figures are not, so they are
 * placeholders until ESR Japan supplies them.
 */
export const JP_HOME_STATS: LocalKeyStatsProps = {
  title: "Scale that delivers",
  sub: "A leading platform with the scale, expertise and local presence to create value across Asia-Pacific.",
  link: { label: "Explore our portfolio", href: JP.portfolio },
  stats: {
    group: [
      { value: "US $31.8B", label: "Total assets under management", sup: 1 },
      { value: "4.7m sqm", label: "Gross floor area" },
      { value: "XX sqm", label: "Development pipeline" },
      { value: "XX", label: "In-house experts" },
    ],
    local: [
      { value: "US $XXB", label: "Total assets under management", sup: 1 },
      { value: "XX sqm", label: "Gross floor area" },
      { value: "XX sqm", label: "Development pipeline" },
      { value: "XX", label: "In-house experts" },
    ],
  },
  footnotes: [JP_AUM_FOOTNOTE],
};

/** 1110:53380 */
export const JP_HOME_FEATURED_HEADING = "Featured properties";

/** 1274:39951 "What we do": the group cards, linked to the local pages */
const [properties, developments, dataCentres, infrastructure] = HOME_WHAT_WE_DO.cards;
export const JP_HOME_WHAT_WE_DO: { eyebrow: string; body: string; cards: FeatureCardData[] } = {
  ...HOME_WHAT_WE_DO,
  cards: [
    { ...properties, href: JP.properties },
    { ...developments, href: JP.developments },
    { ...dataCentres, href: JP.dataCentres },
    { ...infrastructure, href: null },
  ],
};

/** 1110:53530 */
export const JP_HOME_LATEST_HEADING = {
  title: "The latest from Japan",
  sub: "Quis nis ullarper vestibulum eros. Suspendisse lacus lectus molestie id et, nibh tellus in.",
  link: { label: "Explore the latest", href: JP.news },
};

/** 1110:53538: each card opens its own local article page (data/site/news-detail.ts) */
export const JP_HOME_LATEST: NewsCardData[] = [
  {
    date: "1 July 2026",
    meta: "Press release · Japan",
    title: "ESR and Mitsubishi Estate Asia expand partnership to develop A$700 million luxury logistics facility in Western Sydney.",
    href: "/jp/news/latest-1",
  },
  { date: "1 July 2026", meta: "Case study · Japan", title: "Borem ipsum dolor sit amet, consectetur adipiscing elit.", href: "/jp/news/latest-2" },
  {
    date: "8 April 2026",
    meta: "Press release · Japan",
    title: "ESR expands investment partnership with TPG Asia Real Estate in the Japanese logistics asset sector.",
    href: "/jp/news/latest-3",
  },
  {
    date: "3 March 2026",
    meta: "Press release · Japan",
    title: "ESR is reimagining a leading logistics facility in Yokohama as the venue for \"Red Bull Tokyo Drift 2026\"",
    href: "/jp/news/latest-4",
  },
];

/** 1110:53600 + 1110:53606 */
export const JP_HOME_EXPLORE_HEADING = "Explore more about us";
export const JP_HOME_EXPLORE_CARDS: MediaCardData[] = [
  { title: "About us", body: "Description", href: JP.about },
  { title: "Our people", body: "Description", href: null },
];
