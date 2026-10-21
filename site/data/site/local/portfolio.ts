/**
 * /jp/portfolio: Japan portfolio overview copy, verbatim from Key wireframes R2_local_PortfolioOverview-Japan
 * (1347:60557; mobile 1347:60556).
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { BentoAccordionProps } from "@/components/sections/carousels/BentoAccordion";
import type { LocalKeyStatsProps } from "@/components/sections/local/LocalKeyStats";
import type { MapStat } from "@/components/sections/map/types";
import { PORT_CASE_STUDY_BAND, PORT_INTRO } from "@/data/site/pages/portfolio";
import { JP, JP_AUM_FOOTNOTE } from "./shared";

/** 1110:63780 (the group intro copy, as drawn) */
export const JP_PORT_INTRO = PORT_INTRO;

/** 1110:63794 "We span" */
export const JP_PORT_MAP_STATS: MapStat[] = [
  { value: "4", label: "Regions" },
  { value: "6", label: "Property types" },
  { value: "83", label: "Properties under management" },
  { value: "136", label: "Total assets" },
];
/** The map's call-outs (1110:63817–63820) */
export const JP_PORT_MAP_REGIONS = ["Kanto Region", "Kansai Region", "Chubu Region", "Fukuoka Region"];

/** "Our asset classes" (1292:60751): the group bento, linked to the local pages */
export const JP_PORT_OUR_ASSETS: BentoAccordionProps = {
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  tiles: [
    {
      id: "industrial",
      title: "Industrial and logistics",
      links: [
        { label: "Properties", href: JP.properties },
        { label: "Developments", href: JP.developments },
      ],
    },
    { id: "data-centres", title: "Data centres", href: JP.dataCentres },
    { id: "infrastructure", title: "Adjacent infrastructure", href: null },
  ],
  currentHref: JP.portfolio,
};

/** "Key stats / opt 3" 1290:29645 */
export const JP_PORT_STATS: LocalKeyStatsProps = {
  title: "Scale that delivers",
  sub: "A leading platform with the scale, expertise and local presence to create value across Asia-Pacific.",
  stats: [
    { value: "US $30.7B", label: "Total assets under management", sup: 1 },
    { value: "14.9m sqm", label: "Gross floor area" },
    { value: "3.5m sqm", label: "Development pipeline" },
  ],
  footnotes: [JP_AUM_FOOTNOTE],
};

/** 1290:29636 */
export const JP_PORT_FEATURED_HEADING = {
  title: "Featured properties and developments",
  link: { label: "Explore our properties", href: JP.properties },
};

/** Carousel 1110:63946: the group case-study band, "Explore our capabilities" to the local page */
export const JP_PORT_CASE_STUDY_BAND: { title: string; body: string; actions: FeatureBandAction[] } = {
  ...PORT_CASE_STUDY_BAND,
  actions: [
    { label: "View case study", href: null },
    { label: "Explore our capabilities", href: JP.provenCapability, variant: "secondary" },
  ],
};
