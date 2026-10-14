/**
 * Global navigation content, from the Figma section "Global Navigation" (672:25100).
 * Copy is verbatim from the design (Figma leading and trailing spaces trimmed).
 * href: null renders an inert link ("not part of the prototype" notice).
 *
 * Each section has:
 * - groups: its page links in reading order (the mobile rows, and the desktop item blocks)
 * - panel: the desktop mega menu, as a grid of cells laid out at the 1440 frame (column widths are
 *   fractions, paddings and row heights are px) that MegaMenu renders
 * - mobile: what follows the rows in the mobile menu
 */

export type NavItem = { icon?: string; title: string; text: string; href: string | null };
export type NavLinkItem = { label: string; href: string | null };
export type NavStat = { value: string; label: string; /** Value size in px where one stat is drawn at its own size */ size?: number };
/** A language name; lang is set for non-English scripts so screen readers pronounce them. */
export type LangPart = { text: string; lang?: string };
export type NavRegion = "Asia" | "Oceania" | "Middle East";
export type NavMarket = { region: NavRegion; name: string; languages: LangPart[]; /** Mobile frame copy where it differs */ mobileLanguages?: LangPart[] };

export type ItemBlock = { type: "item"; item: NavItem; /** Reserve two lines for the description, so Explore links line up */ reserve?: boolean };
export type RegionsBlock = { type: "regions"; heading: string; regions: { name: NavRegion; span?: number }[]; link: NavLinkItem };
export type GlanceBlock = {
  type: "glance";
  variant: "map" | "card";
  heading: string;
  stats: NavStat[];
  /** Map variant: the stats shown while one market is chosen in "Browse properties by region" (heading becomes "{heading}: {market}") */
  marketStats?: NavStat[];
};
export type MarketListBlock = { type: "markets"; heading: string; columns: NavRegion[][]; /** Column widths in px */ widths: number[] };
export type DownloadsBlock = { type: "downloads"; heading: string; items: NavLinkItem[]; link: NavLinkItem };
export type LatestCard = { title: string; text: string; href: string | null };
export type LatestBlock = { type: "latest"; heading: string; cards: LatestCard[] };
export type PeopleBlock = { type: "people"; heading: NavLinkItem; text: string; stats: NavStat[]; link: NavLinkItem };
export type MegaBlock = ItemBlock | RegionsBlock | GlanceBlock | MarketListBlock | DownloadsBlock | LatestBlock | PeopleBlock;

export type MegaCell = {
  /** 1-based grid column and row, with spans */
  col: number;
  span?: number;
  row?: number;
  rowSpan?: number;
  /** Padding in px at 1440: top, right, bottom, left */
  pad: [number, number, number, number];
  /** Divider lines on the cell's left edge (the column divider, drawn on the column to its right as in Figma) and/or bottom edge */
  line?: "l" | "b" | "lb";
  surface?: boolean;
  eyebrow?: string;
  /** Blocks side by side (row) or stacked (column, default), with a gap (px, or a CSS length) */
  flow?: "row" | "column";
  gap?: number | string;
  blocks: MegaBlock[];
};

export type MegaStrip = { line: boolean; align: "start" | "end"; pad: [number, number]; gap?: number; links: NavLinkItem[] };

export type MegaPanel = {
  /** Column widths at 1440 (used as fr, so the grid scales down to the 1180 breakpoint) */
  cols: number[];
  /** Minimum row heights in px */
  rows: number[];
  cells: MegaCell[];
  strip?: MegaStrip;
  /** 1px line under the panel */
  bottomLine?: boolean;
};

export type ChipsBlock = {
  type: "chips";
  heading: string;
  selected: string;
  stats: NavStat[];
  statCols: 2 | 3;
  /** With the map (Our portfolio): the chips are buttons that zoom the map to a market and show marketStats; the first chip returns to all markets */
  map?: boolean;
  marketStats?: NavStat[];
};
export type MobileStripBlock = { type: "strip"; links: NavLinkItem[] };
export type MobileLatestBlock = LatestBlock & { links: NavLinkItem[] };
export type MobileBlock = ChipsBlock | DownloadsBlock | MobileLatestBlock | PeopleBlock | MobileStripBlock;

export type NavSection = {
  id: string;
  /** Header label; matches activeGroup() in config/site.ts */
  label: string;
  /** Width of the header label's text box in the 1440 frame: Medium (closed) and Bold (its menu open) */
  labelWidth: [number, number];
  groups: { eyebrow?: string; items: NavItem[] }[];
  panel: MegaPanel;
  mobile: MobileBlock[];
};

/* ---------------------------------------------------------------- markets */

const EN: LangPart = { text: "English" };

/** Find your market (desktop 672:25832, mobile 715:30298), in design order. */
export const NAV_MARKETS: NavMarket[] = [
  { region: "Asia", name: "Greater China", languages: [{ text: "简体中文", lang: "zh-Hans" }, EN] },
  { region: "Asia", name: "India", languages: [EN] },
  // Korean as drawn on both breakpoints (likely a copy slip in the design; flagged to the client)
  { region: "Asia", name: "Indonesia", languages: [{ text: "한국어", lang: "ko" }, EN] },
  { region: "Asia", name: "Japan", languages: [{ text: "日本語", lang: "ja" }, EN] },
  { region: "Asia", name: "Malaysia", languages: [EN] },
  { region: "Asia", name: "Singapore", languages: [EN] },
  { region: "Asia", name: "South Korea", languages: [{ text: "한국어", lang: "ko" }, EN] },
  { region: "Asia", name: "Thailand", languages: [EN] },
  { region: "Asia", name: "Vietnam", languages: [EN] },
  { region: "Oceania", name: "Australia & New Zealand", languages: [EN] },
  { region: "Middle East", name: "Saudi Arabia", languages: [{ text: "Arabic" }, EN], mobileLanguages: [EN] },
];

export const marketsIn = (region: NavRegion) => NAV_MARKETS.filter((m) => m.region === region).map((m) => m.name);

/** Every market in Find your market goes to the Japan local site, the one local site in the prototype. */
export const MARKET_SITE_HREF = "/jp";

export const MARKET_PANEL = {
  title: "Choose your market",
  body: "You'll be taken to that market's website.",
  currentLabel: "Currently viewing:",
  current: "Group (EN)",
};

/* ----------------------------------------------------------------- shared */

export const NAV_COPY = {
  findMarket: "Find your market",
  contact: "Contact us",
  explore: "Explore",
  searchPlaceholder: "Search ESR.com by market, region, property",
  searchPlaceholderMobile: "Search by market, region, property",
};

/**
 * Header search results (672:25754 / 705:29172): "4 Results" over rows of page title and URL, as drawn.
 * Rows are the top matches from the site search index (data/site/searchIndex.ts); the count is every match.
 * "See all results" and the no-match line are not drawn: the no-match line is the News search heading (1064:46008).
 */
export const SEARCH_COPY = {
  count: "{n} Results",
  countSingular: "{n} Result",
  noResults: "No results for “{q}”",
  seeAll: "See all results",
  /** Rows shown under the field (four, as drawn) */
  rows: 4,
  /** URL prefix on the result rows, as drawn */
  site: "https://www.esr.com",
  /** The results page */
  path: "/search",
};

const GLANCE = "ESR at a glance";
const AUM: NavStat = { value: "US$77.3bn", label: "Total AUM" };
/** Figma draws the Portfolio AUM value at 21px, the other two at 22 */
const PORTFOLIO_STATS: NavStat[] = [{ ...AUM, size: 21 }, { value: "11", label: "APAC markets" }, { value: "50Mil m²", label: "gross floor area" }];
const INVESTOR_STATS: NavStat[] = [AUM, { value: "US$1.9B", label: "Capital Raised" }, { value: "1900+", label: "Employees" }, { value: "140", label: "funds and mandates" }];
/**
 * "ESR at a glance" for one market (Our portfolio, desktop and mobile): the drawn labels with placeholder
 * values until ESR supplies each market's figures.
 */
const MARKET_GLANCE_STATS: NavStat[] = [
  { value: "US$XXbn", label: "Total AUM", size: 21 },
  { value: "XX", label: "APAC markets" },
  { value: "XXMil m²", label: "gross floor area" },
];
/** Choosing a market again, or this control, returns the Our portfolio map to all markets. */
export const ALL_MARKETS = "All markets";
/** Mobile market chips: the first is the current scope ("ERS Group" as drawn, flagged to the client). */
const CHIP_SELECTED = "ERS Group";

/* -------------------------------------------------------------- portfolio */

const P = {
  group: { icon: "globe_asia", title: "Our group portfolio", text: "Scale and reach across APAC", href: "/portfolio" },
  properties: { icon: "apartment", title: "Properties", text: "Logistics and industrial", href: "/portfolio/properties" },
  developments: { icon: "handyman", title: "Developments", text: "Pipeline, technology and sustainability.", href: "/portfolio/developments" },
  dataCentres: { icon: "database", title: "Data centres", text: "Digital infrastructure capability", href: "/portfolio/data-centres" },
  infrastructure: { icon: "cell_tower", title: "Infrastructure", text: "Lorem ipsum dolor sit amet, consectetur", href: null },
} satisfies Record<string, NavItem>;

const PORTFOLIO: NavSection = {
  id: "portfolio",
  label: "Our portfolio",
  labelWidth: [85, 88],
  groups: [{ items: [P.group, P.properties, P.developments, P.dataCentres, P.infrastructure] }],
  panel: {
    cols: [295, 295, 305, 284, 261],
    rows: [200, 337],
    cells: [
      // Card 1's description is padded to two lines in Figma; Properties' is one line, so its Explore sits higher (as drawn)
      { col: 1, pad: [33, 16, 0, 30], line: "b", blocks: [{ type: "item", item: P.group, reserve: true }] },
      { col: 2, pad: [33, 16, 0, 39], line: "lb", blocks: [{ type: "item", item: P.properties }] },
      { col: 3, pad: [33, 16, 0, 63], line: "lb", blocks: [{ type: "item", item: P.developments }] },
      { col: 4, pad: [33, 16, 0, 62], line: "lb", blocks: [{ type: "item", item: P.dataCentres }] },
      { col: 5, pad: [33, 16, 0, 39], line: "lb", blocks: [{ type: "item", item: P.infrastructure }] },
      {
        col: 1,
        span: 5,
        row: 2,
        pad: [25, 34, 19, 30],
        flow: "row",
        gap: 10,
        blocks: [
          {
            type: "regions",
            heading: "Browse properties by region",
            regions: [{ name: "Asia", span: 2 }, { name: "Oceania" }, { name: "Middle East" }],
            link: { label: "Stay up to date on vacancies", href: null },
          },
          { type: "glance", variant: "map", heading: GLANCE, stats: PORTFOLIO_STATS, marketStats: MARKET_GLANCE_STATS },
        ],
      },
    ],
  },
  mobile: [{ type: "chips", heading: "Browse properties by region", selected: CHIP_SELECTED, stats: PORTFOLIO_STATS, statCols: 3, map: true, marketStats: MARKET_GLANCE_STATS }],
};

/* --------------------------------------------------------------- investor */

const I = {
  investing: { icon: "attach_money", title: "Investing with ESR", text: "Strategy and approach", href: "/investors" },
  track: { icon: "area_chart", title: "Track record", text: "Performance and proof points", href: "/investors#track-record" },
  funds: { icon: "batch_prediction", title: "Our funds", text: "Every asset across the group", href: "/investors#our-funds" },
  governance: { icon: "analytics", title: "Governance and reporting", text: "Disclosures and policies", href: null },
} satisfies Record<string, NavItem>;

const INVESTOR: NavSection = {
  id: "investor",
  label: "Investor",
  labelWidth: [55, 57],
  groups: [{ items: [I.investing, I.track, I.funds, I.governance] }],
  panel: {
    cols: [295, 295, 850],
    rows: [215, 241],
    bottomLine: true,
    cells: [
      { col: 1, row: 1, pad: [37, 16, 0, 30], line: "b", blocks: [{ type: "item", item: I.investing }] },
      { col: 2, row: 1, pad: [37, 16, 0, 38], line: "lb", blocks: [{ type: "item", item: I.track }] },
      { col: 1, row: 2, pad: [53, 16, 0, 30], blocks: [{ type: "item", item: I.funds }] },
      { col: 2, row: 2, pad: [53, 16, 0, 38], line: "l", blocks: [{ type: "item", item: I.governance }] },
      {
        col: 3,
        row: 1,
        rowSpan: 2,
        pad: [37, 32, 0, 42],
        line: "l",
        flow: "row",
        // 56 at 1440, closing to 24 at 1180 so the glance card keeps its width
        gap: "clamp(24px, 12.31vw - 121.2px, 56px)",
        blocks: [
          { type: "markets", heading: "Invest by Market", columns: [["Asia"], ["Oceania", "Middle East"]], widths: [155, 100] },
          { type: "glance", variant: "card", heading: GLANCE, stats: INVESTOR_STATS },
        ],
      },
    ],
  },
  mobile: [{ type: "chips", heading: "Invest by Market", selected: CHIP_SELECTED, stats: INVESTOR_STATS, statCols: 2 }],
};

/* --------------------------------------------------------- sustainability */

const S = {
  approach: { icon: "nest_eco_leaf", title: "Our ESG approach", text: "Strategy, targets and progress", href: "/sustainability" },
  // Figma draws video_template as an outline only; view_day is that outline (video_template adds a play mark)
  cases: { icon: "view_day", title: "Sustainability case studies", text: "How it works in practice", href: "/sustainability/case-studies" },
  governance: { icon: "policy", title: "Sustainability governance", text: "Reports, data packs and policies", href: "/sustainability/governance" },
} satisfies Record<string, NavItem>;

/** Mobile lists these in this order; the desktop 2 x 2 grid fills column by column. */
const DOWNLOADS: DownloadsBlock = {
  type: "downloads",
  heading: "Latest downloads",
  items: [
    { label: "Sustainability report", href: null },
    { label: "ESG data pack", href: null },
    { label: "Modern slavery statement", href: null },
    { label: "TCFD disclosure", href: null },
  ],
  link: { label: "All reports and policies", href: "/sustainability/governance" },
};

const SUSTAINABILITY: NavSection = {
  id: "sustainability",
  label: "Sustainability",
  labelWidth: [91, 94],
  groups: [{ items: [S.approach, S.cases, S.governance] }],
  panel: {
    cols: [295, 295, 295, 555],
    rows: [288],
    cells: [
      { col: 1, pad: [55, 16, 0, 30], blocks: [{ type: "item", item: S.approach, reserve: true }] },
      { col: 2, pad: [55, 16, 0, 38], line: "l", blocks: [{ type: "item", item: S.cases, reserve: true }] },
      { col: 3, pad: [55, 16, 0, 38], line: "l", blocks: [{ type: "item", item: S.governance, reserve: true }] },
      { col: 4, pad: [54, 24, 0, 31], surface: true, blocks: [DOWNLOADS] },
    ],
  },
  mobile: [DOWNLOADS],
};

/* ------------------------------------------------------------------- news */

const N = {
  all: { icon: "book_5", title: "All stories", text: "Everything in one feed", href: "/news" },
  thought: { icon: "news", title: "Thought leadership", text: "Group and market updates", href: "/news/search?type=thought-leadership" },
  press: { icon: "brand_awareness", title: "Press releases", text: "Official announcements", href: "/news/search?type=press-release" },
  cases: { icon: "area_chart", title: "Case studies", text: "Capability in practice", href: "/news/search?type=case-study" },
} satisfies Record<string, NavItem>;

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
const LATEST: LatestBlock = {
  type: "latest",
  heading: "Latest",
  cards: [
    { title: "Press release · Japan", text: LOREM, href: null },
    { title: "Case study · Australia", text: LOREM, href: null },
    { title: "News · Group", text: LOREM, href: null },
  ],
};
const MEDIA_LINKS: NavLinkItem[] = [
  { label: "Media enquiries", href: "/news#media-enquiries" },
  { label: "Media kit", href: null },
];

const NEWS: NavSection = {
  id: "news",
  label: "News and insights",
  labelWidth: [123, 126],
  groups: [{ items: [N.all, N.thought, N.press, N.cases] }],
  panel: {
    cols: [295, 295, 850],
    rows: [196, 217],
    cells: [
      { col: 1, row: 1, pad: [35, 16, 0, 30], line: "b", blocks: [{ type: "item", item: N.all }] },
      { col: 2, row: 1, pad: [35, 16, 0, 38], line: "lb", blocks: [{ type: "item", item: N.thought }] },
      { col: 1, row: 2, pad: [52, 16, 0, 30], blocks: [{ type: "item", item: N.press }] },
      { col: 2, row: 2, pad: [52, 16, 0, 38], line: "l", blocks: [{ type: "item", item: N.cases }] },
      // Cards run 630 to 1378 at 236 each; the "Latest" heading sits 2px further in (632)
      { col: 3, row: 1, rowSpan: 2, pad: [34, 62, 24, 40], line: "l", blocks: [LATEST] },
    ],
    strip: { line: true, align: "start", pad: [30, 30], gap: 70, links: MEDIA_LINKS },
  },
  mobile: [{ ...LATEST, links: MEDIA_LINKS }],
};

/* ------------------------------------------------------------------ about */

const A = {
  about: { title: "About us", text: "Who we are and how we got here", href: "/about" },
  leadership: { title: "Our leadership", text: "The people running the group", href: "/about/leadership" },
  capability: { title: "Proven capability", text: "Case studies across the group", href: "/about/proven-capability" },
  customers: { title: "Our customers", text: "The industries we serve", href: null },
  governance: { title: "Corporate governance", text: "Reports, policies and disclosures", href: "/about/corporate-governance" },
} satisfies Record<string, NavItem>;

/** "Our people" has no link drawn; the heading links to the built page, styled as drawn. */
const PEOPLE: PeopleBlock = {
  type: "people",
  heading: { label: "Our people", href: "/about/our-people" },
  text: "The culture and values behind the group, and where we're hiring.",
  stats: [
    { value: "1900+", label: "people across APAC" },
    { value: "11", label: "markets" },
  ],
  link: { label: "Find jobs at ESR", href: null },
};
const ABOUT_STRIP_LINKS: NavLinkItem[] = [{ label: "Corporate governance", href: "/about/corporate-governance" }];

const ABOUT: NavSection = {
  id: "about",
  label: "About",
  labelWidth: [41, 43],
  groups: [
    { eyebrow: "The company", items: [A.about, A.leadership] },
    { eyebrow: "Our capability", items: [A.capability, A.customers] },
    { eyebrow: "Governance", items: [A.governance] },
  ],
  panel: {
    cols: [295, 295, 312, 538],
    rows: [414],
    cells: [
      {
        col: 1,
        pad: [32, 16, 24, 30],
        eyebrow: "The company",
        gap: 74,
        blocks: [
          { type: "item", item: A.about, reserve: true },
          { type: "item", item: A.leadership, reserve: true },
        ],
      },
      {
        col: 2,
        pad: [32, 16, 24, 43],
        line: "l",
        eyebrow: "Our capability",
        gap: 74,
        blocks: [
          { type: "item", item: A.capability, reserve: true },
          { type: "item", item: A.customers, reserve: true },
        ],
      },
      { col: 3, pad: [32, 16, 24, 55], line: "l", eyebrow: "Governance", blocks: [{ type: "item", item: A.governance, reserve: true }] },
      { col: 4, pad: [32, 32, 24, 43], line: "l", blocks: [PEOPLE] },
    ],
    strip: { line: false, align: "end", pad: [30, 62], links: ABOUT_STRIP_LINKS },
  },
  mobile: [PEOPLE, { type: "strip", links: ABOUT_STRIP_LINKS }],
};

export const NAV_SECTIONS: NavSection[] = [PORTFOLIO, INVESTOR, SUSTAINABILITY, NEWS, ABOUT];
