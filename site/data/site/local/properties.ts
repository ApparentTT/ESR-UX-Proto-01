/**
 * /jp/properties: Japan properties copy, verbatim from Key wireframes R2Local_Properties (1347:69176; mobile
 * 1347:69177). The frame is drawn for Australia and New Zealand: the market name reads "Japan" (shared search
 * entry) and the five drawn Australian estate names are "[Property name]" placeholders; their tags, types,
 * sizes and availability are as drawn (tags drawn at opacity 0 are not rendered).
 */
import type { ContactCtaBandProps } from "@/components/sections/forms/ContactCtaBand";
import type { PropertyCardData } from "@/components/sections/cards/PropertyCard";
import type { QuoteCarouselProps, QuoteSlide } from "@/components/sections/carousels/QuoteCarousel";
import type { ServiceStep } from "@/components/sections/local/ServiceSteps";
import { PROP_INTRO } from "@/data/site/pages/portfolio";
import { JP } from "./shared";
import { JP_DRAWN_PROPERTY, jpPropertyHref } from "./property-detail";

/** 1110:72068 (the group intro copy, as drawn) */
export const JP_PROP_INTRO = PROP_INTRO;

/** "DevelopmentServices" 1292:60716 */
export const JP_PROP_SERVICES: { title: string; steps: ServiceStep[] } = {
  title: "Let us take care of the property management",
  steps: [
    {
      number: "01",
      title: "Active asset management",
      body: "Enhancing value through strategic planning and proactive optimisation of assets, ensuring maximising investor returns and sustained growth in the investment portfolio.",
    },
    {
      number: "02",
      title: "Property management",
      body: "Expertly handling all aspects of the property experience for our customers and ensuring operational efficiency to safeguard and maximise property performance.",
    },
    {
      number: "03",
      title: "Leasing",
      body: "Tailoring comprehensive leasing solutions to attract and retain quality customers, foster occupancy, and drive value while aligning with market trends and investor objectives.",
    },
  ],
};

const NAME = "[Property name]";
/** The "[Property name]" cards open the drawn property detail page */
const DETAIL = jpPropertyHref(JP_DRAWN_PROPERTY.name);

/** "Featured cards" 1110:72076: each opens the drawn property detail page */
export const JP_PROP_FEATURED = {
  title: "Featured properties",
  featured: {
    tags: ["Under development", "Solar embedded network"],
    title: NAME,
    type: "Industrial",
    size: "2,500-175,000 sqm",
    availability: "Available now",
    href: DETAIL,
  } satisfies PropertyCardData,
  cards: [
    { title: NAME, type: "Industrial", size: "2,500-175,000 sqm", availability: "Available now", href: DETAIL },
    { title: NAME, type: "Industrial", size: "941-1,162 sqm", availability: "Available now", href: DETAIL },
    { tags: ["Under development"], title: NAME, type: "Industrial", size: "2,883-25,309 sqm", availability: "Available now", href: DETAIL },
    { title: NAME, type: "Industrial", size: "5,539-13,850 sqm", availability: "Available now", href: DETAIL },
  ] satisfies PropertyCardData[],
  link: { label: "View all properties", href: JP.findProperties },
};

/** Carousel 1110:73806: one slide drawn, repeated for the three dots; "View case study" is inert */
const QUOTE: QuoteSlide = {
  quote: "“Write a quote here from one of your customers. Quotes are a great way to build confidence in your products or services.”",
  attribution: "Jane DOE • CEO of MyCompany",
  cta: { label: "View case study", href: null },
};
export const JP_PROP_QUOTES: QuoteCarouselProps = {
  label: "Customer quotes",
  pager: "dots",
  topStrip: true,
  slides: [QUOTE, QUOTE, QUOTE],
};

/** "ContactUs — Block=Call To Action" 1297:81059 (annotated "Japan only") */
export const JP_PROP_TOURS: ContactCtaBandProps = {
  title: "Property tours",
  body: "[Overview of property tours and their benefits, to be supplied by ESR Japan. Why a visitor should come and see a facility in person before they commit.]",
  cta: { label: "Explore more", href: JP.propertyTours },
};

/** 1110:72385 */
export const JP_PROP_PORTFOLIO_HEADING = "Explore the portfolio";
