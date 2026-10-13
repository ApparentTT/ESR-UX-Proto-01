/**
 * Local market site navigation (Japan, under /jp), from the Figma section "Local Navigation" (672:25982):
 * Local_homepage 672:25983 (closed header), Local_Our portfolio 672:25986, Local_Investors 672:26224,
 * Local_ESG 672:26471, Local_News 672:26333, Local_About 672:26562, the local market panel 672:26096 and
 * the mobile frames beside them (718:853, 718:936, 719:1061, 719:1328, 719:1454, 719:1563).
 *
 * The frames are drawn for Australia and New Zealand. The Japan versions of the same header (Key wireframes
 * R2_Local_homepage_>10Properties 1347:52640, R2_local_PortfolioOverview-Japan 1347:60557) swap in the
 * market name, so this file does the same ("Australia" and "Aus & NZ" read "Japan"). Per-market figures are
 * placeholders ("XX") and the two Australian fund names are "[Fund name]" until ESR Japan supplies them.
 * Everything else is verbatim (Figma leading and trailing spaces trimmed); where a mobile frame's copy
 * differs from the desktop frame it is kept per breakpoint, as drawn.
 *
 * Links go to the local pages under /jp, to the ESR Japan property search (/properties), or, where the
 * design marks a link as leaving the site (Data centres, open_in_new), to the ESR Group page.
 * href: null renders an inert link ("not part of the prototype" notice).
 */

import type {
  DownloadsBlock,
  LatestBlock,
  LatestCard,
  MegaCell,
  MegaStrip,
  MobileLatestBlock,
  MobileStripBlock,
  NavItem,
  NavLinkItem,
  PeopleBlock,
} from "@/config/nav";

/** A menu page link. external: goes to the ESR Group site (Explore drawn with open_in_new; named so for screen readers). */
export type LocalNavItem = NavItem & { external?: boolean };

export type LocalItemBlock = { type: "item"; item: LocalNavItem; /** Reserve two lines for the description, so Explore links line up */ reserve?: boolean };
/** "Find available property": a search field into the ESR Japan property search, then "View all properties". */
export type PropertySearchBlock = { type: "propertySearch"; heading: string; placeholder: string; link: NavLinkItem };
/** "Explore key funds": heading with "Explore All funds" beside it, over fund cards (the Latest card design). */
export type FundsBlock = { type: "funds"; heading: string; cards: LatestCard[]; link: NavLinkItem };

export type LocalMegaBlock = LocalItemBlock | PropertySearchBlock | FundsBlock | DownloadsBlock | LatestBlock | PeopleBlock;
/** A desktop mega menu cell, as in config/nav.ts (1440 geometry), holding local blocks. */
export type LocalMegaCell = Omit<MegaCell, "blocks"> & { blocks: LocalMegaBlock[] };
export type LocalMegaPanel = { cols: number[]; rows: number[]; cells: LocalMegaCell[]; strip?: MegaStrip };

export type LocalMobileBlock = PropertySearchBlock | FundsBlock | DownloadsBlock | MobileLatestBlock | PeopleBlock | MobileStripBlock;

export type LocalSection = {
  id: string;
  /** Header label */
  label: string;
  /** Width of the label's text box in the 1440 frame: Medium (closed) and Bold (its menu open) */
  labelWidth: [number, number];
  /** Mobile rows in reading order (Figma Local_*_mob) */
  groups: { eyebrow?: string; items: LocalNavItem[] }[];
  panel: LocalMegaPanel;
  /** Mobile: blocks above the rows (Our portfolio's property search) */
  mobileTop?: LocalMobileBlock[];
  /** Mobile: blocks after the rows */
  mobile: LocalMobileBlock[];
};

/* ------------------------------------------------------------------- site */

export const LOCAL_SITE = {
  /** The market name in the utility bar and on the market button */
  market: "Japan",
  /** "Currently viewing:" in the market panel */
  current: "Japan (EN)",
  home: "/jp",
  homeLabel: "ESR Japan home",
};

/** Utility bar, right (desktop): Find properties is the ESR Japan property search. */
export const LOCAL_UTILITY: NavLinkItem[] = [
  { label: "Find properties", href: "/properties" },
  { label: "Tenant portal login", href: null },
  { label: "Find jobs", href: null },
];

/**
 * The way back to the ESR Group site from the market panel. Not drawn (the local panel shows the 11 market
 * cards only); added as a twelfth card in the same design so the group site can be reached from a local site.
 */
export const GROUP_SITE_CARD = { region: "Global", name: "ESR Group", languages: "English", href: "/" };

/** A link to an ESR Group page, named for screen readers. */
export const GROUP_SITE_SUFFIX = "(ESR Group site)";

/** Which section a local path belongs to, for the active header item and the mobile menu's opening view. */
export function localActiveSection(pathname: string): string | null {
  const p = pathname.replace(/\/$/, "");
  if (["/jp/portfolio", "/jp/properties", "/jp/developments", "/jp/property-tours"].some((r) => p === r || p.startsWith(`${r}/`))) return "portfolio";
  if (p === "/jp/news" || p.startsWith("/jp/news/")) return "news";
  if (["/jp/about", "/jp/leadership", "/jp/proven-capability"].some((r) => p === r || p.startsWith(`${r}/`))) return "about";
  return null;
}

/* -------------------------------------------------------------- portfolio */

const PORTFOLIO_PAGE = "/jp/portfolio";
const DATA_CENTRES_GROUP = "/portfolio/data-centres";

const PROPERTY_SEARCH: PropertySearchBlock = {
  type: "propertySearch",
  heading: "Find available property",
  placeholder: "Search by city, suburb or estate",
  link: { label: "View all properties", href: "/properties" },
};
const VACANCIES: NavLinkItem = { label: "Stay up to date on vacancies", href: null };

/** Desktop copy (672:25986) */
const P = {
  properties: { icon: "apartment", title: "Properties", text: "Logistics, industrial, and property management.", href: "/jp/properties" },
  developments: { icon: "handyman", title: "Developments", text: "Pipeline, technology and sustainability.", href: "/jp/developments" },
  dataCentres: { icon: "database", title: "Data centres", text: "Explore our global pipeline", href: DATA_CENTRES_GROUP, external: true },
  overview: { icon: "globe_asia", title: "Our portfolio", text: "Everything we own / manage", href: PORTFOLIO_PAGE },
} satisfies Record<string, LocalNavItem>;

/** Mobile copy (718:853): the rows keep the group menu's wording, as drawn; same destinations as desktop. */
const PM = {
  overview: { icon: "globe_asia", title: "Our global portfolio", text: "Scale and reach across APAC", href: PORTFOLIO_PAGE },
  properties: { ...P.properties, text: "Logistics and industrial" },
  developments: P.developments,
  dataCentres: { ...P.dataCentres, text: "Digital infrastructure capability" },
} satisfies Record<string, LocalNavItem>;

const PORTFOLIO: LocalSection = {
  id: "portfolio",
  label: "Our portfolio",
  labelWidth: [85, 88],
  groups: [{ items: [PM.overview, PM.properties, PM.developments, PM.dataCentres] }],
  panel: {
    // Column lines at 485, 727, 969 and 1203; items 202 wide at 513, 756, 990 and 1225
    cols: [485, 242, 242, 234, 237],
    rows: [258],
    cells: [
      { col: 1, pad: [42, 41, 0, 32], blocks: [PROPERTY_SEARCH] },
      { col: 2, pad: [51, 13, 0, 28], line: "l", blocks: [{ type: "item", item: P.properties, reserve: true }] },
      { col: 3, pad: [51, 13, 0, 29], line: "l", blocks: [{ type: "item", item: P.developments, reserve: true }] },
      { col: 4, pad: [51, 13, 0, 21], line: "l", blocks: [{ type: "item", item: P.dataCentres, reserve: true }] },
      { col: 5, pad: [51, 13, 0, 22], line: "l", blocks: [{ type: "item", item: P.overview, reserve: true }] },
    ],
    strip: { line: true, align: "start", pad: [32, 32], links: [VACANCIES] },
  },
  mobileTop: [PROPERTY_SEARCH],
  mobile: [{ type: "strip", links: [VACANCIES] }],
};

/* -------------------------------------------------------------- investors */

const I = {
  investing: { icon: "attach_money", title: "Investing with ESR", text: "Strategy and approach", href: null },
  track: { icon: "area_chart", title: "Track record", text: "Performance and proof points", href: null },
  governance: { icon: "analytics", title: "Governance and reporting", text: "Disclosures and policies", href: null },
} satisfies Record<string, LocalNavItem>;

/** Strategies as drawn; the drawn names are Australian funds, so they are placeholders on the Japan site. */
const FUNDS: FundsBlock = {
  type: "funds",
  heading: "Explore key funds",
  cards: [
    { title: "[Fund name]", text: "Core Plus Industrial", href: null },
    { title: "[Fund name]", text: "Develop to Core", href: null },
  ],
  link: { label: "Explore All funds", href: null },
};

const INVESTORS: LocalSection = {
  id: "investors",
  label: "Investors",
  labelWidth: [62, 65],
  groups: [{ items: [I.investing, I.track, I.governance] }],
  panel: {
    // Column lines at 260, 550 and 832; items at 30, 302 and 592 (tops as drawn); funds from 885 to 1394
    cols: [260, 290, 282, 608],
    rows: [398],
    cells: [
      { col: 1, pad: [43, 16, 0, 30], blocks: [{ type: "item", item: I.investing }] },
      { col: 2, pad: [42, 16, 0, 42], line: "l", blocks: [{ type: "item", item: I.track }] },
      { col: 3, pad: [37, 16, 0, 42], line: "l", blocks: [{ type: "item", item: I.governance }] },
      { col: 4, pad: [36, 46, 43, 53], line: "l", blocks: [FUNDS] },
    ],
  },
  mobile: [FUNDS],
};

/* --------------------------------------------------------- sustainability */

const S = {
  approach: { icon: "nest_eco_leaf", title: "Our ESG approach", text: "Strategy, targets and progress", href: null },
  // video_template is drawn as an outline only; view_day is that outline (as in the group menu)
  cases: { icon: "view_day", title: "Sustainability case studies", text: "How it works in practice", href: null },
  governance: { icon: "policy", title: "Sustainability governance", text: "Reports, data packs and policies", href: null },
} satisfies Record<string, LocalNavItem>;

const DOWNLOADS: DownloadsBlock = {
  type: "downloads",
  heading: "Latest downloads",
  items: [
    { label: "Sustainability report", href: null },
    { label: "ESG data pack", href: null },
    { label: "Modern slavery statement", href: null },
    { label: "TCFD disclosure", href: null },
  ],
  link: { label: "All reports and policies", href: null },
};

const SUSTAINABILITY: LocalSection = {
  id: "sustainability",
  label: "Sustainability",
  labelWidth: [91, 94],
  groups: [{ items: [S.approach, S.cases, S.governance] }],
  panel: {
    // The group Sustainability menu (Local_ESG 672:26471 draws the same panel)
    cols: [295, 295, 295, 555],
    rows: [291],
    cells: [
      { col: 1, pad: [58, 16, 0, 30], blocks: [{ type: "item", item: S.approach, reserve: true }] },
      { col: 2, pad: [57, 16, 0, 38], line: "l", blocks: [{ type: "item", item: S.cases, reserve: true }] },
      { col: 3, pad: [57, 16, 0, 38], line: "l", blocks: [{ type: "item", item: S.governance, reserve: true }] },
      { col: 4, pad: [57, 24, 0, 31], surface: true, blocks: [DOWNLOADS] },
    ],
  },
  mobile: [DOWNLOADS],
};

/* ------------------------------------------------------------------- news */

const NEWS_PAGE = "/jp/news";
const N = {
  all: { icon: "book_5", title: "All stories", text: "Everything in one feed", href: NEWS_PAGE },
  thought: { icon: "news", title: "Thought leadership", text: "Group and market updates", href: `${NEWS_PAGE}?type=thought-leadership` },
  press: { icon: "brand_awareness", title: "Press releases", text: "Official announcements", href: `${NEWS_PAGE}?type=press-release` },
  cases: { icon: "area_chart", title: "Case studies", text: "Capability in practice", href: `${NEWS_PAGE}?type=case-study` },
} satisfies Record<string, LocalNavItem>;

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
const LATEST: LatestBlock = {
  type: "latest",
  heading: "Latest",
  cards: [
    { title: "Press release · Japan", text: LOREM, href: null },
    { title: "Case study · Japan", text: LOREM, href: null },
    { title: "News · Japan", text: LOREM, href: null },
  ],
};
const MEDIA_LINKS: NavLinkItem[] = [
  { label: "Media enquiries", href: null },
  { label: "Media kit", href: null },
];

const NEWS: LocalSection = {
  id: "news",
  label: "News and insights",
  labelWidth: [123, 126],
  groups: [{ items: [N.all, N.thought, N.press, N.cases] }],
  panel: {
    cols: [295, 295, 850],
    rows: [199, 218],
    cells: [
      { col: 1, row: 1, pad: [38, 16, 0, 30], line: "b", blocks: [{ type: "item", item: N.all }] },
      { col: 2, row: 1, pad: [37, 16, 0, 38], line: "lb", blocks: [{ type: "item", item: N.thought }] },
      { col: 1, row: 2, pad: [52, 16, 0, 30], blocks: [{ type: "item", item: N.press }] },
      { col: 2, row: 2, pad: [51, 16, 0, 38], line: "l", blocks: [{ type: "item", item: N.cases }] },
      // Cards from 630 at 236 each (gap 20); the "Latest" heading sits 2px further in, as in the group menu
      { col: 3, row: 1, rowSpan: 2, pad: [37, 62, 24, 40], line: "l", blocks: [LATEST] },
    ],
    strip: { line: true, align: "start", pad: [30, 30], gap: 70, links: MEDIA_LINKS },
  },
  // Local_News_mob 719:1328: the third card reads "News · Group", as drawn
  mobile: [{ ...LATEST, cards: [LATEST.cards[0], LATEST.cards[1], { title: "News · Group", text: LOREM, href: null }], links: MEDIA_LINKS }],
};

/* ------------------------------------------------------------------ about */

const A = {
  about: { title: "About us", text: "Who we are and how we got here", href: "/jp/about" },
  leadership: { title: "Our leadership", text: "The people running the team", href: "/jp/leadership" },
  capability: { title: "Proven capability", text: "Case studies across the group", href: "/jp/proven-capability" },
  customers: { title: "Our customers", text: "The industries we serve", href: null },
  governance: { title: "Corporate governance", text: "Reports, policies and disclosures", href: null },
} satisfies Record<string, LocalNavItem>;
/** Mobile (719:1454) keeps the group wording for Our leadership */
const LEADERSHIP_MOBILE: LocalNavItem = { ...A.leadership, text: "The people running the group" };

const PEOPLE_TEXT = "The culture and values behind the group, and where we're hiring.";
const PEOPLE_COUNT = { value: "XX+", label: "people across Japan" };
const PEOPLE: PeopleBlock = {
  type: "people",
  heading: { label: "Our people", href: null },
  text: PEOPLE_TEXT,
  stats: [PEOPLE_COUNT, { value: "XX", label: "Offices" }],
  link: { label: "Find jobs at ESR", href: null },
};
const PEOPLE_MOBILE: PeopleBlock = { ...PEOPLE, stats: [PEOPLE_COUNT, { value: "XX", label: "markets" }] };

const ABOUT: LocalSection = {
  id: "about",
  label: "About",
  labelWidth: [41, 43],
  groups: [
    { eyebrow: "The company", items: [A.about, LEADERSHIP_MOBILE] },
    { eyebrow: "Our capability", items: [A.capability, A.customers] },
    { eyebrow: "Governance", items: [A.governance] },
  ],
  panel: {
    // Column lines at 295, 590 and 902; eyebrows 35 down, Our people at 945
    cols: [295, 295, 312, 538],
    rows: [417],
    cells: [
      {
        col: 1,
        pad: [35, 16, 24, 30],
        eyebrow: "The company",
        gap: 75,
        blocks: [
          { type: "item", item: A.about, reserve: true },
          { type: "item", item: A.leadership, reserve: true },
        ],
      },
      {
        col: 2,
        pad: [35, 16, 24, 43],
        line: "l",
        eyebrow: "Our capability",
        gap: 75,
        blocks: [
          { type: "item", item: A.capability, reserve: true },
          { type: "item", item: A.customers, reserve: true },
        ],
      },
      { col: 3, pad: [35, 16, 24, 55], line: "l", eyebrow: "Governance", blocks: [{ type: "item", item: A.governance, reserve: true }] },
      { col: 4, pad: [35, 32, 24, 43], line: "l", blocks: [PEOPLE] },
    ],
    strip: { line: false, align: "end", pad: [30, 32], links: [{ label: "Contact us", href: "/contact" }] },
  },
  // The mobile frame's strip keeps the group link (Corporate governance), as drawn
  mobile: [PEOPLE_MOBILE, { type: "strip", links: [{ label: "Corporate governance", href: null }] }],
};

export const LOCAL_SECTIONS: LocalSection[] = [PORTFOLIO, INVESTORS, SUSTAINABILITY, NEWS, ABOUT];

/* ----------------------------------------------------------------- footer */

export type LocalFooterGroup = { title: string; links: (NavLinkItem & { external?: boolean })[] };

/**
 * Local footer ("Local footer / Full listing", Components 192:9837; mobile Local-Footer / mob 311:6622).
 * The same listing as the group footer, linked to the local pages where they exist.
 */
export const LOCAL_FOOTER: Record<"portfolio" | "investors" | "sustainability" | "news" | "about", LocalFooterGroup> = {
  portfolio: {
    title: "Our portfolio",
    links: [
      { label: "Our global portfolio", href: PORTFOLIO_PAGE },
      { label: "Properties", href: "/jp/properties" },
      { label: "Developments", href: "/jp/developments" },
      { label: "Data centres", href: DATA_CENTRES_GROUP, external: true },
      { label: "Infrastructure", href: null },
    ],
  },
  investors: {
    title: "Investors",
    links: [
      { label: "Investing with ESR", href: null },
      { label: "Funds", href: null },
    ],
  },
  sustainability: {
    title: "Sustainability",
    links: [
      { label: "Overview", href: null },
      { label: "Sustainability case studies", href: null },
      { label: "Sustainability governance", href: null },
    ],
  },
  news: {
    title: "News and insights",
    links: [
      { label: "All stories", href: NEWS_PAGE },
      { label: "Thought leadership", href: N.thought.href },
      { label: "Press releases", href: N.press.href },
      { label: "Case studies", href: N.cases.href },
    ],
  },
  about: {
    title: "About",
    links: [
      { label: "About us", href: "/jp/about" },
      { label: "Our leadership", href: "/jp/leadership" },
      { label: "Our customers", href: null },
      { label: "Proven capability", href: "/jp/proven-capability" },
      // "Ressources" in Figma; spelt as in the group footer
      { label: "Resources", href: null },
      { label: "Corporate governance", href: null },
      { label: "Our people", href: null },
    ],
  },
};

export const LOCAL_FOOTER_COPY = {
  connect: "Connect with us",
  copyright: "© 2026 ESR. All Rights Reserved.",
  legal: ["Terms & Conditions", "Privacy", "Cookies Policy"],
};
