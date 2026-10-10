/**
 * News and insights content (NEWS `news.md`, NSR `news-search.md`, inventory B32–B35), verbatim.
 * One 10-record mock set is shared by /news ("All stories" + Load more) and /news/search (filtering).
 * Articles are not wireframed, so every card links nowhere (href null = inert).
 */

/** URL param values (NSR "Interactive behaviour"). */
export type NewsMarket = "group" | "japan" | "australia" | "south-korea";
export type NewsType = "press-release" | "thought-leadership" | "case-study";
export type NewsTopic = "fund-management" | "data-centres" | "development" | "esg-and-sustainability";
export type NewsSort = "relevant" | "recent";

export type NewsOption<T extends string> = { id: T; label: string };

/** Dropdown options. Not designed: these are the tag labels already on the page (NEWS §2). */
export const NEWS_MARKETS: NewsOption<NewsMarket>[] = [
  { id: "group", label: "Group" },
  { id: "japan", label: "Japan" },
  { id: "australia", label: "Australia" },
  { id: "south-korea", label: "South Korea" },
];
export const NEWS_TYPES: NewsOption<NewsType>[] = [
  { id: "press-release", label: "Press release" },
  { id: "thought-leadership", label: "Thought leadership" },
  { id: "case-study", label: "Case study" },
];
export const NEWS_TOPICS: NewsOption<NewsTopic>[] = [
  { id: "fund-management", label: "Fund management" },
  { id: "data-centres", label: "Data centres" },
  { id: "development", label: "Development" },
  { id: "esg-and-sustainability", label: "ESG and sustainability" },
];
export const NEWS_SORTS: NewsOption<NewsSort>[] = [
  { id: "recent", label: "Most recent" },
  { id: "relevant", label: "Most relevant" },
];

export type NewsArticle = {
  id: string;
  market: NewsMarket;
  type: NewsType;
  topic: NewsTopic;
  headline: string;
  /** Display date, verbatim */
  date: string;
  /** ISO date for sorting */
  isoDate: string;
  /** Article pages are not wireframed */
  href: string | null;
};

/**
 * NEWS §4 cards 1–6 (the /news "All stories" grid, in reading order), then NSR §2 cards 1–4
 * (appended by "Load more articles"; the four "data centres" press releases).
 * Tag order on every card: market, content type, topic.
 */
export const NEWS_ARTICLES: NewsArticle[] = [
  { id: "news-01", market: "group", type: "press-release", topic: "fund-management", headline: "Article headline placeholder", date: "1 July 2026", isoDate: "2026-07-01", href: null },
  { id: "news-02", market: "japan", type: "thought-leadership", topic: "data-centres", headline: "Article headline placeholder", date: "28 June 2026", isoDate: "2026-06-28", href: null },
  { id: "news-03", market: "australia", type: "case-study", topic: "development", headline: "Article headline placeholder", date: "21 June 2026", isoDate: "2026-06-21", href: null },
  { id: "news-04", market: "group", type: "press-release", topic: "esg-and-sustainability", headline: "Article headline placeholder", date: "14 June 2026", isoDate: "2026-06-14", href: null },
  { id: "news-05", market: "south-korea", type: "case-study", topic: "data-centres", headline: "Article headline placeholder", date: "7 June 2026", isoDate: "2026-06-07", href: null },
  { id: "news-06", market: "group", type: "thought-leadership", topic: "development", headline: "Article headline placeholder", date: "1 June 2026", isoDate: "2026-06-01", href: null },
  { id: "news-07", market: "group", type: "press-release", topic: "data-centres", headline: "Article headline placeholder mentioning data centres", date: "1 July 2026", isoDate: "2026-07-01", href: null },
  { id: "news-08", market: "japan", type: "press-release", topic: "data-centres", headline: "Article headline placeholder mentioning data centres", date: "28 June 2026", isoDate: "2026-06-28", href: null },
  { id: "news-09", market: "south-korea", type: "press-release", topic: "data-centres", headline: "Article headline placeholder mentioning data centres", date: "14 June 2026", isoDate: "2026-06-14", href: null },
  { id: "news-10", market: "group", type: "press-release", topic: "data-centres", headline: "Article headline placeholder mentioning data centres", date: "2 June 2026", isoDate: "2026-06-02", href: null },
];

/** NEWS §1 page intro: `<PageIntro title={NEWS_INTRO.title} body={NEWS_INTRO.body} />` (also on /news/search). */
export const NEWS_INTRO = {
  title: "News and insights",
  body: "The single source of truth for ESR. Global group announcements alongside curated highlights from every market we operate in.",
};

/** NEWS §2 / NSR §1 search field and filter bar labels. */
export const NEWS_FILTER_COPY = {
  searchPlaceholder: "Search news and insights",
  marketLabel: "Group or market",
  typeLabel: "Content type",
  topicLabel: "Topic",
};

/** NEWS §3 featured article: `<FeaturedArticle {...NEWS_FEATURED} />`. */
export const NEWS_FEATURED = {
  label: "Featured",
  tags: ["Group", "Press release", "Fund management"],
  headline: "Featured article headline placeholder, up to two lines",
  standfirst: "A short standfirst explaining what the article covers and why it matters right now.",
  date: "1 July 2026",
  ctaLabel: "Read the article",
  href: null as string | null,
};

/** NEWS §4 "All stories". `{shown}` is replaced by the number of cards on screen; "XX" stays verbatim. */
export const NEWS_ALL_STORIES = {
  heading: "All stories",
  countTemplate: "Showing {shown} of XX articles",
  loadMoreLabel: "Load more articles",
  initialCount: 6,
};

/**
 * NSR §2 results head. Only "4 results for “data centres”" and the "Filtered by press release. …" line are
 * designed; the no-query, singular and zero-result wordings are the spec's proposals.
 */
export const NEWS_RESULTS = {
  headingWithQuery: "{n} results for “{q}”",
  headingWithQuerySingular: "{n} result for “{q}”",
  headingNoQuery: "{n} results",
  headingNoQuerySingular: "{n} result",
  filteredBy: "Filtered by {filters}.",
  featuredHidden: "Featured article is hidden while a search is active.",
  clearLabel: "Clear search and filters",
  loadMoreLabel: "Load more articles",
  pageSize: 6,
};

/** NEWS §5 market CTA. `{market}` is the market's label ("Japan" as drawn on /news). */
export const NEWS_MARKET_CTA = {
  headingTemplate: "See what is happening in {market}",
  sub: "Local announcements, case studies and market commentary from the team on the ground.",
  note: "Appears when a market filter is selected. Hidden when that market has fewer than three articles.",
  buttonTemplate: "Go to {market} news",
  /** Local market sites are external and not wireframed */
  href: null as string | null,
};

/** NSR "Default and wireframe state": /news/search with no params shows q=data centres, type=press-release, sort=relevant. */
export const NEWS_SEARCH_WIREFRAME_STATE = {
  q: "data centres",
  market: null,
  type: "press-release",
  topic: null,
  sort: "relevant",
} as const;
