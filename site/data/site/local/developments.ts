/**
 * /jp/developments: Local_Developments (Primary wireframes 1273:74412, mobile 1273:87214), verbatim.
 * "End to end, in house", the case-study cards and the FAQ are word for word the group versions, so they are
 * imported from the group data.
 */
import type { LocalStat } from "@/components/sections/local/LocalKeyStats";
import type { BentoAccordionProps } from "@/components/sections/carousels/BentoAccordion";
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import { JP } from "./shared";

export const JP_DEV_INTRO = {
  title: "Developments",
  body: "We design and build logistics facilities across Japan, from first plan to first day of operation. Backed by group experience, delivered by a local team who know these markets.",
};

/** "Find a development opportunity": submits to the ESR Japan property search, pre-lease included */
export const JP_DEV_SEARCH = {
  title: "Find a development opportunity",
  typeLabel: "Development type",
  placeholder: "Search prefecture, city or estate",
  submitLabel: "Search",
};

export const JP_DEV_SCALE: { title: string; sub: string; stats: LocalStat[]; footnotes: string[] } = {
  title: "Backed by group scale",
  sub: "A leading platform with the scale, expertise and local presence to deliver, wherever your business is heading next.",
  stats: [
    { value: "US $60.9B", label: "Total assets under management", sup: 1 },
    { value: "US $58.4B", label: "Third-party assets under management", sup: 2 },
    { value: "1,100+", label: "People" },
    { value: "13", label: "Countries" },
  ],
  footnotes: [
    "Total AUM is comprised of third-party AUM and balance sheet real estate. Data as at 30 June 2026.",
    "Third-party AUM excludes AUM from associates, balance sheet investment properties and levered uncalled committed capital.",
  ],
};

/** Heading over the case study cards (1416:99584; its sub line is hidden in the design) */
export const JP_DEV_FEATURED_HEADING = "Featured developments";

export const JP_DEV_VIEW_ALL = { label: "View all case studies", href: JP.provenCapability };

/** Text carousel, slides 2-3 repeat slide 1 (only slide 1 is drawn) */
export const JP_DEV_CUSTOMER_STORIES: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Customer stories",
  body: "How we worked alongside a customer to plan, build and hand over a facility designed around the way they operate.",
  actions: [
    { label: "View case study", href: null },
    { label: "Explore our capabilities", href: JP.provenCapability, variant: "secondary" },
  ],
};

export const JP_DEV_SUSTAINABILITY: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Featured sustainability stories",
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  actions: [{ label: "View case study", href: null }],
};

/** "What we develop": the shared assets module (Figma 1455:42800), linked to the local pages; Data centres goes to the group page */
export const JP_DEV_WHAT_WE_DEVELOP: BentoAccordionProps = {
  heading: "What we develop",
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
    { id: "infrastructure", title: "Infrastructure", href: null },
  ],
  currentHref: JP.developments,
};

/** Newsletter: no country field, as drawn */
export const JP_DEV_NEWSLETTER = {
  title: "Get new development opportunities in your inbox",
  body: "Sign up to our newsletter",
};
