/**
 * Page-only copy for /portfolio/data-centres/leadership (DC leadership, client feedback round): the intro,
 * the data centre leaders (same card pattern as Our leadership, data/site/leaders.ts) and the contact band.
 * Names and bios are placeholders until ESR supplies the team.
 */
import type { ContactCtaBandProps } from "@/components/sections/forms/ContactCtaBand";
import type { Leader } from "@/data/site/leaders";

export const DC_LEAD_INTRO = {
  title: "Data centre leadership",
  body: "The team leading ESR's digital infrastructure business across Asia Pacific.",
};

const GROUP = "Data Centres Leadership Team";

export const DC_LEADERS: Leader[] = [
  {
    group: GROUP,
    name: "Daniel Wong",
    title: "Chief Executive Officer, Data Centres",
    bio: "Daniel leads ESR's data centre business across Asia Pacific, with responsibility for strategy, growth and performance. He has more than 20 years in digital infrastructure, including senior roles building hyperscale platforms across the region.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Aiko Tanaka",
    title: "Head of Development, Data Centres",
    bio: "Aiko oversees the design and delivery of ESR's data centre pipeline, from land and power procurement through to commissioning. She previously led mission-critical development programmes in Japan and Singapore.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Priya Nair",
    title: "Head of Operations, Data Centres",
    bio: "Priya is responsible for the operation of ESR's data centre portfolio, including uptime, energy performance and customer service. She brings 18 years of experience running critical facilities for global operators.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Mark Ellis",
    title: "Chief Commercial Officer, Data Centres",
    bio: "Mark leads customer and partner relationships across the data centre platform, working with hyperscale and enterprise customers on their capacity plans across Asia Pacific.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Sun-woo Park",
    title: "Head of Korea, Data Centres",
    bio: "Sun-woo leads ESR's data centre business in South Korea, including site origination, development and customer delivery. He joined ESR from a leading Korean telecommunications group.",
    hasAreaButton: false,
  },
  {
    group: GROUP,
    name: "Emma Clarke",
    title: "Head of Investment, Data Centres",
    bio: "Emma leads investment and capital partnerships for the data centre platform, structuring the funds and joint ventures that finance ESR's pipeline across the region.",
    hasAreaButton: false,
  },
];

export const DC_LEAD_CONTACT_CTA: ContactCtaBandProps = {
  title: "Talk to our data centre team",
  body: "Tell us what you need and we'll put you in touch with the right people in your market.",
  cta: { label: "Contact us", href: "/contact" },
};
