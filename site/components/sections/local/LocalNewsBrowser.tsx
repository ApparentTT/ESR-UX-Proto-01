"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { SearchField } from "@/components/ui/SearchField";
import { AppliedChip } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Icon } from "@/components/ui/Icon";
import { PAD, T } from "@/components/ui/type";
import { NewsFilterMenu } from "@/components/sections/news/NewsFilterMenu";
import { FeaturedArticle, type FeaturedArticleProps } from "@/components/sections/news/FeaturedArticle";
import { ArticleCard } from "@/components/sections/news/ArticleCard";
import { fill } from "@/components/sections/news/newsSearch";
import { NEWS_ALL_STORIES, NEWS_FILTER_COPY, NEWS_RESULTS, NEWS_SORTS, NEWS_TOPICS, NEWS_TYPES, type NewsSort, type NewsTopic, type NewsType } from "@/data/site/news";
import type { JpNewsArticle } from "@/data/site/local/news";

type State = { q: string; type: NewsType | null; topic: NewsTopic | null; sort: NewsSort | null };
const EMPTY: State = { q: "", type: null, topic: null, sort: null };

const pick = <T extends string>(opts: { id: T }[], v: string | null): T | null => opts.find((o) => o.id === v)?.id ?? null;
const label = (opts: { id: string; label: string }[], id: string | null) => opts.find((o) => o.id === id)?.label ?? null;
const tagsOf = (a: JpNewsArticle) => [label(NEWS_TYPES, a.type), label(NEWS_TOPICS, a.topic)].filter(Boolean) as string[];
const hasSearch = (s: State) => Boolean(s.q || s.type || s.topic);
const sortOf = (s: State): NewsSort => s.sort ?? (s.q ? "relevant" : "recent");

function toHref(path: string, s: State) {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.type) p.set("type", s.type);
  if (s.topic) p.set("topic", s.topic);
  if (s.sort) p.set("sort", s.sort);
  const qs = p.toString();
  return qs ? `${path}?${qs}` : path;
}

/** q: headline and tag labels; type / topic: exact. Both sorts are by date, newest first (as on the group page). */
function filter(s: State, articles: JpNewsArticle[]) {
  const q = s.q.toLowerCase();
  return articles
    .map((a, i) => ({ a, i }))
    .filter(({ a }) => (!s.type || a.type === s.type) && (!s.topic || a.topic === s.topic) && (!q || [a.headline, ...tagsOf(a)].some((t) => t.toLowerCase().includes(q))))
    .sort((x, y) => y.a.isoDate.localeCompare(x.a.isoDate) || x.i - y.i)
    .map(({ a }) => a);
}

/**
 * The Japan News and insights body (Local_NewsAndInsights 1064:45339 to 1064:45437): search field and filter bar
 * (Content type, Topic, chips, Most recent), then the featured article and "All stories" (6 cards, "Load more
 * articles"), or, while a search or filter is applied, the results ("{n} results", "Filtered by …", "Clear search
 * and filters"). Works like the group /news + /news/search pair, in place on /jp/news: the state lives in the URL
 * (?q= ?type= ?topic= ?sort=), so the local nav's Press releases / Thought leadership / Case studies links land
 * filtered. Cards carry content type and topic tags, as drawn.
 */
export function LocalNewsBrowser(props: { featured: FeaturedArticleProps; articles: JpNewsArticle[] }) {
  return (
    <Suspense fallback={<View state={EMPTY} onChange={() => {}} {...props} />}>
      <FromUrl {...props} />
    </Suspense>
  );
}

function FromUrl(props: { featured: FeaturedArticleProps; articles: JpNewsArticle[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const state: State = {
    q: (params.get("q") ?? "").trim(),
    type: pick(NEWS_TYPES, params.get("type")),
    topic: pick(NEWS_TOPICS, params.get("topic")),
    sort: pick(NEWS_SORTS, params.get("sort")),
  };
  return <View state={state} onChange={(s) => router.push(toHref(path, s), { scroll: false })} clearHref={path} {...props} />;
}

function View({
  state,
  onChange,
  featured,
  articles,
  clearHref = "/jp/news",
}: {
  state: State;
  onChange: (s: State) => void;
  featured: FeaturedArticleProps;
  articles: JpNewsArticle[];
  clearHref?: string;
}) {
  const [draft, setDraft] = useState(state.q);
  const [prevQ, setPrevQ] = useState(state.q);
  if (state.q !== prevQ) {
    setPrevQ(state.q);
    setDraft(state.q);
  }
  const barRef = useRef<HTMLDivElement>(null);
  const apply = (patch: Partial<State>) => onChange({ ...state, q: draft.trim(), ...patch });

  const triggers = [
    { key: "type" as const, label: NEWS_FILTER_COPY.typeLabel, options: NEWS_TYPES },
    { key: "topic" as const, label: NEWS_FILTER_COPY.topicLabel, options: NEWS_TOPICS },
  ];
  const chips = triggers.flatMap((t) => {
    const l = label(t.options, state[t.key]);
    return l ? [{ key: t.key, label: l }] : [];
  });

  return (
    <>
      <Section bg="white" className="pb-6 pt-8 md:pt-10 lg:pb-8 lg:pt-12">
        <div ref={barRef} className="flex flex-col gap-3 md:gap-4">
          <SearchField
            value={draft}
            onChange={setDraft}
            onSubmit={(q) => q !== state.q && apply({ q })}
            placeholder={NEWS_FILTER_COPY.searchPlaceholder}
            label={NEWS_FILTER_COPY.searchPlaceholder}
          />
          <div role="group" aria-label="Filter and sort" className="flex flex-wrap items-center gap-2 md:gap-3">
            {triggers.map((t) => (
              <div key={t.key} data-filter={t.key}>
                <NewsFilterMenu label={t.label} options={t.options} value={state[t.key]} onChange={(v) => apply({ [t.key]: v })} />
              </div>
            ))}
            {chips.length > 0 && (
              <div className="order-last flex w-full flex-wrap gap-2 md:contents">
                {chips.map((c) => (
                  <AppliedChip
                    key={c.key}
                    label={c.label}
                    onRemove={() => {
                      barRef.current?.querySelector<HTMLElement>(`[data-filter="${c.key}"] button`)?.focus();
                      apply({ [c.key]: null });
                    }}
                  />
                ))}
              </div>
            )}
            <div className="ml-auto">
              <NewsFilterMenu
                variant="sort"
                label="Sort"
                align="right"
                options={NEWS_SORTS}
                value={sortOf(state)}
                onChange={(v) => v && v !== sortOf(state) && apply({ sort: v as NewsSort })}
              />
            </div>
          </div>
        </div>
      </Section>
      {hasSearch(state) ? (
        // Remount per search so paging starts again from the first page
        <Results key={toHref("", state)} state={state} articles={articles} clearHref={clearHref} />
      ) : (
        <>
          <FeaturedArticle {...featured} />
          <AllStories articles={articles} />
        </>
      )}
    </>
  );
}

/** Visible count + "Load more": focus moves to the first appended card. */
function useLoadMore(total: number, step: number) {
  const [shown, setShown] = useState(Math.min(step, total));
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
  return { shown: Math.min(shown, total), more, listRef };
}

function Grid({ articles, listRef, id }: { articles: JpNewsArticle[]; listRef: React.Ref<HTMLUListElement>; id: string }) {
  return (
    <ul ref={listRef} id={id} role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {articles.map((a, i) => (
        <li key={`${a.id}-${i}`}>
          <ArticleCard tags={tagsOf(a)} headline={a.headline} date={a.date} href={a.href} />
        </li>
      ))}
    </ul>
  );
}

function AllStories({ articles }: { articles: JpNewsArticle[] }) {
  const headingId = useId();
  const gridId = useId();
  const copy = NEWS_ALL_STORIES;
  const { shown, more, listRef } = useLoadMore(articles.length, copy.initialCount);
  return (
    <Section bg="surface" className={PAD.mid} aria-labelledby={headingId}>
      <div className="flex flex-col gap-6 lg:gap-7">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-4">
          <h2 id={headingId} className={T.h32b}>
            {copy.heading}
          </h2>
          <p className="text-[15px] font-medium leading-[1.45] text-ink md:whitespace-nowrap" aria-live="polite">
            {fill(copy.countTemplate, { shown })}
          </p>
        </div>
        <Grid articles={articles.slice(0, shown)} listRef={listRef} id={gridId} />
        {shown < articles.length && (
          <div className="flex justify-center">
            <Button variant="outlineDark" onClick={more} aria-controls={gridId} className="w-full md:w-auto">
              {copy.loadMoreLabel}
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}

function Results({ state, articles, clearHref }: { state: State; articles: JpNewsArticle[]; clearHref: string }) {
  const headingId = useId();
  const gridId = useId();
  const copy = NEWS_RESULTS;
  const results = filter(state, articles);
  const n = results.length;
  const { shown, more, listRef } = useLoadMore(n, copy.pageSize);
  const heading = state.q
    ? fill(n === 1 ? copy.headingWithQuerySingular : copy.headingWithQuery, { n, q: state.q })
    : fill(n === 1 ? copy.headingNoQuerySingular : copy.headingNoQuery, { n });
  const filters = [label(NEWS_TYPES, state.type), label(NEWS_TOPICS, state.topic)]
    .filter(Boolean)
    .map((l) => (/^[A-Z]{2}/.test(l!) ? l : l!.charAt(0).toLowerCase() + l!.slice(1)))
    .join(", ");
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
          <TextLink variant="underline" size={15} href={clearHref} className="self-start whitespace-nowrap md:self-auto">
            {copy.clearLabel}
          </TextLink>
        </div>
        {n === 0 ? (
          <div className="flex flex-col items-center gap-5 rounded-card bg-white px-6 py-12 text-center md:py-16">
            <Icon name="search_off" size={40} className="text-muted" />
            <Button variant="outlineDark" href={clearHref}>
              {copy.clearLabel}
            </Button>
          </div>
        ) : (
          <Grid articles={results.slice(0, shown)} listRef={listRef} id={gridId} />
        )}
        {shown < n && (
          <div className="flex justify-center">
            <Button variant="outlineDark" onClick={more} aria-controls={gridId} className="w-full md:w-auto">
              {copy.loadMoreLabel}
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}
