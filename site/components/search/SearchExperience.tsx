"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FilterBar, type PanelId } from "./FilterBar";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsList } from "./ResultsList";
import { FakeMap } from "./FakeMap";
import { MapCarousel, CAROUSEL_HEIGHT } from "./MapCarousel";
import { EmptyState } from "./EmptyState";
import { EMPTY_FILTERS, filterProperties, filterSummary, nearbyProperties, scopeLabel, sortProperties, type Bbox } from "@/lib/filters";
import { useSearchState } from "@/lib/useSearchState";
import { useInfiniteBatches } from "@/lib/useInfiniteBatches";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { pageScale } from "@/lib/pageScale";

const PROTOTYPE_PARAMS = ["panel", "view", "demo", "draw"];

export function SearchExperience() {
  const { filters, sort, setFilters, setSort, params } = useSearchState();
  const router = useRouter();
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);

  // Prototype deep links: ?panel=all|location|type|size|avail opens a panel, ?view=map opens the
  // mobile map, ?demo=scrolled jumps to the infinite-scroll loading state. Read once, then stripped so the URL only ever carries the search itself.
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const [demoScrolled, setDemoScrolled] = useState(false);
  const panelParam = params.get("panel");
  const viewParam = params.get("view");
  const demoParam = params.get("demo");
  useEffect(() => {
    if (!panelParam && !viewParam && !demoParam) return;
    if (panelParam && ["all", "location", "type", "size", "avail"].includes(panelParam)) setOpenPanel(panelParam as PanelId);
    if (viewParam === "map") setView("map");
    if (viewParam === "list") setView("list");
    if (demoParam === "scrolled") setDemoScrolled(true);
    const next = new URLSearchParams(params.toString());
    PROTOTYPE_PARAMS.forEach((k) => next.delete(k));
    const qs = next.toString().replace(/%2C/gi, ",");
    router.replace(`/properties/search${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [panelParam, viewParam, demoParam, params, router]);

  // Prototype params never change the search, so they are left out of the reset key.
  const queryKey = useMemo(() => {
    const k = new URLSearchParams(params.toString());
    PROTOTYPE_PARAMS.forEach((p) => k.delete(p));
    return k.toString();
  }, [params]);

  const results = useMemo(() => sortProperties(filterProperties(filters), sort), [filters, sort]);
  const total = results.length;
  const { shown, hasMore, loading, loadMore } = useInfiniteBatches(total, queryKey);
  const visible = useMemo(() => results.slice(0, shown), [results, shown]);
  const isEmpty = total === 0;
  const nearby = useMemo(() => (isEmpty ? nearbyProperties(filters) : []), [isEmpty, filters]);

  const paneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const onHover = useCallback((id: string | null) => setHoveredId(id), []);

  // A new search clears the selection.
  const [selKey, setSelKey] = useState(queryKey);
  if (selKey !== queryKey) {
    setSelKey(queryKey);
    setSelectedId(null);
  }

  // Clicking a pin selects it. On desktop its card moves to the top of the list and expands across both columns
  // (see the effect below); elsewhere the card is outlined and scrolled into view.
  const expandedId = isDesktop ? selectedId : null;
  const clearSelection = useCallback(() => setSelectedId(null), []);
  // Bumped on every pin click, so pressing the selected pin again brings its card back into view.
  const [pinTick, setPinTick] = useState(0);
  const onPinClick = useCallback(
    (id: string) => {
      setSelectedId(id);
      setPinTick((t) => t + 1);
      if (isDesktop) return;
      cardRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    [isDesktop],
  );

  // Once the selected card has moved to the top and expanded, scroll the list so it is in view.
  useEffect(() => {
    if (!expandedId) return;
    const card = cardRefs.current.get(expandedId);
    const pane = paneRef.current;
    if (!card || !pane) return;
    const top = pane.scrollTop + (card.getBoundingClientRect().top - pane.getBoundingClientRect().top) / pageScale() - 8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pane.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, [expandedId, pinTick]);

  // Escape collapses the expanded card. On window, so drawing on the map and open panels handle Escape first.
  useEffect(() => {
    if (!expandedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || document.querySelector('[role="dialog"]')) return;
      setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId]);

  // Search this area and a drawn area are both "where": the newer one replaces the older.
  const onSearchArea = useCallback((bbox: Bbox) => setFilters({ ...filters, bbox, area: null }), [filters, setFilters]);

  // Bring the map fully into view under the sticky bar: on desktop the results pane sits
  // directly beneath it, on mobile and tablet the map view fills the screen below it.
  const parkResults = useCallback(() => {
    const pane = paneRef.current;
    if (window.matchMedia(DESKTOP_QUERY).matches && pane) {
      const barH =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--bar-h")) ||
        document.querySelector<HTMLElement>("[data-filter-bar]")?.offsetHeight ||
        0;
      window.scrollTo({ top: pane.getBoundingClientRect().top + window.scrollY - barH - 16 });
    } else {
      const main = document.getElementById("main");
      if (main) window.scrollTo({ top: main.offsetTop });
    }
  }, []);

  const parkResultsRef = useRef(parkResults);
  parkResultsRef.current = parkResults;



  // ?demo=scrolled: park the filter bar at the top, load a second batch, then scroll the list to its end so
  // the next batch starts loading with skeletons and Back to top showing.
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;
  const demoRan = useRef(false);
  useEffect(() => {
    if (!demoScrolled || demoRan.current) return;
    demoRan.current = true;
    const t1 = setTimeout(() => loadMoreRef.current(), 50);
    const t2 = setTimeout(() => {
      const pane = paneRef.current;
      if (window.matchMedia(DESKTOP_QUERY).matches && pane) {
        // Park the pane just under the sticky bar so it sits fully in view, then run the list to its end.
        parkResults();
        pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
      }
      else window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight * 1.8, behavior: "smooth" });
    }, 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      demoRan.current = false;
    };
  }, [demoScrolled, parkResults]);

  const title = isEmpty ? "No properties match these filters" : `${total.toLocaleString("en-US")} ${total === 1 ? "property" : "properties"} ${scopeLabel(filters)}`;
  const subtitle = isEmpty ? filterSummary(filters) : `Showing ${shown} of ${total}${hasMore ? " · scroll for more" : ""}`;
  const pins = isEmpty ? nearby : visible;
  const showMobileMap = !isDesktop && view === "map";
  // Lets the fixed Prototype badge lift clear of the mobile map carousel.
  useEffect(() => {
    if (!showMobileMap) return;
    document.documentElement.dataset.mobileMap = "1";
    return () => {
      delete document.documentElement.dataset.mobileMap;
    };
  }, [showMobileMap]);
  const paneHeight = "h-[calc(var(--full-h)-var(--bar-h,0px)-32px)] min-h-[520px]";

  const map = (
    <FakeMap
      pins={pins}
      fitKey={queryKey}
      hoveredId={hoveredId}
      selectedId={selectedId}
      onPinClick={onPinClick}
      onMapClick={isDesktop ? clearSelection : undefined}
      onPinHover={setHoveredId}
      onSearchArea={onSearchArea}
      area={filters.area}
      bottomInset={showMobileMap ? CAROUSEL_HEIGHT : 0}
      className={showMobileMap ? "h-[calc(var(--full-h)-var(--bar-h,0px))] min-h-[480px]" : "h-full rounded-card"}
    >
      {showMobileMap && pins.length > 0 && <MapCarousel items={pins} selectedId={selectedId ?? hoveredId} onCentre={setSelectedId} onNearEnd={loadMore} />}
    </FakeMap>
  );

  return (
    <>
      <FilterBar
        filters={filters}
        onApply={setFilters}
        openPanel={openPanel}
        onOpenPanel={setOpenPanel}
        view={view}
        onToggleView={() => {
          setView((v) => (v === "list" ? "map" : "list"));
          // Park the sticky bar at the top so the map or list fills the screen below it.
          const main = document.getElementById("main");
          if (main) window.scrollTo({ top: main.offsetTop });
        }}
      />
      {/* The mobile map view opts out of scroll anchoring: when the chip row appears or goes after
          drawing, the page must stay parked with the map directly under the sticky bar. */}
      <section data-results className={`bg-surface ${showMobileMap ? "[overflow-anchor:none]" : ""}`} aria-label="Search results">
        {showMobileMap ? (
          <>
            <h1 className="sr-only">{title}</h1>
            {map}
          </>
        ) : (
          <>
            <Container>
              <ResultsHeader title={title} subtitle={subtitle} sort={sort} onSort={setSort} />
            </Container>
            <Container className="pb-8 lg:grid lg:grid-cols-[minmax(0,1.53fr)_minmax(0,1fr)] lg:gap-8">
              <div
                ref={paneRef}
                data-results-pane
                className={`thin-scrollbar lg:-mx-1 lg:overflow-y-auto lg:overscroll-contain lg:px-1 lg:py-1 ${isDesktop ? paneHeight : ""}`}
              >
                {isEmpty ? (
                  <EmptyState
                    nearby={nearby}
                    onClearAll={() => setFilters(EMPTY_FILTERS)}
                    cardRefs={cardRefs}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    expandedId={expandedId}
                    onCloseExpanded={clearSelection}
                    onHover={onHover}
                  />
                ) : (
                  <ResultsList
                    items={visible}
                    hasMore={hasMore}
                    loading={loading}
                    onLoadMore={loadMore}
                    scrollMode={isDesktop ? "pane" : "page"}
                    paneRef={paneRef}
                    cardRefs={cardRefs}
                    hoveredId={hoveredId}
                    selectedId={selectedId}
                    expandedId={expandedId}
                    onCloseExpanded={clearSelection}
                    onHover={onHover}
                  />
                )}
              </div>
              {isDesktop && <div className={paneHeight}>{map}</div>}
            </Container>
          </>
        )}
      </section>
    </>
  );
}
