"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { SearchField } from "@/components/ui/SearchField";
import { AppliedChip } from "@/components/ui/Tag";
import { NEWS_FILTER_COPY, NEWS_MARKETS, NEWS_SORTS, NEWS_TOPICS, NEWS_TYPES, type NewsMarket, type NewsSort, type NewsTopic, type NewsType } from "@/data/site/news";
import { NewsFilterMenu } from "./NewsFilterMenu";
import {
  EMPTY_NEWS_STATE,
  NEWS_FILTER_KEYS,
  NEWS_PATHS,
  WIREFRAME_NEWS_STATE,
  effectiveSort,
  hasSearch,
  newsSearchHref,
  optionLabel,
  parseNewsParams,
  toNewsState,
  type NewsFilterKey,
  type NewsSearchState,
} from "./newsSearch";

export type NewsSearchFiltersProps = {
  /**
   * news: /news. Empty field, no chips, "Most recent". Enter or any filter / sort choice goes to /news/search?….
   * results: /news/search. Filled from the URL params (none = the wireframe state: "data centres" + Press release
   * chip + "Most relevant"); changes update the URL in place.
   */
  mode: "news" | "results";
  /** Show a fixed state instead of reading the URL (previews). Interactions still navigate. */
  state?: Partial<NewsSearchState>;
  /** Labels; defaults to NEWS_FILTER_COPY */
  copy?: typeof NEWS_FILTER_COPY;
  /** Route of the results page (default /news/search) */
  searchPath?: string;
  /** Where clearing the last query or filter goes (default /news) */
  basePath?: string;
};

type Navigate = (next: NewsSearchState, removal: boolean) => void;

/**
 * B33 NewsSearchFilters (NEWS §2 / NSR §1). White band, 48 top / 32 bottom at desktop, 16px gap:
 * SearchField, then the filter bar: "Group or market", "Content type", "Topic", applied chips (market, type,
 * topic order), a spacer, then the sort trigger on the right. The bar wraps on narrow screens (sort stays
 * right-aligned on its row) so the menus are never clipped by a scroll container.
 * Reads the URL with useSearchParams inside its own Suspense boundary; pages need no wrapper.
 */
export function NewsSearchFilters(props: NewsSearchFiltersProps) {
  const fallback = props.state ? toNewsState(props.state) : props.mode === "results" ? WIREFRAME_NEWS_STATE : EMPTY_NEWS_STATE;
  return (
    <Suspense fallback={<FiltersView state={fallback} copy={props.copy ?? NEWS_FILTER_COPY} onNavigate={() => {}} />}>
      <FiltersFromUrl {...props} />
    </Suspense>
  );
}

function FiltersFromUrl({ mode, state: override, copy = NEWS_FILTER_COPY, searchPath = NEWS_PATHS.search, basePath = NEWS_PATHS.base }: NewsSearchFiltersProps) {
  const params = useSearchParams();
  const router = useRouter();
  const state = override ? toNewsState(override) : mode === "results" ? parseNewsParams(params) : EMPTY_NEWS_STATE;

  const navigate: Navigate = (next, removal) => {
    // Removing the last query or filter returns to /news (NSR "Controls").
    const href = removal && !hasSearch(next) ? basePath : newsSearchHref(next, searchPath);
    // Moving between /news and /news/search remounts the bar; remember which control had focus so the new page restores it.
    if (href.split("?")[0] !== window.location.pathname) {
      const a = document.activeElement as HTMLElement | null;
      const filter = a?.closest("[data-filter]")?.getAttribute("data-filter");
      const sel = a?.matches('input[type="search"]') ? 'input[type="search"]' : filter ? `[data-filter="${filter}"] button` : a?.closest("[data-sort]") ? "[data-sort] button" : null;
      try {
        if (sel) sessionStorage.setItem(FOCUS_KEY, sel);
      } catch {}
    }
    router.push(href, { scroll: false });
  };

  return <FiltersView state={state} copy={copy} onNavigate={navigate} restoreFocus />;
}

const FOCUS_KEY = "esr:news-focus";

function FiltersView({ state, copy, onNavigate, restoreFocus = false }: { state: NewsSearchState; copy: typeof NEWS_FILTER_COPY; onNavigate: Navigate; restoreFocus?: boolean }) {
  const [draft, setDraft] = useState(state.q);
  // Show the new query when the URL changes (without remounting, so focus stays put).
  const [prevQ, setPrevQ] = useState(state.q);
  if (state.q !== prevQ) {
    setPrevQ(state.q);
    setDraft(state.q);
  }
  const rootRef = useRef<HTMLDivElement>(null);
  /** Keep keyboard focus on the page when the control that had it disappears (chip X, field X). */
  const refocus = (selector: string) => rootRef.current?.querySelector<HTMLElement>(selector)?.focus();

  useEffect(() => {
    if (!restoreFocus) return;
    try {
      const sel = sessionStorage.getItem(FOCUS_KEY);
      if (!sel) return;
      sessionStorage.removeItem(FOCUS_KEY);
      rootRef.current?.querySelector<HTMLElement>(sel)?.focus({ preventScroll: true });
    } catch {}
  }, [restoreFocus]);

  /** Apply a change on top of the current state, carrying any typed (unsubmitted) query. */
  const apply = (patch: Partial<NewsSearchState>, removal = false) => onNavigate({ ...state, q: draft.trim(), ...patch }, removal);

  const submitQuery = (q: string) => {
    if (!q) refocus('input[type="search"]');
    if (q === state.q) return;
    apply({ q }, !q);
  };

  const setFilter = (key: NewsFilterKey, v: string | null) => {
    if (v === state[key]) return;
    if (key === "market") apply({ market: v as NewsMarket | null }, v === null);
    else if (key === "type") apply({ type: v as NewsType | null }, v === null);
    else apply({ topic: v as NewsTopic | null }, v === null);
  };

  const triggers: { key: NewsFilterKey; label: string; options: { id: string; label: string }[] }[] = [
    { key: "market", label: copy.marketLabel, options: NEWS_MARKETS },
    { key: "type", label: copy.typeLabel, options: NEWS_TYPES },
    { key: "topic", label: copy.topicLabel, options: NEWS_TOPICS },
  ];

  const chips = NEWS_FILTER_KEYS.flatMap((key) => {
    const label = optionLabel(key, state[key]);
    return label ? [{ key, label }] : [];
  });

  return (
    <Section bg="white" className="pb-6 pt-8 md:pt-10 lg:pb-8 lg:pt-12">
      <div ref={rootRef} className="flex flex-col gap-3 md:gap-4">
        <SearchField value={draft} onChange={setDraft} onSubmit={submitQuery} placeholder={copy.searchPlaceholder} label={copy.searchPlaceholder} />
        <div role="group" aria-label="Filter and sort" className="flex flex-wrap items-center gap-2 md:gap-3">
          {triggers.map((t) => (
            <div key={t.key} data-filter={t.key}>
              <NewsFilterMenu label={t.label} options={t.options} value={state[t.key]} onChange={(v) => setFilter(t.key, v)} />
            </div>
          ))}
          {chips.length > 0 && (
            // 390: chips get their own wrapping row under the triggers and sort; ≥768 they sit inline after "Topic".
            <div className="order-last flex w-full flex-wrap gap-2 md:contents">
              {chips.map(({ key, label }) => (
                <AppliedChip
                  key={key}
                  label={label}
                  onRemove={() => {
                    refocus(`[data-filter="${key}"] button`);
                    setFilter(key, null);
                  }}
                />
              ))}
            </div>
          )}
          <div data-sort className="ml-auto">
            <NewsFilterMenu
              variant="sort"
              label="Sort"
              align="right"
              options={NEWS_SORTS}
              value={effectiveSort(state)}
              onChange={(v) => v && v !== effectiveSort(state) && apply({ sort: v as NewsSort })}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
