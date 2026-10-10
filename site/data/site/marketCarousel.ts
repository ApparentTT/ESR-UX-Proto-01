/**
 * B16 MarketCarousel content (PROP §4 "Featured cards"). 01–04 are confirmed by the design; 05–11 follow the
 * spec's suggested order from the /portfolio map nav. Names as drawn on this page ("China", "Australia & New Zealand").
 * "Explore the market" goes to an external local market site, so it is inert.
 */
import type { MarketCarouselProps } from "@/components/sections/carousels/MarketCarousel";

export const PROP_MARKET_CAROUSEL: MarketCarouselProps = {
  label: "Our markets",
  cta: { label: "Explore the market", href: null },
  markets: [
    { region: "Oceania", name: "Australia & New Zealand" },
    { region: "Asia", name: "China" },
    { region: "Asia", name: "Japan" },
    { region: "Asia", name: "India" },
    { region: "Asia", name: "South Korea" },
    { region: "Asia", name: "Singapore" },
    { region: "Asia", name: "Indonesia" },
    { region: "Asia", name: "Malaysia" },
    { region: "Asia", name: "Thailand" },
    { region: "Asia", name: "Vietnam" },
    { region: "Middle East", name: "Saudi Arabia" },
  ],
};
