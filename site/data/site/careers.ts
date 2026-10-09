/**
 * PEOPLE §4 "Talent development" and §6 "Mobility and growth at ESR" (inventory B45), verbatim.
 * "See all open roles" (external jobs board) and the market tiles (external market sites) are inert.
 */
import type { TalentDevelopmentProps } from "@/components/sections/infocards/TalentDevelopment";
import type { MobilityMarketsProps } from "@/components/sections/infocards/MobilityMarkets";

const PILLAR_DESCRIPTION = "[Description to be supplied by the ESR people team]";

export const PEOPLE_TALENT: TalentDevelopmentProps = {
  title: "Talent development",
  sub: "How careers are built here, from the first year through to leading a market.",
  pillars: [
    { title: "Structured development", description: PILLAR_DESCRIPTION },
    { title: "Learning and study support", description: PILLAR_DESCRIPTION },
    { title: "Secondments across markets", description: PILLAR_DESCRIPTION },
  ],
  cta: { label: "See all open roles", href: null },
};

export const PEOPLE_MOBILITY: MobilityMarketsProps = {
  title: "Mobility and growth at ESR",
  sub: "[One to two sentences on how employees move across business units and functions, to be supplied by the ESR people team]",
  label: "Explore careers in our markets",
  markets: [
    { name: "Japan", href: null },
    { name: "Australia and New Zealand", href: null },
    { name: "South Korea", href: null },
    { name: "Greater China", href: null },
    { name: "India", href: null },
  ],
};
