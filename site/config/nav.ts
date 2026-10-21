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

export type NavItem = {
  icon?: string;
  title: string;
  text: string;
  href: string | null;
  /** The call to action, where it is not "Explore" */
  cta?: string;
  /** Goes to a separate website (Adjacent infrastructure): open_in_new instead of the arrow, named "(opens external site)" for screen readers */
  offsite?: boolean;
};
export type NavLinkItem = { label: string; href: string | null; /** Local menus: goes to the ESR Group site (open_in_new, named for screen readers) */ external?: boolean };
export type NavStat = { value: string; label: string; /** Value size in px where one stat is drawn at its own size */ size?: number };
/** A language name; lang is set for non-English scripts so screen readers pronounce them. hrefLang (defaults to lang, then "en") is the linked site's language. */
export type LangPart = { text: string; lang?: string; dir?: "rtl"; hrefLang?: string };
export type NavRegion = "Asia" | "Oceania" | "Middle East";
/** A market and its site's language versions, local language first (each version is its own link in Find your market). */
export type NavMarket = { region: NavRegion; name: string; languages: LangPart[] };

export type ItemBlock = {
  type: "item";
  item: NavItem;
  /** Reserve two lines for the description, so Explore links line up */
  reserve?: boolean;
  /** Take the cell's width instead of the drawn 202 (a title that would otherwise wrap) */
  wide?: boolean;
  /** Icon beside the text instead of above it (Investment management's stacked rows) */
  layout?: "row";
};
export type RegionsBlock = { type: "regions"; heading: string; regions: { name: NavRegion; span?: number }[]; link: NavLinkItem };
export type GlanceBlock = {
  type: "glance";
  variant: "map" | "card";
  heading: string;
  stats: NavStat[];
  /** Map variant: the stats shown while one market is chosen in "Browse properties by region" (heading becomes "{heading}: {market}") */
  marketStats?: NavStat[];
  /** Card variant (Investment management): each market's own stats, shown while that market is hovered or focused in "Invest by Market" */
  byMarket?: Record<string, NavStat[]>;
};
export type MarketListBlock = { type: "markets"; heading: string; columns: NavRegion[][]; /** Column widths in px */ widths: number[] };
/** "Case study · Australia" card: 16:9 image, eyebrow, title and a "Read the case study" line; the whole card is one link. */
export type CaseStudyCard = { eyebrow: string; title: string; cta: string; href: string | null };
/** "Featured case studies" (Sustainability): two small cards side by side, with "View all case studies". */
export type CaseStudiesBlock = { type: "caseStudies"; heading: string; cards: CaseStudyCard[]; link: NavLinkItem };
export type LatestCard = { title: string; text: string; href: string | null };
export type LatestBlock = { type: "latest"; heading: string; cards: LatestCard[] };
export type PeopleBlock = { type: "people"; heading: NavLinkItem; text: string; stats: NavStat[]; link: NavLinkItem };
export type MegaBlock = ItemBlock | RegionsBlock | GlanceBlock | MarketListBlock | CaseStudiesBlock | LatestBlock | PeopleBlock;

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
  /**
   * A group label over the cells below it (Our portfolio's "Industrial and logistics" over Properties and
   * Developments): the cell holds the label only, and its bottom line is the rule under it
   */
  label?: string;
  /** Blocks centred in the cell's height (Investment management's item rows) */
  center?: boolean;
  /** Blocks side by side (row) or stacked (column, default), with a gap (px, or a CSS length) */
  flow?: "row" | "column";
  gap?: number | string;
  blocks: MegaBlock[];
};

export type MegaStrip = { line: boolean; align: "start" | "end"; pad: [number, number]; gap?: number; links: NavLinkItem[] };

export type MegaPanel = {
  /** Column widths at 1440 (used as fr, so the grid scales down to the 1180 breakpoint); [fr, min px] keeps a column from narrowing below min px */
  cols: (number | [number, number])[];
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
  /** Without the map (Investment management): the chips are buttons that switch the stats to that market's own figures */
  byMarket?: Record<string, NavStat[]>;
};
export type MobileStripBlock = { type: "strip"; links: NavLinkItem[] };
export type MobileLatestBlock = LatestBlock & { links: NavLinkItem[] };
export type MobileBlock = ChipsBlock | CaseStudiesBlock | MobileLatestBlock | PeopleBlock | MobileStripBlock;

export type NavGroup = { eyebrow?: string; nested?: boolean; items: NavItem[] };

export type NavSection = {
  id: string;
  /** Header label; matches activeGroup() in config/site.ts */
  label: string;
  /** Width of the header label's text box in the 1440 frame: Medium (closed) and Bold (its menu open) */
  labelWidth: [number, number];
  /** nested: rows of a group within the section (Industrial and logistics), indented under their label; else eyebrow groups as on About */
  groups: NavGroup[];
  panel: MegaPanel;
  mobile: MobileBlock[];
};

/* ---------------------------------------------------------------- markets */

const EN: LangPart = { text: "English" };

/**
 * Find your market (desktop 672:25832, mobile 715:30298), in design order. Language versions from the
 * presentation feedback: Greater China, Japan, South Korea and Saudi Arabia have a local-language site
 * beside English; the others are English only (Indonesia's drawn "한국어" was a copy slip).
 */
export const NAV_MARKETS: NavMarket[] = [
  { region: "Asia", name: "Greater China", languages: [{ text: "简体中文", lang: "zh-Hans" }, EN] },
  { region: "Asia", name: "India", languages: [EN] },
  { region: "Asia", name: "Indonesia", languages: [EN] },
  { region: "Asia", name: "Japan", languages: [{ text: "日本語", lang: "ja" }, EN] },
  { region: "Asia", name: "Malaysia", languages: [EN] },
  { region: "Asia", name: "Singapore", languages: [EN] },
  { region: "Asia", name: "South Korea", languages: [{ text: "한국어", lang: "ko" }, EN] },
  { region: "Asia", name: "Thailand", languages: [EN] },
  { region: "Asia", name: "Vietnam", languages: [EN] },
  { region: "Oceania", name: "Australia & New Zealand", languages: [EN] },
  { region: "Middle East", name: "Saudi Arabia", languages: [{ text: "العربية", lang: "ar", dir: "rtl" }, EN] },
];

export const marketsIn = (region: NavRegion) => NAV_MARKETS.filter((m) => m.region === region).map((m) => m.name);

/** "Stay up to date on vacancies" (group and local Our portfolio menus): the job alerts sign-up. */
export const JOB_ALERTS_HREF = "/about/careers/job-alerts";

/** Every market in Find your market goes to the Japan local site, the one local site in the prototype. */
export const MARKET_SITE_HREF = "/jp";

/**
 * Where a market's language link goes: its English site goes where the market went before (MARKET_SITE_HREF);
 * the other language versions are not part of the prototype (inert).
 */
export const marketLanguageHref = (part: LangPart): string | null => (part.lang ? null : MARKET_SITE_HREF);

/**
 * The group site's language switcher (header, next to Find your market; mobile: a row in the menu's pinned
 * bar). English is the site being viewed; the other three group languages are not part of the prototype.
 * Client feedback round 2: exactly these four, in this order, named in English only (the design does not pair native names).
 */
export type GroupLanguage = LangPart & { code: string; hrefLang: string; current?: boolean };
export const GROUP_LANGUAGES: GroupLanguage[] = [
  { code: "EN", text: "English", hrefLang: "en", current: true },
  { code: "JA", text: "Japanese", hrefLang: "ja" },
  { code: "KO", text: "Korean", hrefLang: "ko" },
  { code: "ZH", text: "Chinese", hrefLang: "zh-Hans" },
];
export const LANGUAGE_COPY = { label: "Language", icon: "language" };

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
  /** Screen-reader suffix on a link to a separate website (Adjacent infrastructure) */
  offsite: "(opens external site)",
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
/**
 * Investment management "ESR at a glance" per market (hover a market in "Invest by Market"; tap a chip on mobile).
 * Indicative figures for the prototype, to be replaced with ESR's own.
 */
const investorStats = (aum: string, raised: string, people: string, funds: string): NavStat[] => [
  { value: aum, label: "Total AUM" },
  { value: raised, label: "Capital Raised" },
  { value: people, label: "Employees" },
  { value: funds, label: "funds and mandates" },
];
const INVESTOR_MARKET_STATS: Record<string, NavStat[]> = {
  "Greater China": investorStats("US$14.2bn", "US$410M", "420+", "28"),
  India: investorStats("US$3.1bn", "US$95M", "110+", "6"),
  Indonesia: investorStats("US$0.9bn", "US$30M", "40+", "3"),
  Japan: investorStats("US$21.6bn", "US$520M", "380+", "34"),
  Malaysia: investorStats("US$1.2bn", "US$35M", "45+", "4"),
  Singapore: investorStats("US$6.8bn", "US$180M", "160+", "12"),
  "South Korea": investorStats("US$11.4bn", "US$300M", "210+", "22"),
  Thailand: investorStats("US$0.8bn", "US$25M", "35+", "3"),
  Vietnam: investorStats("US$0.6bn", "US$20M", "30+", "2"),
  "Australia & New Zealand": investorStats("US$15.9bn", "US$270M", "430+", "24"),
  "Saudi Arabia": investorStats("US$0.8bn", "US$15M", "25+", "2"),
};

/** Choosing a market again, or this control, returns the Our portfolio map to all markets. */
export const ALL_MARKETS = "All markets";
/** Mobile market chips: the first is the current scope ("ERS Group" as drawn, flagged to the client). */
const CHIP_SELECTED = "ERS Group";

/* -------------------------------------------------------------- portfolio */

const P = {
  group: { icon: "globe_asia", title: "Our group portfolio", text: "Scale and reach across APAC", href: "/portfolio" },
  properties: { icon: "apartment", title: "Properties", text: "Industrial and logistics", href: "/portfolio/properties" },
  developments: { icon: "handyman", title: "Developments", text: "Pipeline, technology and sustainability.", href: "/portfolio/developments" },
  dataCentres: { icon: "database", title: "Data centres", text: "Digital infrastructure capability", href: "/portfolio/data-centres" },
  // Adjacent infrastructure has its own website (not part of the prototype, so inert): "Visit site" with open_in_new
  infrastructure: { icon: "cell_tower", title: "Adjacent infrastructure", text: "Our adjacent infrastructure business, on its own site", href: null, cta: "Visit site", offsite: true },
} satisfies Record<string, NavItem>;

/** The eyebrow over Properties and Developments (desktop and mobile). */
export const INDUSTRIAL_GROUP = "Industrial and logistics";

const PORTFOLIO: NavSection = {
  id: "portfolio",
  label: "Our portfolio",
  labelWidth: [85, 88],
  // Presentation feedback: Data centres before Adjacent infrastructure, Properties and Developments grouped under Industrial and logistics
  groups: [{ items: [P.group] }, { eyebrow: INDUSTRIAL_GROUP, nested: true, items: [P.properties, P.developments] }, { items: [P.dataCentres, P.infrastructure] }],
  panel: {
    // Toward 1180, Developments and Adjacent infrastructure hold at 242 / 240 so their descriptions stay on two lines
    cols: [295, 295, [305, 242], 284, [261, 240]],
    // Row 1 is the "Industrial and logistics" label (20 + 20 + 10 + its 1px rule); the other items span it, their
    // icons on the grouped items' line (51 + 22 = 73 down), so all five read as one row
    rows: [51, 190, 337],
    cells: [
      { col: 1, rowSpan: 2, pad: [73, 16, 0, 30], line: "b", blocks: [{ type: "item", item: P.group, reserve: true }] },
      { col: 2, span: 2, pad: [20, 16, 10, 39], line: "lb", label: INDUSTRIAL_GROUP, blocks: [] },
      { col: 2, row: 2, pad: [22, 16, 0, 39], line: "lb", blocks: [{ type: "item", item: P.properties, reserve: true }] },
      { col: 3, row: 2, pad: [22, 16, 0, 63], line: "lb", blocks: [{ type: "item", item: P.developments, reserve: true }] },
      // Data centres and Adjacent infrastructure keep the drawn geometry of columns 4 and 5
      { col: 4, rowSpan: 2, pad: [73, 16, 0, 62], line: "lb", blocks: [{ type: "item", item: P.dataCentres, reserve: true }] },
      { col: 5, rowSpan: 2, pad: [73, 16, 0, 39], line: "lb", blocks: [{ type: "item", item: P.infrastructure, reserve: true }] },
      {
        col: 1,
        span: 5,
        row: 3,
        pad: [25, 34, 19, 30],
        flow: "row",
        gap: 10,
        blocks: [
          {
            type: "regions",
            heading: "Browse properties by region",
            regions: [{ name: "Asia", span: 2 }, { name: "Oceania" }, { name: "Middle East" }],
            link: { label: "Stay up to date on vacancies", href: JOB_ALERTS_HREF },
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
  // "Our funds" lands on "Flagship funds across the group" on the Investment management page
  funds: { icon: "batch_prediction", title: "Our funds", text: "Every asset across the group", href: "/investors#flagship-funds" },
} satisfies Record<string, NavItem>;

/** The three pages stacked as rows in the first column, icon beside the text */
const row = (item: NavItem): ItemBlock => ({ type: "item", item, layout: "row" });

const INVESTOR: NavSection = {
  id: "investor",
  label: "Investment management",
  labelWidth: [160, 164],
  groups: [{ items: [I.investing, I.track, I.funds] }],
  panel: {
    // "Governance and reporting" was removed, so the panel is three full-height columns (no empty cell): the
    // pages as rows split by 1px lines, Invest by Market, and the ESR at a glance card. Toward 1180 the first
    // two hold at 300 / 320 so the rows and the market columns keep their width and the card (filling its column) gives way.
    cols: [[400, 300], [400, 320], 640],
    rows: [147, 147, 147],
    bottomLine: true,
    cells: [
      { col: 1, row: 1, pad: [0, 24, 0, 30], line: "b", center: true, blocks: [row(I.investing)] },
      { col: 1, row: 2, pad: [0, 24, 0, 30], line: "b", center: true, blocks: [row(I.track)] },
      { col: 1, row: 3, pad: [0, 24, 0, 30], center: true, blocks: [row(I.funds)] },
      {
        col: 2,
        row: 1,
        rowSpan: 3,
        pad: [37, 24, 33, 40],
        line: "l",
        blocks: [{ type: "markets", heading: "Invest by Market", columns: [["Asia"], ["Oceania", "Middle East"]], widths: [155, 100] }],
      },
      // No rule between "Invest by Market" and the card: they work as one piece (hovering a market localises the card)
      { col: 3, row: 1, rowSpan: 3, pad: [37, 32, 37, 40], flow: "row", blocks: [{ type: "glance", variant: "card", heading: GLANCE, stats: INVESTOR_STATS, byMarket: INVESTOR_MARKET_STATS }] },
    ],
  },
  mobile: [{ type: "chips", heading: "Invest by Market", selected: CHIP_SELECTED, stats: INVESTOR_STATS, statCols: 2, byMarket: INVESTOR_MARKET_STATS }],
};

/* --------------------------------------------------------- sustainability */

const S = {
  approach: { icon: "nest_eco_leaf", title: "Sustainability overview", text: "Strategy, targets and progress", href: "/sustainability" },
  // Figma draws video_template as an outline only; view_day is that outline (video_template adds a play mark)
  cases: { icon: "view_day", title: "Sustainability case studies", text: "How it works in practice", href: "/sustainability/case-studies" },
  governance: { icon: "policy", title: "Governance and management", text: "Reports, data packs and policies", href: "/sustainability/governance" },
} satisfies Record<string, NavItem>;

/** Featured case studies (replaces "Latest downloads"). Case study pages are not built, so the cards go to the case studies list. */
const CASE_STUDY_TITLE = "[Sustainability case study title]";
const CASE_STUDY_CTA = "Read the case study";
export const caseStudiesBlock = (markets: [string, string], href: string | null): CaseStudiesBlock => ({
  type: "caseStudies",
  heading: "Featured case studies",
  cards: markets.map((m) => ({ eyebrow: `Case study · ${m}`, title: CASE_STUDY_TITLE, cta: CASE_STUDY_CTA, href })),
  link: { label: "View all case studies", href },
});
const CASE_STUDIES = caseStudiesBlock(["Australia", "Japan"], "/sustainability/case-studies");

const SUSTAINABILITY: NavSection = {
  id: "sustainability",
  label: "Sustainability",
  labelWidth: [91, 94],
  groups: [{ items: [S.approach, S.cases, S.governance] }],
  panel: {
    // "Governance and management" (renamed from review feedback) is wider than the drawn 202px item, so its
    // item takes the cell (241 at 1440) and the column holds at 260 toward 1180, keeping the title on one line (the first two hold at 225 / 240 so theirs stay on one line too, and the case studies at 440)
    cols: [[295, 225], [295, 240], [295, 260], [555, 440]],
    rows: [288],
    cells: [
      { col: 1, pad: [55, 16, 0, 30], blocks: [{ type: "item", item: S.approach, reserve: true }] },
      { col: 2, pad: [55, 16, 0, 38], line: "l", blocks: [{ type: "item", item: S.cases, reserve: true }] },
      { col: 3, pad: [55, 16, 0, 38], line: "l", blocks: [{ type: "item", item: S.governance, reserve: true, wide: true }] },
      { col: 4, pad: [54, 24, 32, 31], surface: true, blocks: [CASE_STUDIES] },
    ],
  },
  mobile: [CASE_STUDIES],
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
    { title: "Press release · Japan", text: LOREM, href: "/news/news-08" },
    { title: "Case study · Japan", text: LOREM, href: "/news/latest-2" },
    { title: "News · Group", text: LOREM, href: "/news/latest-4" },
  ],
};
/** "Media kit" removed (presentation feedback) */
const MEDIA_LINKS: NavLinkItem[] = [{ label: "Media enquiries", href: "/news#media-enquiries" }];

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
  customers: { title: "Our customers", text: "The industries we serve", href: "/about/our-customers" },
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
