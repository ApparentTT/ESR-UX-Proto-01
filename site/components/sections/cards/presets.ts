/**
 * Verbatim card sets for the "cards" section components, copied from the page specs.
 * Pages can import these or pass their own data. Placeholders ("Description", lorem ipsum,
 * "[Showcase line …]") are kept exactly as drawn. href: a built route, null = inert link,
 * omitted on MediaCards = a static card (not a link).
 */
import type { MarketCardData } from "./MarketCards";
import type { MediaCardData } from "./MediaCard";
import type { OverlayCaseCardData } from "./OverlayCaseCards";
import type { PropertyCardData } from "./PropertyCard";

/** B7 HOME §5, PORT §8, DEV §9b. All inert (external local market sites). */
export const MARKET_CARDS: MarketCardData[] = [
  { name: "Japan" },
  { name: "Australia and New Zealand", lines: ["Australia and", "New Zealand"] },
  { name: "South Korea" },
  { name: "China" },
  { name: "India" },
];

/** B13 explore2, HOME §9b (after SectionHeading "Explore more about us"). */
export const HOME_EXPLORE_CARDS: MediaCardData[] = [
  { title: "About us", body: "Description", href: "/about" },
  { title: "Our people", body: "Description", href: "/about/our-people" },
];

/** B13 products3, PROP §9 (after SectionHeading "Explore our portfolio"). */
export const PROP_PORTFOLIO_CARDS: MediaCardData[] = [
  { title: "Developments", body: "Description", href: "/portfolio/developments" },
  { title: "Data centres", body: "Description", href: "/portfolio/data-centres" },
  { title: "Infrastructure", body: "Description", href: null },
];

const PILLAR_BODY =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/** B13 products3 static, SUS §3b (after SectionHeading "Strategic pillars"). No links. */
export const SUS_PILLAR_CARDS: MediaCardData[] = [
  { title: "Environmental", body: PILLAR_BODY },
  { title: "Social", body: PILLAR_BODY },
  { title: "Governance", body: PILLAR_BODY },
];

/** B13 products3 static with an inline heading, SGOV §3. No links. */
export const SGOV_GOVERN_HEADING = "How we govern sustainability";
export const SGOV_GOVERN_CARDS: MediaCardData[] = [
  { title: "Board oversight", body: "A board level sustainability committee sets targets and reviews progress each half." },
  { title: "Embedded in the business", body: "Sustainability sits inside development, asset management and funds, not alongside them." },
  { title: "Independently assured", body: "Our reporting is externally assured and aligned to recognised global frameworks." },
];

/** B13 featured3, ABOUT §7 (surface band, no heading). */
export const ABOUT_FEATURED_CARDS: MediaCardData[] = [
  { title: "Our people", href: "/about/our-people" },
  { title: "Our customers", href: null },
  { title: "News and insights", href: "/news" },
];

/** B13 story3, DC §7b (after SectionHeading "Featured sustainability stories"). */
export const DC_STORY_CARDS: MediaCardData[] = [
  { eyebrow: "Water and PUE  ·  Japan", title: "Sustainability story placeholder", cta: "Read the story", href: "/sustainability/case-studies" },
  { eyebrow: "Renewable power  ·  South Korea", title: "Sustainability story placeholder", cta: "Read the story", href: "/sustainability/case-studies" },
  { eyebrow: "Renewable power  ·  South Korea", title: "Sustainability story placeholder", cta: "Read the story", href: "/sustainability/case-studies" },
];

/** B13 learnMore3, LEAD §4 (no heading; #FAFBFF band renders white). */
export const LEAD_LEARN_MORE_CARDS: MediaCardData[] = [
  { title: "Proven capability", cta: "Learn more", href: "/about/proven-capability" },
  { title: "About us", cta: "Learn more", href: "/about" },
  { title: "Corporate governance", cta: "Learn more", href: "/about/corporate-governance" },
];

/** B13 case3, CAP §2c + §3 (6 cards, all inert). Meta strings keep two spaces either side of the "·". */
export const CAP_CASE_STUDY_CARDS: MediaCardData[] = [
  { title: "Case study title placeholder", meta: "Active management  ·  Japan", href: null },
  { title: "Case study title placeholder", meta: "Customer  ·  Australia", href: null },
  { title: "Case study title placeholder", meta: "Development  ·  South Korea", href: null },
  { title: "Case study title placeholder", meta: "ESG  ·  Singapore", href: null },
  { title: "Case study title placeholder", meta: "Active management  ·  Greater China", href: null },
  { title: "Case study title placeholder", meta: "Development  ·  India", href: null },
];

/** B20 DEV §5b (after SectionHeading "Development case studies"). All inert. */
const SHOWCASE = "[Showcase line to be supplied by the development team]";
export const DEV_CASE_STUDY_CARDS: OverlayCaseCardData[] = [
  { eyebrow: "Kanagawa  ·  Logistics", title: "Higashi-Ogishima Distribution Centre 2", showcase: SHOWCASE },
  { eyebrow: "Kanagawa  ·  Logistics", title: "Yokohama Sachiura Distribution Centre 3", showcase: SHOWCASE },
  { eyebrow: "Hyogo  ·  Logistics", title: "Itami Distribution Centre", showcase: SHOWCASE },
];

/** B38 CAP §5 (after SectionHeading "Featured properties"). All inert. Opacity-0 tags are not rendered. */
export const CAP_FEATURED_PROPERTY: PropertyCardData = {
  tags: ["Under development", "Solar embedded network"],
  title: "Lorem ipsum dolor",
  type: "Industrial",
  size: "2,500-175,000 sqm",
  availability: "Available now",
};
export const CAP_PROPERTY_CARDS: PropertyCardData[] = [
  { title: "Lorem ipsum dolor", type: "Industrial", size: "2,500-175,000 sqm", availability: "Available now" },
  { title: "Lorem ipsum dolor", type: "Industrial", size: "941-1,162 sqm", availability: "Available now" },
  { tags: ["Under development"], title: "Lorem ipsum dolor", type: "Industrial", size: "2,883-25,309 sqm", availability: "Available now" },
  { title: "Lorem ipsum dolor", type: "Industrial", size: "5,539-13,850 sqm", availability: "Available now" },
];
