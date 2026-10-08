"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FilterBar, type PanelId } from "./FilterBar";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsList } from "./ResultsList";
import { filterProperties, scopeLabel, sortProperties } from "@/lib/filters";
import { useSearchState } from "@/lib/useSearchState";
import { useInfiniteBatches } from "@/lib/useInfiniteBatches";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

export function SearchExperience() {
  const { filters, sort, setFilters, setSort, params } = useSearchState();
  const router = useRouter();
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);

  // Prototype deep links: ?panel=all|location|type|size|avail opens a panel, ?view=map opens the mobile map.
  // Both are read once and stripped so the URL only ever carries the search itself.
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const panelParam = params.get("panel");
  const viewParam = params.get("view");
  useEffect(() => {
    if (!panelParam && !viewParam) return;
    if (panelParam && ["all", "location", "type", "size", "avail"].includes(panelParam)) setOpenPanel(panelParam as PanelId);
    if (viewParam === "map") setView("map");
    const next = new URLSearchParams(params.toString());
    next.delete("panel");
    next.delete("view");
    const qs = next.toString();
    router.replace(`/properties/search${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [panelParam, viewParam, params, router]);

  // Panel and view params never change the search, so they are left out of the reset key.
  const queryKey = useMemo(() => {
    const k = new URLSearchParams(params.toString());
    k.delete("panel");
    k.delete("view");
    return k.toString();
  }, [params]);

  const results = useMemo(() => sortProperties(filterProperties(filters), sort), [filters, sort]);
  const total = results.length;
  const { shown, hasMore, loading, loadMore } = useInfiniteBatches(total, queryKey);
  const visible = useMemo(() => results.slice(0, shown), [results, shown]);

  const paneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId] = useState<string | null>(null);
  const onHover = useCallback((id: string | null) => setHoveredId(id), []);

  const title = `${total.toLocaleString("en-US")} ${total === 1 ? "property" : "properties"} ${scopeLabel(filters)}`;
  const subtitle = `Showing ${shown} of ${total}${hasMore ? " · scroll for more" : ""}`;

  return (
    <>
    <FilterBar
      filters={filters}
      onApply={setFilters}
      openPanel={openPanel}
      onOpenPanel={setOpenPanel}
      view={view}
      onToggleView={() => setView((v) => (v === "list" ? "map" : "list"))}
    />
    <section className="bg-surface" aria-label="Search results">
      <Container>
        <ResultsHeader title={title} subtitle={subtitle} sort={sort} onSort={setSort} />
      </Container>
      <Container className="pb-8 lg:grid lg:grid-cols-[minmax(0,1.53fr)_minmax(0,1fr)] lg:gap-8">
        <div
          ref={paneRef}
          className="thin-scrollbar scroll-mt-[var(--bar-h,0px)] lg:-mx-1 lg:h-[calc(100dvh-var(--bar-h,0px)-32px)] lg:min-h-[520px] lg:overflow-y-auto lg:overscroll-contain lg:px-1 lg:py-1"
        >
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
            onHover={onHover}
          />
        </div>
        <div className="hidden lg:block lg:h-[calc(100dvh-var(--bar-h,0px)-32px)] lg:min-h-[520px]">
          <div className="h-full rounded-card bg-line" />
        </div>
      </Container>
    </section>
    </>
  );
}
