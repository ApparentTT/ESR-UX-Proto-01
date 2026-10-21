/**
 * Copy shared by the Japan local pages (/jp, /jp/portfolio, /jp/properties), verbatim from the Key wireframes
 * frames R2_Local_homepage_>10Properties 1347:52640, R2_local_PortfolioOverview-Japan 1347:60557 and
 * R2Local_Properties 1347:69176. R2Local_Properties is drawn for Australia and New Zealand: as in the local
 * navigation (config/local-nav.ts), the market name reads "Japan" and the drawn Australian property names
 * are placeholders.
 */
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";
import type { LocalPropertyCardData } from "@/components/sections/local/LocalPropertyCards";
import type { PropertySearchEntryProps } from "@/components/sections/local/PropertySearchEntry";
import { jpPropertyHref } from "./property-detail";

/** Local destinations */
export const JP = {
  home: "/jp",
  portfolio: "/jp/portfolio",
  properties: "/jp/properties",
  developments: "/jp/developments",
  provenCapability: "/jp/proven-capability",
  news: "/jp/news",
  about: "/jp/about",
  leadership: "/jp/leadership",
  propertyTours: "/jp/property-tours",
  /** ESR Japan property search: the first-visit page and the results */
  findProperties: "/properties",
  propertySearch: "/properties/search",
  /** Group page: the Japan site has no data centres page (local nav marks it as leaving the site) */
  dataCentres: "/portfolio/data-centres",
} as const;

/** "Search entry / desktop" (1290:26943, 1290:31163) */
export const JP_SEARCH_ENTRY: PropertySearchEntryProps = {
  title: "Find space for your business",
  sub: "Search warehouses, business parks and data centres across Japan.",
  placeholder: "Search by location",
  filtersLabel: "Filters",
  submitLabel: "Search",
  viewAll: { label: "View all properties", href: JP.findProperties },
};

/** "Invest with ESR" (HOME 1110:53529, PORT 1110:63967, PROP 1110:72392): the group Investors page */
export const JP_INVEST: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Invest with ESR",
  body: "[Description about Invest with ESR]",
  cta: { label: "Learn more", href: "/investors" },
};

/** Newsletter form (PORT 1110:63968, PROP 1110:72394): no country field, as drawn */
export const JP_NEWSLETTER = {
  title: "Get available properties in your inbox",
  body: "Sign up to our newsletter",
  fields: ["name", "email", "consent"] as ("name" | "email" | "consent")[],
  required: ["firstName", "lastName", "email", "consent"] as ("firstName" | "lastName" | "email" | "consent")[],
};

/** Japan featured properties (HOME 1110:53381; PORT 1110:63864 drops the space before "sqm", as drawn) */
export function jpFeaturedProperties(sqm: " sqm" | "sqm"): LocalPropertyCardData[] {
  return [
    {
      title: "Higashi Distribution Centre, Kawasaki, Kanagawa",
      type: "Warehouse",
      size: `8,921,59${sqm}`,
      status: "Available now",
      href: jpPropertyHref("Higashi Distribution Centre"),
    },
    {
      title: "Yokohama Sachiura Distribution Centre 1, Yokohama, Kanagawa",
      type: "Warehouse",
      size: `35,595.27${sqm}`,
      status: "Available now",
      href: jpPropertyHref("Yokohama Sachiura Distribution Centre 1"),
    },
    {
      title: "Kawanishi Distribution Centre 3, Kawanishi City, Hyogo",
      type: "Logistics",
      size: `433,000${sqm}`,
      status: "Under development",
      href: jpPropertyHref("Kawanishi Distribution Centre 3"),
    },
  ];
}

/** The "Scale that delivers" footnote (HOME 1110:53528, PORT 1290:29670) */
export const JP_AUM_FOOTNOTE = "Total AUM is comprised of Third-Party AUM plus Balance Sheet Real Estate. Data as at 31 December 2025.";
