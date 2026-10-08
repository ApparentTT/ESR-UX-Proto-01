"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LOAD_DELAY_MS, PAGE_SIZE } from "@/config/prototype";

/** Reveals results PAGE_SIZE at a time with a simulated network delay. Resets when resetKey changes. */
export function useInfiniteBatches(total: number, resetKey: string, initialBatches = 1) {
  const [state, setState] = useState({ key: resetKey, visible: PAGE_SIZE * initialBatches });
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset synchronously during render when the search changes, so stale counts never flash.
  let visible = state.visible;
  if (state.key !== resetKey) {
    visible = PAGE_SIZE;
    setState({ key: resetKey, visible });
  }

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(false);
  }, [resetKey]);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const shown = Math.min(visible, total);
  const hasMore = shown < total;

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    timer.current = setTimeout(() => {
      setState((s) => ({ ...s, visible: s.visible + PAGE_SIZE }));
      setLoading(false);
    }, LOAD_DELAY_MS);
  }, [loading, hasMore]);

  return { shown, hasMore, loading, loadMore };
}
