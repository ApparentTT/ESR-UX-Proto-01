"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseFilters, parseSort, searchHref, type Filters, type SortId } from "./filters";

/** The URL is the single source of truth for applied filters and sort. */
export function useSearchState() {
  const sp = useSearchParams();
  const router = useRouter();
  const key = sp.toString();

  const filters = useMemo(() => parseFilters(new URLSearchParams(key)), [key]);
  const sort = useMemo(() => parseSort(new URLSearchParams(key)), [key]);

  const setFilters = useCallback(
    (f: Filters) => router.push(searchHref(f, { sort: sort === "newest" ? null : sort }), { scroll: false }),
    [router, sort],
  );
  const setSort = useCallback(
    (s: SortId) => router.replace(searchHref(filters, { sort: s === "newest" ? null : s }), { scroll: false }),
    [router, filters],
  );

  return { filters, sort, setFilters, setSort, queryKey: key, params: sp };
}
