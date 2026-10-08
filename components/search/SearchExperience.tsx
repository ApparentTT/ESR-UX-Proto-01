"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ResultsHeader } from "./ResultsHeader";
import { ResultsList } from "./ResultsList";
import { filterProperties, scopeLabel, sortProperties } from "@/lib/filters";
import { useSearchState } from "@/lib/useSearchState";
import { useInfiniteBatches } from "@/lib/useInfiniteBatches";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

export function SearchExperience() {
  const { filters, sort, setSort, queryKey } = useSearchState();
  const isDesktop = useMediaQuery(DESKTOP_QUERY, true);

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
  );
}
