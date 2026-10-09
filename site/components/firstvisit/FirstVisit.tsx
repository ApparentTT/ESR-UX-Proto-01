"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { AllFiltersPanel } from "@/components/search/panels/AllFiltersPanel";
import { applySuggestion } from "@/components/search/panels/LocationPanel";
import { PropertyCard } from "@/components/search/PropertyCard";
import { FakeMap } from "@/components/search/FakeMap";
import { PREFECTURES } from "@/data/locations";
import { PROPERTY_TYPES, type PropertyTypeId } from "@/data/types";
import { PROPERTIES } from "@/data/properties";
import {
  EMPTY_FILTERS,
  activeGroupCount,
  countMatching,
  locationSuggestions,
  prefectureCounts,
  searchHref,
  sortProperties,
  typeCounts,
  type Filters,
  type Suggestion,
} from "@/lib/filters";
import { DESKTOP_QUERY, SHEET_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { MARKET } from "@/config/market";

const POPULAR: { label: string; filters: Partial<Filters> }[] = [
  { label: "Kanagawa South", filters: { pref: ["kanagawa"] } },
  { label: "Greater Tokyo", filters: { pref: ["tokyo", "kanagawa", "saitama", "chiba"] } },
  { label: "Osaka", filters: { pref: ["osaka"] } },
  { label: "Available now", filters: { avail: "now" } },
];

const BROWSE_TYPES: PropertyTypeId[] = ["logistics", "business-park", "data-centre", "cold-storage"];

export function FirstVisit() {
  const router = useRouter();
  const isSheet = useMediaQuery(SHEET_QUERY);
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);

  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  // Filters chosen in the all-filters panel are held here until Search is pressed.
  const [chosen, setChosen] = useState<Filters>(EMPTY_FILTERS);
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS);
  const [panelText, setPanelText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => (focused ? locationSuggestions(text, chosen) : []), [focused, text, chosen]);
  const go = useCallback((f: Filters) => router.push(searchHref(f)), [router]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    go({ ...chosen, q: text.trim() || chosen.q });
  };
  const pick = (s: Suggestion) => go(applySuggestion({ ...chosen, q: "" }, s));

  const prefCounts = prefectureCounts(EMPTY_FILTERS);
  const tCounts = typeCounts(EMPTY_FILTERS);
  const chosenCount = activeGroupCount(chosen);

  // Desktop preview of the newest properties with the map, as in the wireframe.
  const preview = useMemo(() => sortProperties(PROPERTIES, "newest").slice(0, 6), []);
  const [hovered, setHovered] = useState<string | null>(null);
  const previewRefs = useRef(new Map<string, HTMLElement>());
  const previewPane = useRef<HTMLDivElement>(null);
  const previewMap = useRef<HTMLDivElement>(null);
  const [drawPending, setDrawPending] = useState(false);
  const onDrawRequestHandled = useCallback(() => setDrawPending(false), []);

  // Draw your own area from the all-filters panel: keep the panel's other choices; a drawn area
  // replaces the location. Desktop draws on the preview map, mobile goes to the results map.
  const startDrawFromPanel = () => {
    const kept = { ...draft, q: "", pref: [], area: null, bbox: null };
    setFiltersOpen(false);
    if (isDesktop) {
      setChosen(kept);
      previewMap.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setDrawPending(true);
    } else router.push(searchHref(kept, { draw: "1" }));
  };

  return (
    <>
      <section className="bg-surface">
        <Container className="pb-8 pt-10 md:pb-10 md:pt-14">
          <h1 className="text-[32px] font-semibold leading-[1.15] tracking-tight md:text-[28px]">Find space for your business</h1>
          <p className="mt-3 text-[15px] text-muted-surface md:mt-2">Search warehouses, business parks and data centres across {MARKET.name}.</p>

          <form onSubmit={submit} role="search" className="mt-7 flex flex-col gap-3 md:mt-8 md:flex-row">
            <div className="relative md:flex-1">
              <label htmlFor="home-search" className="sr-only">
                Search {MARKET.regionLabel}, city or estate
              </label>
              <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="home-search"
                ref={inputRef}
                role="combobox"
                aria-expanded={suggestions.length > 0}
                aria-controls="home-suggestions"
                aria-autocomplete="list"
                autoComplete="off"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  if (!e.relatedTarget?.closest("#home-suggestions")) setFocused(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    document.querySelector<HTMLButtonElement>("#home-suggestions button")?.focus();
                  } else if (e.key === "Escape") {
                    // Handled here: closing the suggestions must not also cancel drawing on the preview map.
                    e.preventDefault();
                    setFocused(false);
                  }
                }}
                placeholder={`Search ${MARKET.regionLabel}, city or estate`}
                className="field h-14 w-full rounded-btn border border-line bg-white pl-12 pr-4 text-base placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink md:h-[72px]"
              />
              {suggestions.length > 0 && (
                <ul
                  id="home-suggestions"
                  role="listbox"
                  aria-label="Suggestions"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setFocused(false);
                      inputRef.current?.focus();
                    }
                    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                    e.preventDefault();
                    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
                    const i = items.indexOf(document.activeElement as HTMLButtonElement) + (e.key === "ArrowDown" ? 1 : -1);
                    if (i < 0) inputRef.current?.focus();
                    else items[Math.min(i, items.length - 1)].focus();
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget) && e.relatedTarget !== inputRef.current) setFocused(false);
                  }}
                  className="anim-pop absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-card border border-line bg-white py-2 shadow-panel"
                >
                  {suggestions.map((s) => (
                    <li key={`${s.kind}:${s.value}`} role="option" aria-selected="false">
                      <button type="button" onClick={() => pick(s)} className="focus-inset flex min-h-12 w-full items-center gap-3 px-4 text-left text-[15px] hover:bg-surface">
                        <Icon name={s.kind === "estate" ? "warehouse" : s.kind === "prefecture" ? "map" : "location_on"} className="text-muted" />
                        <span className="min-w-0 flex-1 truncate">{s.label}</span>
                        <span className="shrink-0 text-[13px] tabular-nums text-muted">
                          {s.kind === "estate" ? `estate · ${s.count}` : `${s.count} ${s.count === 1 ? "property" : "properties"}`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => {
                  setDraft({ ...chosen, q: text.trim() || chosen.q });
                  setPanelText(text);
                  setFiltersOpen(true);
                }}
                className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-btn border-[1.5px] border-ink bg-white px-6 text-base font-medium md:h-[72px] md:flex-none"
              >
                <Icon name="tune" />
                Filters
                {chosenCount > 0 && (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs leading-5 text-white">
                    <span className="sr-only">, </span>
                    {chosenCount}
                    <span className="sr-only"> active</span>
                  </span>
                )}
              </button>
              <button type="submit" className="inline-flex h-14 flex-[1.4] items-center justify-center rounded-btn bg-ink px-8 text-base font-medium text-white md:h-[72px] md:flex-none md:px-10">
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="hidden text-[13px] text-muted-surface md:inline">Popular searches</span>
            {POPULAR.map((p) => (
              <Link
                key={p.label}
                href={searchHref({ ...EMPTY_FILTERS, ...p.filters })}
                className="inline-flex h-9 items-center rounded-full border border-line bg-white px-3.5 text-[13px] hover:border-ink"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </Container>

        {/* Desktop: newest properties with the map */}
        {isDesktop && (
          <Container className="grid grid-cols-[minmax(0,1.53fr)_minmax(0,1fr)] gap-8 pb-10">
            <div ref={previewPane} className="thin-scrollbar -mx-1 h-[600px] overflow-y-auto px-1 py-1">
              <h2 className="sr-only">Newest properties</h2>
              <ul className="grid grid-cols-2 gap-5">
                {preview.map((p) => (
                  <li key={p.id} className="flex flex-col [&>article]:flex-1">
                    <PropertyCard
                      property={p}
                      active={hovered === p.id}
                      onHover={setHovered}
                      ref={(el) => {
                        if (el) previewRefs.current.set(p.id, el);
                        else previewRefs.current.delete(p.id);
                      }}
                    />
                  </li>
                ))}
              </ul>
              <div className="flex justify-center py-6">
                <Link href="/properties/search" className="inline-flex h-11 items-center gap-2 rounded-btn border border-ink bg-white px-5 text-sm font-medium">
                  View all {PROPERTIES.length} properties
                  <Icon name="arrow_forward" />
                </Link>
              </div>
            </div>
            <div ref={previewMap} className="h-[600px]">
              <FakeMap
                pins={preview}
                fitKey="first-visit"
                hoveredId={hovered}
                selectedId={null}
                onPinHover={setHovered}
                onPinClick={(id) => {
                  setHovered(id);
                  const card = previewRefs.current.get(id);
                  const pane = previewPane.current;
                  if (card && pane) pane.scrollTo({ top: pane.scrollTop + card.getBoundingClientRect().top - pane.getBoundingClientRect().top - 8, behavior: "smooth" });
                }}
                onSearchArea={(bbox) => go({ ...chosen, bbox })}
                onDrawArea={(area) => area && go({ ...chosen, q: "", pref: [], bbox: null, area })}
                drawRequested={drawPending}
                onDrawRequestHandled={onDrawRequestHandled}
                className="h-full rounded-card"
              />
            </div>
          </Container>
        )}
      </section>

      <section aria-labelledby="browse-pref" className="bg-white">
        <Container className="py-12 md:py-14">
          <h2 id="browse-pref" className="text-2xl font-semibold tracking-tight md:text-[26px]">
            Browse by {MARKET.regionLabel}
          </h2>
          <p className="mt-2 hidden text-[15px] text-muted md:block">
            Region labels change by market: prefectures in Japan, provinces in Korea and China, districts in Hong Kong and Singapore.
          </p>
          <ul className="mt-6 grid grid-cols-1 md:mt-8 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {PREFECTURES.map((p) => (
              <li key={p.id}>
                <Link
                  href={searchHref({ ...EMPTY_FILTERS, pref: [p.id] })}
                  className="group flex min-h-14 items-center justify-between border-b border-line text-base md:h-[100px] md:rounded-card md:border md:px-6 md:hover:border-ink"
                >
                  <span className="font-medium md:font-normal">{p.name}</span>
                  <span className="flex items-center gap-4 text-sm tabular-nums text-muted">
                    <span>
                      {prefCounts[p.id]}
                      <span className="sr-only"> properties</span>
                    </span>
                    <Icon name="arrow_forward" className="text-ink transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="browse-type" className="bg-white">
        <Container className="pb-14 md:pb-16">
          <h2 id="browse-type" className="text-2xl font-semibold tracking-tight md:text-[26px]">
            Browse by property type
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {BROWSE_TYPES.map((id) => {
              const t = PROPERTY_TYPES.find((x) => x.id === id)!;
              return (
                <li key={id}>
                  <Link href={searchHref({ ...EMPTY_FILTERS, type: [id] })} className="group block overflow-hidden rounded-card border border-line hover:border-ink">
                    <ImagePlaceholder className="aspect-[325/176] w-full" />
                    <span className="block px-5 py-4">
                      <span className="block text-[17px] font-medium">{t.plural}</span>
                      <span className="mt-1 block text-sm text-muted">{tCounts[id]} properties</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <AllFiltersPanel
        open={filtersOpen}
        variant={isSheet ? "fullsheet" : "modal"}
        draft={draft}
        onDraft={setDraft}
        text={panelText}
        onText={setPanelText}
        onClose={() => setFiltersOpen(false)}
        onStartDraw={startDrawFromPanel}
        footer={{
          resetLabel: "Clear all",
          onReset: () => {
            setDraft(EMPTY_FILTERS);
            setPanelText("");
          },
          count: countMatching(draft),
          onApply: () => {
            setChosen(draft);
            setFiltersOpen(false);
            go(draft);
          },
        }}
      />
    </>
  );
}
