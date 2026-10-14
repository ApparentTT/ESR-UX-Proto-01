/**
 * /about/our-customers: Group_OurCustomers (Figma 1289:110877, mobile 1289:110885), verbatim.
 *
 * "Industries we serve" (PortfolioBySector 1463:46678, hover 1416:98770 / 1463:46623): only Logistics and
 * distribution has its detail drawn. The other two descriptions come from the earlier Industries cards still on
 * Local_OurCustomers mob (1088:56568); their figures follow the drawn placeholder shape. The donut split is the
 * drawn one (Figma arcData, about 52 / 30 / 18) until ESR leasing supplies the portfolio split.
 */
import type { FeatureBandAction } from "@/components/sections/blocks/FeatureBand";
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";
import type { MediaCardData } from "@/components/sections/cards/MediaCard";
import type { LogoMarqueeProps } from "@/components/sections/carousels/LogoMarquee";
import type { IndustriesWeServeProps } from "@/components/sections/customers/IndustriesWeServe";
import { CAP_CONTACT_CTA } from "@/data/site/offices";

export const CUSTOMERS_INTRO = {
  title: "Our customers",
  body: "From national distribution to cold chain to digital infrastructure, businesses across Asia Pacific run their operations out of our facilities. Here's how we help them do it.",
};

/** Stats row of every sector detail, as drawn on Logistics and distribution */
const SECTOR_STATS = [
  { value: "XX%", label: "of portfolio" },
  { value: "XX", label: "customers" },
  { value: "X.X m", label: "sqm leased" },
];

/** "Industries we serve" content; the page passes where each sector's "Explore this sector" goes. */
export function industriesWeServe(hrefs: { logistics: string | null; manufacturing: string | null; digital: string | null }): IndustriesWeServeProps {
  const link = (href: string | null) => ({ label: "Explore this sector", href });
  return {
    title: "Industries we serve",
    total: { value: "XX m", label: "sqm leased" },
    customersLabel: "Customers in this sector",
    footnote: "Figures as at [date]. Sector taxonomy and the portfolio split to be supplied by ESR leasing.",
    sectors: [
      {
        name: "Logistics and distribution",
        share: "XX%",
        weight: 52.25,
        description: "Third party logistics, retail distribution and e-commerce fulfilment, in the locations that shorten the last mile.",
        stats: SECTOR_STATS,
        link: link(hrefs.logistics),
      },
      {
        name: "Manufacturing and cold chain",
        share: "XX%",
        weight: 29.95,
        description: "Light manufacturing, food and pharmaceutical storage, built to the temperature and compliance standards each sector needs.",
        stats: SECTOR_STATS,
        link: link(hrefs.manufacturing),
      },
      {
        name: "Digital infrastructure",
        share: "XX%",
        weight: 17.8,
        description: "Hyperscale and colocation data centres, with the power, land and delivery capability behind them.",
        stats: SECTOR_STATS,
        link: link(hrefs.digital),
      },
    ],
  };
}

export const CUSTOMERS_INDUSTRIES = industriesWeServe({
  logistics: "/portfolio/properties",
  manufacturing: "/portfolio/properties",
  digital: "/portfolio/data-centres",
});

/** LogoWall 924:21175: the "Explore more" button is removed (client feedback), so the row has no CTA */
export const CUSTOMERS_TRUSTED: LogoMarqueeProps = {
  title: "Trusted by businesses across Asia Pacific",
  count: 7,
  spacing: "trusted",
  listLabel: "Customer logos",
};

/** StoriesTitle 924:21195 + CustomerStories 924:21196: customer story pages are not wireframed, so the cards are inert */
export const CUSTOMERS_STORIES_HEADING = "Featured customer stories";
export const CUSTOMERS_STORIES: MediaCardData[] = Array.from({ length: 3 }, () => ({ title: "Customer story placeholder", href: null }));

/** PortfolioTile 927:21874 */
export const CUSTOMERS_PORTFOLIO: { title: string; body: string; actions: FeatureBandAction[] } = {
  title: "Our portfolio",
  body: "Every property and development we own and manage across the region, and the asset management team behind them.",
  actions: [{ label: "Explore our portfolio", href: "/portfolio" }],
};

/** DataCentresTile 927:21854 (image left) */
export const CUSTOMERS_DATA_CENTRES: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Data centres",
  body: "Purpose built digital infrastructure, from land and power through to delivery and operation.",
  cta: { label: "Explore data centres", href: "/portfolio/data-centres" },
};

/** ContactUs 1289:110876: the same band as Proven capability §8 */
export const CUSTOMERS_CONTACT_CTA = CAP_CONTACT_CTA;
