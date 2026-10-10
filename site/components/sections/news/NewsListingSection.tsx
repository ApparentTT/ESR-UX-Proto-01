"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Icon } from "@/components/ui/Icon";
import { PAD, T } from "@/components/ui/type";
import { NEWS_ALL_STORIES, NEWS_ARTICLES, NEWS_RESULTS, type NewsArticle } from "@/data/site/news";
import { ArticleCard } from "./ArticleCard";
import {
  NEWS_FILTER_KEYS,
  NEWS_PATHS,
  articleTags,
  filterNews,
  fill,
  newsSearchHref,
  optionLabel,
  parseNewsParams,
  toNewsState,
  type NewsSearchState,
} from "./newsSearch";

type NewsAllProps = {
  variant: "newsAll";
  /** Records in display order; the first `copy.initialCount` show, "Load more" appends the rest in batches of that size */
  articles?: NewsArticle[];
  copy?: typeof NEWS_ALL_STORIES;
};

type NewsResultsProps = {
  variant: "newsResults";
  /** The record set to filter (default: the 10 mock records) */
  articles?: NewsArticle[];
  copy?: typeof NEWS_RESULTS;
  /** Show a fixed state instead of reading the URL (previews) */
  state?: Partial<NewsSearchState>;
  /** "Clear search and filters" destination (default /news) */
  basePath?: string;
};

export type NewsListingSectionProps = NewsAllProps | NewsResultsProps;

/**
 * B32 ListingSection, news variants. Surface band, 64 / 64 at desktop, 28px between head, grid and load more.
 * - newsAll (NEWS §4): "All stories" + "Showing 6 of XX articles"; 3 / 2 / 1 column grid of article cards;
 *   "Load more articles" appends the next batch, updates the first number and hides when all are shown.
 * - newsResults (NSR §2): reads q / market / type / topic / sort from the URL (no params = the wireframe
 *   state, 4 results for “data centres”), filters the records, and shows "{n} results for “{q}”", the
 *   "Filtered by …" line and "Clear search and filters" (→ /news). Zero results shows an empty panel with
 *   the same clear action. More than 6 results get "Load more articles".
 */
export function NewsListingSection(props: NewsListingSectionProps) {
  if (props.variant === "newsAll") return <AllStories {...props} />;
  return (
    <Suspense
      fallback={
        <Section bg="surface" className={`${PAD.mid} min-h-[600px]`} aria-busy="true" aria-label="Loading results">
          {null}
        </Section>
      }
    >
      <ResultsFromUrl {...props} />
    </Suspense>
  );
}

/** Visible count + "Load more": focus moves to the first appended card so keyboard users carry on. */
function useLoadMore(total: number, initial: number, step: number) {
  const [shown, setShown] = useState(Math.min(initial, total));
  const listRef = useRef<HTMLUListElement>(null);
  const focusIndex = useRef<number | null>(null);
  useEffect(() => {
    if (focusIndex.current === null) return;
    listRef.current?.children[focusIndex.current]?.querySelector<HTMLElement>("a")?.focus();
    focusIndex.current = null;
  }, [shown]);
  const more = () => {
    focusIndex.current = shown;
    setShown((s) => Math.min(total, s + step));
  };
  return { shown: Math.min(shown, total), more, reset: () => setShown(Math.min(initial, total)), listRef };
}

function ArticleGrid({ articles, listRef, id }: { articles: NewsArticle[]; listRef: React.Ref<HTMLUListElement>; id?: string }) {
  return (
    <ul ref={listRef} id={id} role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {articles.map((a, i) => (
        <li key={`${a.id}-${i}`}>
          <ArticleCard tags={articleTags(a)} headline={a.headline} date={a.date} href={a.href} />
        </li>
      ))}
    </ul>
  );
}

function LoadMore({ label, onClick, controls }: { label: string; onClick: () => void; controls: string }) {
  return (
    <div className="flex justify-center">
      <Button variant="outlineDark" onClick={onClick} aria-controls={controls} className="w-full md:w-auto">
        {label}
      </Button>
    </div>
  );
}

function AllStories({ articles = NEWS_ARTICLES, copy = NEWS_ALL_STORIES }: NewsAllProps) {
  const headingId = useId();
  const gridId = useId();
  const { shown, more, listRef } = useLoadMore(articles.length, copy.initialCount, copy.initialCount);
  return (
    <Section bg="surface" className={PAD.mid} aria-labelledby={headingId}>
      <div className="flex flex-col gap-6 lg:gap-7">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
          <h2 id={headingId} className={T.h32b}>
            {copy.heading}
          </h2>
          <p className="text-[15px] font-medium leading-[1.45] text-ink md:whitespace-nowrap md:text-right" aria-live="polite">
            {fill(copy.countTemplate, { shown })}
          </p>
        </div>
        <ArticleGrid articles={articles.slice(0, shown)} listRef={listRef} id={gridId} />
        {shown < articles.length && <LoadMore label={copy.loadMoreLabel} onClick={more} controls={gridId} />}
      </div>
    </Section>
  );
}

function ResultsFromUrl({ state: override, ...rest }: NewsResultsProps) {
  const params = useSearchParams();
  const state = override ? toNewsState(override) : parseNewsParams(params);
  return <Results state={state} {...rest} />;
}

/** "Filtered by" labels: content type and topic lower-cased as drawn ("press release"); market names and acronyms keep their capitals. */
function filteredByText(state: NewsSearchState): string {
  return NEWS_FILTER_KEYS.map((k) => {
    const l = optionLabel(k, state[k]);
    if (!l) return null;
    if (k === "market" || /^[A-Z]{2}/.test(l)) return l;
    return l.charAt(0).toLowerCase() + l.slice(1);
  })
    .filter(Boolean)
    .join(", ");
}

function Results({
  state,
  articles = NEWS_ARTICLES,
  copy = NEWS_RESULTS,
  basePath = NEWS_PATHS.base,
}: Omit<NewsResultsProps, "state"> & { state: NewsSearchState }) {
  const headingId = useId();
  const gridId = useId();
  const results = filterNews(state, articles);
  const n = results.length;
  const { shown, more, reset, listRef } = useLoadMore(n, copy.pageSize, copy.pageSize);

  // A new search starts from the first page again.
  const key = newsSearchHref(state);
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    reset();
  }

  const heading = state.q
    ? fill(n === 1 ? copy.headingWithQuerySingular : copy.headingWithQuery, { n, q: state.q })
    : fill(n === 1 ? copy.headingNoQuerySingular : copy.headingNoQuery, { n });
  const filters = filteredByText(state);
  const sub = [filters && fill(copy.filteredBy, { filters }), copy.featuredHidden].filter(Boolean).join(" ");

  return (
    <Section bg="surface" className={PAD.mid} aria-labelledby={headingId}>
      <div className="flex flex-col gap-6 lg:gap-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="flex min-w-0 flex-col gap-1.5" aria-live="polite" aria-atomic="true">
            <h2 id={headingId} className={`${T.h32b} break-words`}>
              {heading}
            </h2>
            <p className="text-[15px] leading-[1.45] text-muted-surface">{sub}</p>
          </div>
          <TextLink variant="underline" size={15} href={basePath} className="self-start whitespace-nowrap md:self-auto">
            {copy.clearLabel}
          </TextLink>
        </div>
        {n === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-card bg-white px-6 py-12 text-center md:py-16">
            <Icon name="search_off" size={40} className="text-muted" />
            <Button variant="outlineDark" href={basePath}>
              {copy.clearLabel}
            </Button>
          </div>
        ) : (
          <ArticleGrid articles={results.slice(0, shown)} listRef={listRef} id={gridId} />
        )}
        {shown < n && <LoadMore label={copy.loadMoreLabel} onClick={more} controls={gridId} />}
      </div>
    </Section>
  );
}
