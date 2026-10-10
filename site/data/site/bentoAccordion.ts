/**
 * B14 BentoAccordion content ("Explore the portfolio" component): PORT §3, DEV §6, DC §8, verbatim.
 * Only "Industrial and logistics" is designed open. Undesigned open states (inventory B14): Data centres reuses the
 * section lorem with one sub-card "Data centres"; Infrastructure reuses the lorem with no sub-cards (inert).
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
    links: [{ label: "Data centres", href: "/portfolio/data-centres" }],
  },
  { id: "infrastructure", title: "Infrastructure", href: null },
];

const LOREM_2 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur.";
const LOREM_4 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/** PORT §3 "Our assets" */
export const PORT_OUR_ASSETS: BentoAccordionProps = {
  heading: "Our assets",
  description: LOREM_2,
  tiles: BENTO_TILES,
  currentHref: "/portfolio",
};

/** DEV §6 "What we develop": the Developments sub-card is the current page */
export const DEV_WHAT_WE_DEVELOP: BentoAccordionProps = {
  heading: "What we develop",
  description: LOREM_4,
  tiles: BENTO_TILES,
  currentHref: "/portfolio/developments",
};

/** DC §8 "Explore the portfolio": the Data centres tile is the current page */
export const DC_EXPLORE_PORTFOLIO: BentoAccordionProps = {
  heading: "Explore the portfolio",
  description: LOREM_4,
  tiles: BENTO_TILES,
  currentHref: "/portfolio/data-centres",
};
