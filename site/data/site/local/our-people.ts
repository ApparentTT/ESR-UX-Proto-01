/**
 * /jp/our-people: OurPeople local (Primary wireframes 1273:80361, mobile 1273:80362), verbatim.
 * The intro, stats, "Talent development", quote carousel and careers form are word for word the group versions
 * (data/site/pages/our-people.ts, stats, careers, quoteCarousels). The local page adds "Benefits" and leaves out
 * "Mobility and growth at ESR".
 */
import type { MediaCardData } from "@/components/sections/cards/MediaCard";

/** "Benefits" (WhatWeOffer 1185:17912): three static image cards; the drawn fourth card, buttons and arrows are hidden */
export const JP_PEOPLE_BENEFITS: { title: string; cards: MediaCardData[] } = {
  title: "Benefits",
  cards: [
    { title: "Learning and development", body: "Structured development plans, study support and secondments across our markets." },
    { title: "Wellbeing and flexibility", body: "Flexible working, parental leave above statutory, and wellbeing support in every market." },
    { title: "Recognition and reward", body: "Clear pay frameworks, long term incentives and recognition that reaches beyond the top of the org chart." },
  ],
};
