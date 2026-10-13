"use client";

import { Suspense, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { SearchField } from "@/components/ui/SearchField";
import { FilterPills, Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { PAD, T } from "@/components/ui/type";
import { ArticleCard } from "@/components/sections/news/ArticleCard";
import { articleTags } from "@/components/sections/news/newsSearch";
import { NAV_COPY, SEARCH_COPY } from "@/config/nav";
import { NEWS_ARTICLES } from "@/data/site/news";
import { SEARCH_TYPES, countByType, isSearchType, searchSite, searchTypeLabel, type SearchEntry, type SearchType } from "@/data/site/searchIndex";
import { SITE_SEARCH_COPY as COPY } from "./copy";

type State = { q: string; type: SearchType | null };

const fill = (template: string, values: Record<string, string | number>) => template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));

/** /search?q=…&type=… (the type only goes with a query). */
function searchHref({ q, type }: State) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (q && type) p.set("type", type);
  const qs = p.toString();
  return qs ? `${SEARCH_COPY.path}?${qs}` : SEARCH_COPY.path;
}

/**
 * The /search page body: the search field and type filters (white), then the results (grey).
 * Reads the URL inside its own Suspense boundary; while it loads the field is empty and the results band waits.
 */
export function SiteSearch() {
  return (
    <Suspense fallback={<View state={{ q: "", type: null }} loading />}>
      <FromUrl />
    </Suspense>
  );
}

function FromUrl() {
  const params = useSearchParams();
  const t = params.get("type");
  return <View state={{ q: (params.get("q") ?? "").trim(), type: isSearchType(t) ? t : null }} />;
}

function View({ state, loading = false }: { state: State; loading?: boolean }) {
  const router = useRouter();
  const { q, type } = state;
  const rootRef = useRef<HTMLDivElement>(null);
  /** Set before a navigation that removes the focused control (clear links, the field's X); the field takes focus after. */
  const focusField = useRef(false);
  const focusInput = () => rootRef.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus();

  const [draft, setDraft] = useState(q);
  // Show the new query when the URL changes (the header search, back and forward) without remounting.
  const [prevQ, setPrevQ] = useState(q);
  if (q !== prevQ) {
    setPrevQ(q);
    setDraft(q);
  }

  useEffect(() => {
    if (!focusField.current) return;
    focusField.current = false;
    focusInput();
  }, [q, type]);

  const navigate = (next: State) => router.push(searchHref(next), { scroll: false });
  const clear = () => {
    focusField.current = true;
  };

  const all = useMemo(() => searchSite(q), [q]);
  const results = type ? all.filter((r) => r.type === type) : all;

  const counts = countByType(all);
  if (type && !counts.some((c) => c.id === type)) {
    const t = SEARCH_TYPES.find((x) => x.id === type)!;
    counts.push({ ...t, count: 0 });
  }
  const pills = [{ id: "all", label: `${COPY.allLabel} (${all.length})` }, ...counts.map((c) => ({ id: c.id, label: `${c.plural} (${c.count})` }))];

  return (
    <div ref={rootRef}>
      <Section bg="white" className="pb-6 pt-8 md:pt-10 lg:pb-8 lg:pt-12">
        <div className="flex flex-col gap-3 md:gap-4">
          <SearchField
            value={draft}
            onChange={setDraft}
            onSubmit={(v) => {
              if (!v) {
                focusInput();
                if (q) navigate({ q: "", type: null });
                return;
              }
              if (v !== q) navigate({ q: v, type });
            }}
            placeholder={NAV_COPY.searchPlaceholder}
            label={COPY.fieldLabel}
          />
          {all.length > 0 && (
            <FilterPills label={COPY.typeFilterLabel} options={pills} value={type ?? "all"} onChange={(id) => navigate({ q, type: id === "all" ? null : (id as SearchType) })} />
          )}
        </div>
      </Section>
      {loading ? (
        <Section bg="surface" className={`${PAD.mid} min-h-[600px]`} aria-busy="true" aria-label="Loading results">
          {null}
        </Section>
      ) : q ? (
        <Results state={state} results={results} onClear={clear} />
      ) : (
        <Start />
      )}
    </div>
  );
}

/** No query yet: a prompt in the results band. */
function Start() {
  const headingId = useId();
  return (
    <Section bg="surface" className={PAD.mid} aria-labelledby={headingId}>
      <div className="flex flex-col items-center gap-3 rounded-card bg-white px-6 py-12 text-center md:py-16">
        <Icon name="search" size={40} className="text-muted" />
        <h2 id={headingId} className={T.title20m}>
          {COPY.startTitle}
        </h2>
        <p className={`max-w-[520px] ${T.body15}`}>{COPY.startBody}</p>
      </div>
    </Section>
  );
}

function Results({ state, results, onClear }: { state: State; results: SearchEntry[]; onClear: () => void }) {
  const headingId = useId();
  const listId = useId();
  const n = results.length;
  const [shown, setShown] = useState(COPY.pageSize);
  const listRef = useRef<HTMLUListElement>(null);
  const focusIndex = useRef<number | null>(null);

  // A new search or filter starts from the first page again.
  const key = searchHref(state);
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setShown(COPY.pageSize);
  }

  // "Load more" moves focus to the first new result, so keyboard users carry on from there.
  useEffect(() => {
    if (focusIndex.current === null) return;
    listRef.current?.children[focusIndex.current]?.querySelector<HTMLElement>("a")?.focus();
    focusIndex.current = null;
  }, [shown]);

  const heading = n === 0 ? fill(COPY.noResultsHeading, { q: state.q }) : fill(n === 1 ? COPY.headingWithQuerySingular : COPY.headingWithQuery, { n, q: state.q });
  const typeName = state.type ? SEARCH_TYPES.find((t) => t.id === state.type)?.plural : null;
  const sub = typeName ? fill(COPY.filteredBy, { filters: typeName.toLowerCase() }) : null;
  const visible = Math.min(shown, n);

  return (
    <>
      {/* With no results, "Most recent articles" follows closer (as drawn) */}
      <Section bg="surface" className={n === 0 ? "pb-8 pt-10 md:pb-10 md:pt-14 lg:pb-11 lg:pt-16" : PAD.mid} aria-labelledby={headingId}>
        <div className="flex flex-col gap-6 lg:gap-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <div className="flex min-w-0 flex-col gap-1.5" aria-live="polite" aria-atomic="true">
              <h2 id={headingId} className={`${T.h32b} break-words`}>
                {heading}
              </h2>
              {sub && <p className="text-[15px] leading-[1.45] text-muted-surface">{sub}</p>}
            </div>
            <TextLink variant="underline" size={15} href={SEARCH_COPY.path} onClick={onClear} className="self-start whitespace-nowrap md:self-auto">
              {COPY.clearLabel}
            </TextLink>
          </div>
          {n === 0 ? (
            <div className="flex flex-col items-center rounded-card bg-white px-6 py-12 text-center md:py-14">
              <Icon name="search_off" size={40} className="text-muted" />
              <h3 className={`mt-4 ${T.card24m}`}>{COPY.noResultsTitle}</h3>
              <p className={`mt-3 ${T.body16}`}>{COPY.noResultsBody}</p>
              <Button variant="dark" href={SEARCH_COPY.path} onClick={onClear} className="mt-5">
                {COPY.noResultsClear}
              </Button>
            </div>
          ) : (
            <ul ref={listRef} id={listId} role="list" className="flex flex-col gap-3 md:gap-4">
              {results.slice(0, visible).map((r) => (
                <li key={r.id}>
                  <ResultRow result={r} />
                </li>
              ))}
            </ul>
          )}
          {visible < n && (
            <div className="flex justify-center">
              <Button
                variant="outlineDark"
                aria-controls={listId}
                onClick={() => {
                  focusIndex.current = visible;
                  setShown((s) => s + COPY.pageSize);
                }}
                className="w-full md:w-auto"
              >
                {COPY.loadMoreLabel}
              </Button>
            </div>
          )}
        </div>
      </Section>
      {n === 0 && <RecentArticles />}
    </>
  );
}

/** A result: type tag, title (the link, stretched over the row), a two-line excerpt and the URL path. */
function ResultRow({ result: r }: { result: SearchEntry }) {
  return (
    <article className="group relative flex flex-col items-start gap-2 rounded-card bg-white px-5 py-5 transition-shadow hover:shadow-[0_4px_16px_rgba(17,24,39,0.08)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ink md:px-7 md:py-6">
      <Tag variant="filled">{searchTypeLabel(r.type)}</Tag>
      <h3 className={`mt-1 ${T.title20m}`}>
        <SmartLink href={r.href} className="underline-offset-4 after:absolute after:inset-0 after:rounded-card after:content-[''] group-hover:underline focus-visible:outline-none">
          {r.title}
        </SmartLink>
      </h3>
      <p className={`line-clamp-2 ${T.body15}`}>{r.excerpt}</p>
      <p className="text-[14px] font-medium leading-5 text-muted-surface [overflow-wrap:anywhere]">{r.path}</p>
    </article>
  );
}

/** No results: the first three "All stories" articles under "Most recent articles", as in the News search wireframe. */
function RecentArticles() {
  const headingId = useId();
  const recent = NEWS_ARTICLES.slice(0, COPY.recentCount);
  return (
    <Section bg="surface" className="pb-10 md:pb-14 lg:pb-16" aria-labelledby={headingId}>
      <h2 id={headingId} className={T.title20m}>
        {COPY.recentHeading}
      </h2>
      <ul role="list" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:mt-7 lg:grid-cols-3">
        {recent.map((a) => (
          <li key={a.id}>
            <ArticleCard tags={articleTags(a)} headline={a.headline} date={a.date} href={a.href} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
