/**
 * Case-study listings (inventory B32), verbatim.
 * - SCS: /sustainability/case-studies §2 (`sustainability-case-studies.md`).
 * - CAP: /about/proven-capability §2–3 (`about-proven-capability.md`), sections 2 and 3 merged into one grid.
 * Case-study detail pages are not wireframed, so every card is inert (href null).
 * Eyebrow and meta strings keep the wireframe's two spaces either side of the "·".
 */
import type { CaseStudyCardData } from "@/components/sections/listings/CaseStudyCard";
import type { CapListingProps, ScsListingProps } from "@/components/sections/listings/CaseStudyListing";

/** SCS §2b, reading order (row 1 left to right, then row 2). "Upparel’s" uses U+2019. */
export const SCS_CASE_STUDIES: CaseStudyCardData[] = [
  {
    eyebrow: "Sustainable solutions  ·  Australia",
    title: "Powering Upparel’s next chapter with a logistics facility built to scale",
    excerpt: "A purpose built warehouse for a textile recovery business, designed around future growth.",
    cta: "Find out more",
    href: null,
  },
  {
    eyebrow: "Future-ready solutions  ·  Australia",
    title: "Delivering EV infrastructure in new developments",
    excerpt: "Charging across development sites, including a solar powered station at Horsley.",
    cta: "Find out more",
    href: null,
  },
  {
    eyebrow: "Sustainable landscape solutions  ·  Australia",
    title: "Woody Meadows bringing new life into industrial and logistics facilities",
    excerpt: "Native shrub plantings with the University of Melbourne, piloted at Epping.",
    cta: "Find out more",
    href: null,
  },
  {
    eyebrow: "Hive solutions  ·  Australia",
    title: "Pollinating change through our industrial facilities",
    excerpt: "Beehives installed across the network to support local pollinator populations.",
    cta: "Find out more",
    href: null,
  },
  {
    eyebrow: "Discovery solutions  ·  Australia",
    title: "Moorebank Intermodal Precinct EcoTours",
    excerpt: "An outdoor classroom for local students, run with National Intermodal.",
    cta: "Find out more",
    href: null,
  },
  {
    eyebrow: "Community solutions  ·  Australia",
    title: "ESR and Eat Up partnership",
    excerpt: "School lunches made by ESR volunteers for children who would otherwise go without.",
    cta: "Find out more",
    href: null,
  },
];

/**
 * SCS §2 listing. The Country options and the empty-state line are not designed (flagged in the spec):
 * "All countries" (shown as "Country"), then the markets used elsewhere in the prototype.
 */
export const SCS_LISTING: Omit<ScsListingProps, "variant"> = {
  cards: SCS_CASE_STUDIES,
  filter: {
    label: "Country",
    allLabel: "All countries",
    options: [
      { id: "australia", label: "Australia" },
      { id: "japan", label: "Japan" },
      { id: "south-korea", label: "South Korea" },
      { id: "china", label: "China" },
      { id: "india", label: "India" },
    ],
  },
  countText: "Showing {n} of XX case studies",
  emptyText: "No case studies found",
  loadMore: { label: "Load more case studies", maxLoads: 2 },
  ariaLabel: "Sustainability case studies",
};

/** CAP §2c and §3, reading order. Titles are the wireframe placeholder. */
export const CAP_CASE_STUDIES: CapListingProps["cards"] = [
  { title: "Case study title placeholder", meta: "Active management  ·  Japan", href: null },
  { title: "Case study title placeholder", meta: "Customer  ·  Australia", href: null },
  { title: "Case study title placeholder", meta: "Development  ·  South Korea", href: null },
  { title: "Case study title placeholder", meta: "ESG  ·  Singapore", href: null },
  { title: "Case study title placeholder", meta: "Active management  ·  Greater China", href: null },
  { title: "Case study title placeholder", meta: "Development  ·  India", href: null },
];

/**
 * CAP §2 listing. Theme and Market options come from the card metas; Asset type options, "Oldest first"
 * and the empty-state line are invented (flagged in the spec). Loads in the designed state: chips
 * "Active management" and "Japan", sort "Newest first", "Showing 6 of 24 case studies".
 */
export const CAP_LISTING: Omit<CapListingProps, "variant"> = {
  title: "Case studies",
  cards: CAP_CASE_STUDIES,
  filters: [
    {
      key: "theme",
      label: "Theme",
      options: [
        { id: "active-management", label: "Active management" },
        { id: "customer", label: "Customer" },
        { id: "development", label: "Development" },
        { id: "esg", label: "ESG" },
      ],
    },
    {
      key: "market",
      label: "Market",
      options: [
        { id: "japan", label: "Japan" },
        { id: "australia", label: "Australia" },
        { id: "south-korea", label: "South Korea" },
        { id: "greater-china", label: "Greater China" },
        { id: "singapore", label: "Singapore" },
        { id: "india", label: "India" },
      ],
    },
    {
      key: "assetType",
      label: "Asset type",
      options: [
        { id: "logistics", label: "Logistics" },
        { id: "industrial", label: "Industrial" },
        { id: "data-centres", label: "Data centres" },
        { id: "infrastructure", label: "Infrastructure" },
      ],
    },
  ],
  sort: {
    label: "Sort",
    options: [
      { id: "newest", label: "Newest first" },
      { id: "oldest", label: "Oldest first" },
    ],
  },
  initial: { theme: ["active-management"], market: ["japan"], sort: "newest" },
  countText: "Showing {n} of 24 case studies",
  clearAllLabel: "Clear all",
  emptyText: "No case studies match these filters.",
};
