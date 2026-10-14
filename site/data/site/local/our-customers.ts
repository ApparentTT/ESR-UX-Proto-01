/**
 * /jp/our-customers: Local_OurCustomers (Figma 1289:110887, mobile 1289:110895), verbatim. The frames are drawn for
 * Australia and New Zealand: as on the other local pages, the market reads "Japan", the Featured Properties cards are
 * the Japan featured properties and the links go to the Japan pages (group pages where Japan has none).
 * The stale "Industries we serve" image cards left on the mobile frame (1088:56568) are not built: the donut module
 * replaces them.
 */
import type { ContactCtaBandProps } from "@/components/sections/forms/ContactCtaBand";
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";
import type { LocalPropertyCardData } from "@/components/sections/local/LocalPropertyCards";
import { CUSTOMERS_STORIES, CUSTOMERS_STORIES_HEADING, CUSTOMERS_TRUSTED, industriesWeServe } from "@/data/site/pages/our-customers";
import { JP, jpFeaturedProperties } from "./shared";

export const JP_CUSTOMERS_INTRO = {
  title: "Our customers",
  body: "From national distribution to cold chain to digital infrastructure, businesses across Japan run their operations out of our facilities. Here's how we help them do it.",
};

/** PortfolioBySector 1416:98574. Japan has no data centres page: Digital infrastructure goes to the group one (as JP.dataCentres). */
export const JP_CUSTOMERS_INDUSTRIES = industriesWeServe({
  logistics: JP.properties,
  manufacturing: JP.properties,
  digital: JP.dataCentres,
});

/** LogoWall 943:26688, as on the group page (no "Explore more" button) */
export const JP_CUSTOMERS_TRUSTED = CUSTOMERS_TRUSTED;

/** Group 29 (1052:40128): the same heading and cards as the group page, on a grey band */
export const JP_CUSTOMERS_STORIES_HEADING = CUSTOMERS_STORIES_HEADING;
export const JP_CUSTOMERS_STORIES = CUSTOMERS_STORIES;

/**
 * Featured Properties (1052:39992). Four "Property name" cards are drawn; the Japan featured properties stand in,
 * shown twice so the carousel has somewhere to go. "Search all prroperties" is drawn with a typo, corrected here.
 */
export const JP_CUSTOMERS_FEATURED: { title: string; link: { label: string; href: string | null }; cards: LocalPropertyCardData[] } = {
  title: "Featured Properties",
  link: { label: "Search all properties", href: JP.findProperties },
  cards: [...jpFeaturedProperties(" sqm"), ...jpFeaturedProperties(" sqm")],
};

/** PortfolioTile 924:21356: the button reads "Explore our Developments", as drawn */
export const JP_CUSTOMERS_PORTFOLIO: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Our portfolio",
  body: "Every property and development we own and manage across Japan, and the asset management team behind them.",
  actions: [{ label: "Explore our Developments", href: JP.developments }],
};

/** DataCentresTile 924:21357 (image right) */
export const JP_CUSTOMERS_DATA_CENTRES: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Data centres",
  body: "Purpose built digital infrastructure, from land and power through to delivery and operation.",
  cta: { label: "Explore data centres", href: JP.dataCentres },
};

/** ContactUs 1289:110886 (white band): the Japan site has no contact page, so it goes to the group one */
export const JP_CUSTOMERS_CONTACT_CTA: ContactCtaBandProps = {
  title: "Talk to us about your next facility",
  body: "Tell us what you need and we'll put you in touch with the right person on the local team.",
  cta: { label: "Contact us", href: "/contact" },
  bg: "white",
};
