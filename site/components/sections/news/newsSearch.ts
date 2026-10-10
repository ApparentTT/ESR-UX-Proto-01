/**
 * Shared news search state: parse /news/search URL params, build hrefs, and filter the mock set
 * (NSR "Interactive behaviour"). Pure functions, safe on the server and the client.
 */
import {
  NEWS_ARTICLES,
  NEWS_MARKETS,
  NEWS_SEARCH_WIREFRAME_STATE,
  NEWS_SORTS,
  NEWS_TOPICS,
  NEWS_TYPES,
  type NewsArticle,
  type NewsMarket,
  type NewsOption,
  type NewsSort,
  type NewsTopic,
  type NewsType,
} from "@/data/site/news";

export type NewsSearchState = {
  q: string;
  market: NewsMarket | null;
  type: NewsType | null;
  topic: NewsTopic | null;
  /** null = the default for the query (relevant with q, recent without) */
  sort: NewsSort | null;
};

export type NewsFilterKey = "market" | "type" | "topic";

/** Default routes. The dev preview overrides them so it can filter in place. */
export const NEWS_PATHS = { base: "/news", search: "/news/search" };

export const EMPTY_NEWS_STATE: NewsSearchState = { q: "", market: null, type: null, topic: null, sort: null };
/** The wireframe's "Most relevant" is the default with a query, so it is not pinned (removing a chip keeps the URL clean). */
export const WIREFRAME_NEWS_STATE: NewsSearchState = { ...NEWS_SEARCH_WIREFRAME_STATE, sort: null };

export const NEWS_FILTER_OPTIONS: Record<NewsFilterKey, NewsOption<string>[]> = {
  market: NEWS_MARKETS,
  type: NEWS_TYPES,
  topic: NEWS_TOPICS,
};
/** Chip order on the filter bar and in the "Filtered by" line. */
export const NEWS_FILTER_KEYS: NewsFilterKey[] = ["market", "type", "topic"];

const PARAM_KEYS = ["q", "market", "type", "topic", "sort"] as const;

function pick<T extends string>(options: NewsOption<T>[], v: string | null | undefined): T | null {
  return options.find((o) => o.id === v)?.id ?? null;
}

type ParamsLike = { get(name: string): string | null; has(name: string): boolean };

/**
 * Read the URL params. With none of q / market / type / topic / sort present, the results page shows
 * the wireframed state (pass `fallback` to change that). Unknown values are ignored.
 */
export function parseNewsParams(params: ParamsLike | null, fallback: NewsSearchState = WIREFRAME_NEWS_STATE): NewsSearchState {
  if (!params || !PARAM_KEYS.some((k) => params.has(k))) return { ...fallback };
  return {
    q: (params.get("q") ?? "").trim(),
    market: pick(NEWS_MARKETS, params.get("market")),
    type: pick(NEWS_TYPES, params.get("type")),
    topic: pick(NEWS_TOPICS, params.get("topic")),
    sort: pick(NEWS_SORTS, params.get("sort")),
  };
}

/** Fill a partial state (for the `state` prop overrides). */
export function toNewsState(s: Partial<NewsSearchState>): NewsSearchState {
  return { ...EMPTY_NEWS_STATE, ...s };
}

export function effectiveSort(s: NewsSearchState): NewsSort {
  return s.sort ?? (s.q ? "relevant" : "recent");
}

/** True when there is a query or at least one filter (sort alone does not count). */
export function hasSearch(s: NewsSearchState): boolean {
  return Boolean(s.q || s.market || s.type || s.topic);
}

/** `/news/search?q=…&market=…&type=…&topic=…&sort=…` (only the params that are set). */
export function newsSearchHref(s: NewsSearchState, searchPath = NEWS_PATHS.search): string {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.market) p.set("market", s.market);
  if (s.type) p.set("type", s.type);
  if (s.topic) p.set("topic", s.topic);
  if (s.sort) p.set("sort", s.sort);
  const qs = p.toString();
  return qs ? `${searchPath}?${qs}` : searchPath;
}

export function optionLabel(key: NewsFilterKey, id: string | null): string | null {
  if (!id) return null;
  return NEWS_FILTER_OPTIONS[key].find((o) => o.id === id)?.label ?? null;
}

export function marketLabel(id: string | null): string | null {
  return optionLabel("market", id);
}

/** Tag labels of a record, in card order: market, content type, topic. */
export function articleTags(a: NewsArticle): string[] {
  return [optionLabel("market", a.market), optionLabel("type", a.type), optionLabel("topic", a.topic)].filter(Boolean) as string[];
}

/** Applied filter labels in chip order, e.g. ["Press release"]. */
export function activeFilterLabels(s: NewsSearchState): string[] {
  return NEWS_FILTER_KEYS.map((k) => optionLabel(k, s[k])).filter(Boolean) as string[];
}

/**
 * q: case-insensitive substring match on the headline and the three tag labels.
 * market / type / topic: exact match. Both sorts order by date, newest first (no ranking is defined).
 */
export function filterNews(s: NewsSearchState, articles: NewsArticle[] = NEWS_ARTICLES): NewsArticle[] {
  const q = s.q.trim().toLowerCase();
  const out = articles.filter((a) => {
    if (s.market && a.market !== s.market) return false;
    if (s.type && a.type !== s.type) return false;
    if (s.topic && a.topic !== s.topic) return false;
    if (!q) return true;
    return [a.headline, ...articleTags(a)].some((t) => t.toLowerCase().includes(q));
  });
  return out
    .map((a, i) => ({ a, i }))
    .sort((x, y) => y.a.isoDate.localeCompare(x.a.isoDate) || x.i - y.i)
    .map(({ a }) => a);
}

/** Replace `{key}` tokens in a copy template. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}
