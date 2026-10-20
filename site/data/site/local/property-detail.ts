/**
 * /jp/properties/[slug]: Japan property detail, verbatim from the Figma section "Property and development detail"
 * (719:1873): "Property detail " 1273:90948 (1440) and "Property detail  mob" 1273:90949 (390) and the photo gallery
 * frames (grid 1507:59463 / 1507:59568, lightbox 1507:59500 / 1507:59592). Presentation feedback: Save as PDF beside
 * Share, the three downloads stepped out beside Enquire now, and a sticky bar that stays to the bottom of the page.
 *
 * One static page per property below. The drawn page is Higashi-Ogishima Distribution Centre 2; the other pages
 * use the same wireframe content with their own name and address (as the fund detail page does). Only
 * Higashi-Ogishima Distribution Centre 2 has published figures (see data/properties.ts): every other property
 * keeps bracketed TBC placeholders for its tags, About copy and key facts, so no real property is shown with
 * another property's figures.
 *
 * Not drawn, added at the client's request: the Share menu items and the sticky bar. Their copy is
 * placeholder in the wireframe voice.
 *
 * Plain module (no imports from ./shared, which imports jpPropertyHref from here).
 */
import type { EnquirySuccessCopy } from "@/components/sections/forms/formPresets";

/* ------------------------------------------------------------- properties */

export type JpProperty = {
  slug: string;
  name: string;
  /** Address line under the title (and in the share text) */
  address: string;
  /** Prefecture tag on the related property cards */
  region: string;
  /** Published figures: Higashi-Ogishima Distribution Centre 2 only */
  published?: {
    type: string;
    completion: string;
    gfa: string;
    siteArea: string;
    about: string;
  };
};

const PROPERTIES_PAGE = "/jp/properties";
const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const make = (name: string, address: string, region: string, published?: JpProperty["published"]): JpProperty => ({
  slug: slugify(name),
  name,
  address,
  region,
  published,
});

/**
 * The drawn property first, then the four drawn as Related properties (1138:10831), then the other named Japan
 * properties on the prototype's cards (Japan homepage and portfolio featured cards, property tours), so every
 * Japan property card opens a detail page. Addresses as in data/site/local/property-tours.ts and the cards.
 */
export const JP_PROPERTIES: JpProperty[] = [
  make("Higashi-Ogishima Distribution Centre 2", "Higashi-Ogishima, Kawasaki-ku, Kawasaki, Kanagawa", "Kanagawa", {
    type: "Logistics",
    completion: "Completion 2028 onwards",
    gfa: "306,000 sqm GFA",
    siteArea: "66,155 sqm",
    about:
      "Higashi-Ogishima Distribution Centre 2 is a planned development on a 66,155 sqm site at Higashi-Ogishima in Kawasaki, Kanagawa. At 306,000 sqm of gross floor area it will be one of ESR's largest facilities in Japan. Completion is planned for 2028 onwards. Structure, specifications, amenities and environmental certification are still in planning.",
  }),
  make("Higashi-Ogishima Distribution Centre 1", "Higashi-Ogishima, Kawasaki-ku, Kawasaki, Kanagawa", "Kanagawa"),
  make("Kawasaki Ukishima Distribution Centre", "Ukishima, Kawasaki-ku, Kawasaki, Kanagawa", "Kanagawa"),
  make("Kawasaki Yako Distribution Centre", "Yako, Kawasaki-ku, Kawasaki, Kanagawa", "Kanagawa"),
  make("Yokohama Sachiura Distribution Centre 3", "Sachiura, Kanazawa-ku, Yokohama, Kanagawa", "Kanagawa"),
  make("Yokohama Sachiura Distribution Centre 1", "Sachiura, Kanazawa-ku, Yokohama, Kanagawa", "Kanagawa"),
  make("Higashi Distribution Centre", "Kawasaki, Kanagawa", "Kanagawa"),
  make("Kawanishi Distribution Centre 3", "Kawanishi City, Hyogo", "Hyogo"),
  make("Itami Distribution Centre", "Itami, Hyogo", "Hyogo"),
];

export const jpPropertyBySlug = (slug: string) => JP_PROPERTIES.find((p) => p.slug === slug);

/** The detail page of a named Japan property (throws on an unknown name, so a typo fails the build) */
export function jpPropertyHref(name: string): string {
  const p = JP_PROPERTIES.find((x) => x.name === name);
  if (!p) throw new Error(`No Japan property detail page for "${name}"`);
  return `${PROPERTIES_PAGE}/${p.slug}`;
}

/** The drawn property: the target of cards that carry a "[Property name]" placeholder */
export const JP_DRAWN_PROPERTY = JP_PROPERTIES[0];

/** Tags over the title (1507:52097): published figures, or TBC placeholders */
export function propertyTags(p: JpProperty): string[] {
  return p.published ? [p.published.type, p.published.completion, p.published.gfa] : ["Logistics", "[Status TBC]", "[GFA TBC]"];
}

export function propertyAbout(p: JpProperty): string {
  return (
    p.published?.about ??
    `[About ${p.name}, to be supplied by ESR Japan: the site, gross floor area, completion, structure, specifications, amenities and environmental certification.]`
  );
}

/* ----------------------------------------------------------------- detail */

export type DistanceStat = { value: string; label: string };
export type PropertyContact = { name: string; second: string; secondLang?: string; email: string };
export type SpaceUnit = { unit: string; sizeSqm: number; available: string };
export type FeatureCard = { title: string; body: string };
export type GalleryCategory = { id: string; label: string };
export type GalleryPhoto = { n: number; category: GalleryCategory };

/** Contacts beside the enquiry form (1507:52335) */
const CONTACTS: PropertyContact[] = [
  { name: "ESR Japan leasing team", second: "ESR株式会社 リーシングチーム", secondLang: "ja", email: "jpn_lease@esr.com" },
  { name: "[Contact name]", second: "[Role]", email: "[Email to be confirmed]" },
];

/** Key distances under the media (1507:52126; a list at 390, 1507:59000) */
const DISTANCES: DistanceStat[] = [
  { value: "[XXkm]", label: "Tokyo Bay Aqua-Line" },
  { value: "[XXkm]", label: "Central Tokyo" },
  { value: "[XXkm]", label: "Haneda Airport" },
  { value: "[XXkm]", label: "Port of Kawasaki" },
];

/**
 * "Available space" (1138:10743): the five drawn rows, then 15 sample rows so "Show 15 more units" and the
 * filters have something to work over. Sizes and dates are indicative prototype values.
 */
const UNITS: SpaceUnit[] = [
  { unit: "Warehouse A", sizeSqm: 9084, available: "Available now" },
  { unit: "Warehouse B", sizeSqm: 23410, available: "Q1 2027" },
  { unit: "Warehouse C", sizeSqm: 14650, available: "Q1 2027" },
  { unit: "Warehouse D", sizeSqm: 31200, available: "Q2 2027" },
  { unit: "Office suite 1", sizeSqm: 1240, available: "Q4 2027" },
  { unit: "Warehouse E", sizeSqm: 12380, available: "Available now" },
  { unit: "Warehouse F", sizeSqm: 18900, available: "Q2 2027" },
  { unit: "Warehouse G", sizeSqm: 7560, available: "Q3 2027" },
  { unit: "Warehouse H", sizeSqm: 26740, available: "Q3 2027" },
  { unit: "Warehouse I", sizeSqm: 4820, available: "Available now" },
  { unit: "Warehouse J", sizeSqm: 15300, available: "Q4 2027" },
  { unit: "Warehouse K", sizeSqm: 21050, available: "Q1 2028" },
  { unit: "Warehouse L", sizeSqm: 9960, available: "Q2 2028" },
  { unit: "Warehouse M", sizeSqm: 33480, available: "Q2 2028" },
  { unit: "Warehouse N", sizeSqm: 11240, available: "Q3 2028" },
  { unit: "Warehouse O", sizeSqm: 6420, available: "Available now" },
  { unit: "Warehouse P", sizeSqm: 28150, available: "Q4 2028" },
  { unit: "Office suite 2", sizeSqm: 980, available: "Q1 2027" },
  { unit: "Office suite 3", sizeSqm: 1520, available: "Q3 2027" },
  { unit: "Office suite 4", sizeSqm: 2060, available: "Q2 2028" },
];

/**
 * Photo gallery (1507:59463): 24 placeholder photos across the five drawn categories, in category order (the
 * drawn lightbox shows photo 7 as Exterior). The hero and the two images beside it are photos 1 to 3.
 */
const GALLERY_CATEGORIES: (GalleryCategory & { count: number })[] = [
  { id: "exterior", label: "Exterior", count: 8 },
  { id: "interior", label: "Interior", count: 6 },
  { id: "aerial", label: "Aerial", count: 4 },
  { id: "floor-plans", label: "Floor plans", count: 3 },
  { id: "amenities", label: "Amenities", count: 3 },
];
const GALLERY_PHOTOS: GalleryPhoto[] = GALLERY_CATEGORIES.flatMap(({ count, ...category }) => Array.from({ length: count }, () => category)).map(
  (category, i) => ({ n: i + 1, category }),
);

const cards = (name: string) => [1, 2, 3, 4].map((i): FeatureCard => ({ title: `[${name} ${i}]`, body: "[One line]" }));

export const JP_PROPERTY_DETAIL = {
  breadcrumb: [
    { label: "Our portfolio", href: "/jp/portfolio" },
    { label: "Properties", href: PROPERTIES_PAGE },
  ],
  distances: DISTANCES,
  aboutTitle: "About",
  /** "Enquire now" (1507:52149): jumps to the enquiry module */
  enquireNow: "Enquire now",
  /** Beside Share: prints the page (the print stylesheet in app/globals.css gives a clean single column) */
  savePdf: "Save as PDF",
  /**
   * The three downloads, stepped out beside Enquire now (and in the sticky bar). The files are not part of the
   * prototype: each is an inert link. `label` titles the mobile sticky bar's Downloads sheet.
   */
  downloads: {
    label: "Downloads",
    files: ["Estate brochure", "Building brochure", "Building floor plan"],
  },
  /** "Features and amenities" (1507:52171): three groups, drawn open */
  features: {
    title: "Features and amenities",
    amenities: { label: "Amenities", cards: cards("Amenity") },
    sustainability: {
      label: "Sustainability",
      rating: { title: "[Rating scheme and score]", body: "[Certification body and year, to be confirmed with ESR Japan]" },
      awardsLabel: "Awards and certifications",
      /** Award / certification logo placeholders */
      awards: 4,
      cards: cards("Sustainability feature"),
    },
    property: { label: "Property features", items: Array.from({ length: 10 }, (_, i) => `[Property feature ${i + 1}]`) },
  },
  gallery: {
    photos: GALLERY_PHOTOS,
    categories: GALLERY_CATEGORIES.map(({ id, label }) => ({ id, label })),
    showAll: `Show all ${GALLERY_PHOTOS.length} photos`,
    back: "Back to property",
    allPhotos: "All photos",
    all: "All",
    close: "Close",
    caption: "[Image caption, to be supplied by ESR Japan]",
    swipeHint: "Swipe to move between photos",
  },
  space: {
    title: "Available space",
    units: UNITS,
    /** Rows shown before "Show more" */
    pageSize: 5,
    columns: { unit: "Unit", size: "Size", available: "Available", action: "Enquire" },
    enquire: "Enquire",
    sizeLabel: "Size",
    availabilityLabel: "Availability",
    sizeOptions: [
      { id: "lt5", label: "Under 5,000 sqm", min: 0, max: 5000 },
      { id: "5-15", label: "5,000–15,000 sqm", min: 5000, max: 15000 },
      { id: "15-25", label: "15,000–25,000 sqm", min: 15000, max: 25000 },
      { id: "25+", label: "25,000 sqm and over", min: 25000, max: Infinity },
    ],
    anySize: "Any size",
    availabilityOptions: [
      { id: "now", label: "Available now" },
      { id: "2027", label: "In 2027" },
      { id: "2028", label: "In 2028" },
    ],
    anyAvailability: "Any availability",
    empty: "No units match these filters.",
    clear: "Clear filters",
  },
  /**
   * "LocationDeepDive" (1507:52332): the map with an estate pin and four [Feature] pins, and the access rows
   * beside it (390 adds "Labour catchment" and "Get directions", 1507:59203). The drawn map tile shows northern Tokyo and Saitama, which does not include Kawasaki, so the map is
   * a Tokyo Bay tile in the same greyscale style (Kawasaki on the bay at the bottom) and the estate pin sits at the
   * Kawasaki waterfront, the point of the tile nearest Higashi-Ogishima. Landmark pins keep their drawn positions.
   */
  map: {
    src: "/local/property-map-tokyo-bay.png",
    width: 1088,
    height: 635,
    alt: "Map of Tokyo Bay, from Saitama in the north to Tokyo and Kawasaki on the bay",
    /** Pin centre as % of the map */
    pin: { x: 53, y: 92 },
    landmarks: [
      { label: "[Feature]", x: 12, y: 18 },
      { label: "[Feature]", x: 37, y: 22 },
      { label: "[Feature]", x: 25, y: 53 },
      { label: "[Feature]", x: 43, y: 75 },
    ],
    zoom: { min: 1, max: 3, step: 0.5 },
    rows: [
      { title: "Expressway access", value: "[XX min]", body: "[One sentence on the expressway connection, to be supplied by ESR Japan]" },
      { title: "Port access", value: "[XX min]", body: "[One sentence on the port connection]" },
      { title: "Airport access", value: "[XX min]", body: "[One sentence on the airport connection]" },
      { title: "Rail freight", value: "[XX min]", body: "[One sentence on rail freight access]" },
      { title: "Labour catchment", value: "[XX min]", body: "[One sentence on the surrounding labour catchment]", mobileOnly: true },
    ],
    directions: "Get directions",
    // Review feedback: links to the estate's own page, which is not in the prototype (inert)
    estate: { label: "Estate page", href: null },
  },
  /** "ContactAndEnquiry" (1507:52333): contacts beside the form */
  enquiry: {
    title: "Enquire about this property",
    body: "Talk to the ESR Japan leasing team about this facility.",
    contacts: CONTACTS,
    optIn: "Keep me updated on ESR news and property availability",
    submitLabel: "Enquire now",
    success: {
      title: "Thanks, your enquiry is with us",
      body: "A member of the ESR Japan leasing team will be in touch within two business days. We have sent a copy to the email address you gave us.",
      reference: "[XXXXXX]",
      resetLabel: "Send another enquiry",
    } satisfies EnquirySuccessCopy,
  },
  relatedTitle: "Related properties",
  marketsTitle: "Looking in another market?",
  /** "OtherMarkets" (1507:52412). Other local sites are not part of the prototype: inert. */
  markets: ["Australia and New Zealand", "Greater China", "South Korea", "Singapore", "India"].map((label) => ({ label, href: null as string | null })),
  share: {
    share: "Share",
    copy: "Copy link",
    copied: "Link copied",
    email: "Email",
    linkedin: "LinkedIn",
    x: "X",
    line: "LINE",
  },
  sticky: { cta: "Enquire now" },
};

/** Message pre-filled when a unit's "Enquire" is chosen (kept under the 250 character limit) */
export const unitEnquiryMessage = (u: SpaceUnit, size: string, property: string) =>
  `I'd like to find out more about ${u.unit} (${size}, ${u.available}) at ${property}.`;

export type RelatedPropertyCardData = { region: string; title: string; meta: string; href: string };

/** Related property cards (1507:52375): the next four properties */
export function relatedProperties(current: JpProperty): RelatedPropertyCardData[] {
  return JP_PROPERTIES.filter((p) => p.slug !== current.slug)
    .slice(0, 4)
    .map((p) => ({
      region: p.region,
      title: p.name,
      meta: `${p.published?.type ?? "Logistics"}  ·  ${p.published ? p.published.gfa : "[GFA TBC]"}`,
      href: `${PROPERTIES_PAGE}/${p.slug}`,
    }));
}

/** Key facts beside About (1507:52151): the published figures, or TBC placeholders */
export function propertyKeyFacts(p: JpProperty): { label: string; value: string }[] {
  const pub = p.published;
  return [
    { label: "Total size", value: pub?.gfa ?? "[GFA TBC]" },
    { label: "Site area", value: pub?.siteArea ?? "[Site area TBC]" },
    { label: "Type", value: pub?.type ?? "Logistics" },
    { label: "Structure and floors", value: pub ? "In planning" : "[TBC]" },
    { label: "Availability", value: pub ? pub.completion.replace("Completion ", "") : "[Status TBC]" },
  ];
}
