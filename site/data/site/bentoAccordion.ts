/**
 * "Our asset classes" module content (Figma 1455:42800; every instance shares the heading, BENTO_HEADING): PORT §3, DEV §6, DC §8 and the fund page.
 * Industrial and logistics opens with the Properties and Developments cards; Data centres and Infrastructure open
 * with the section lorem and "Explore now" (Infrastructure is not built, so its link is inert).
 */
import type { BentoAccordionProps, BentoTile } from "@/components/sections/carousels/BentoAccordion";

export const BENTO_TILES: BentoTile[] = [
  {
    id: "industrial",
    title: "Industrial and logistics",
    links: [
      { label: "Properties", href: "/portfolio/properties" },
      { label: "Developments", href: "/portfolio/developments" },
    ],
  },
  {
    id: "data-centres",
    title: "Data centres",
    href: "/portfolio/data-centres",
  },
  { id: "infrastructure", title: "Infrastructure", href: null },
];

const LOREM_2 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur.";
const LOREM_4 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/** PORT §3 */
export const PORT_OUR_ASSETS: BentoAccordionProps = {
  description: LOREM_2,
  tiles: BENTO_TILES,
  currentHref: "/portfolio",
};

/** DEV §6: the Developments sub-card is the current page */
export const DEV_WHAT_WE_DEVELOP: BentoAccordionProps = {
  description: LOREM_4,
  tiles: BENTO_TILES,
  currentHref: "/portfolio/developments",
};

/** DC §8: the Data centres tile is the current page */
export const DC_EXPLORE_PORTFOLIO: BentoAccordionProps = {
  description: LOREM_4,
  tiles: BENTO_TILES,
  currentHref: "/portfolio/data-centres",
};

/** Fund detail (Figma 1246:27945): no tile is the current page */
export const FUND_EXPLORE_PORTFOLIO: BentoAccordionProps = {
  description: LOREM_4,
  tiles: BENTO_TILES,
};
