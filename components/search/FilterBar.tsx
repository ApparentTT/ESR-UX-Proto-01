"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { PanelFrame } from "@/components/ui/PanelFrame";
import { AppliedChips } from "./AppliedChips";
import { LocationPanel } from "./panels/LocationPanel";
import { TypePanel } from "./panels/TypePanel";
import { SizePanel } from "./panels/SizePanel";
import { AvailabilityPanel } from "./panels/AvailabilityPanel";
import { AllFiltersPanel } from "./panels/AllFiltersPanel";
import { PREFECTURE_BY_ID } from "@/data/locations";
import {
  EMPTY_FILTERS,
  activeGroupCount,
  countMatching,
  displayQuery,
  groupCounts,
  type Filters,
} from "@/lib/filters";
import { SHEET_QUERY, useMediaQuery } from "@/lib/useMediaQuery";
import { MARKET } from "@/config/market";

export type PanelId = "location" | "type" | "size" | "avail" | "all";

type Props = {
  filters: Filters;
  onApply: (f: Filters) => void;
  openPanel: PanelId | null;
  onOpenPanel: (p: PanelId | null) => void;
  /** Mobile and tablet list/map toggle */
  view: "list" | "map";
  onToggleView: () => void;
};

const TITLES: Record<PanelId, string> = { location: "Location", type: "Property type", size: "Size", avail: "Availability", all: "All filters" };

/** Resets just the group a single panel owns. */
function resetGroup(f: Filters, p: PanelId): Filters {
  switch (p) {
    case "location":
      return { ...f, q: "", pref: [] };
    case "type":
      return { ...f, type: [] };
    case "size":
      return { ...f, min: null, max: null };
    case "avail":
      return { ...f, avail: null, pre: false };
    case "all":
      return EMPTY_FILTERS;
  }
}

export function locationSummary(f: Filters) {
  const names = [...(f.q ? [displayQuery(f.q)] : []), ...f.pref.map((p) => PREFECTURE_BY_ID[p].name)];
  return { text: names[0] ?? "", extra: Math.max(0, names.length - 1) };
}

export function FilterBar({ filters, onApply, openPanel, onOpenPanel, view, onToggleView }: Props) {
  const isSheet = useMediaQuery(SHEET_QUERY);
  const barRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<Filters>(filters);
  const [text, setText] = useState("");

  // Draft starts from the applied filters each time a panel opens. Closing without applying discards it.
  const open = useCallback(
    (p: PanelId | null) => {
      setDraft(filters);
      setText(filters.q ? displayQuery(filters.q) : "");
      onOpenPanel(p);
    },
    [filters, onOpenPanel],
  );
  const close = useCallback(() => onOpenPanel(null), [onOpenPanel]);
  const apply = useCallback(() => {
    onApply(draft);
    onOpenPanel(null);
  }, [draft, onApply, onOpenPanel]);

  // When a panel is opened from outside (prototype links), seed the draft.
  const lastOpen = useRef<PanelId | null>(null);
  useEffect(() => {
    if (openPanel && openPanel !== lastOpen.current) {
      setDraft(filters);
      setText(filters.q ? displayQuery(filters.q) : "");
    }
    lastOpen.current = openPanel;
  }, [openPanel, filters]);

  // Publish the sticky bar height for the results pane.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty("--bar-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const counts = groupCounts(filters);
  const groups = activeGroupCount(filters);
  const liveCount = countMatching(draft);
  const panelVariant = isSheet ? "sheet" : "popover";

  const footer = (p: PanelId) => ({
    resetLabel: p === "all" ? "Clear all" : isSheet ? "Clear" : "Reset",
    onReset: () => {
      setDraft((d) => resetGroup(d, p));
      if (p === "location" || p === "all") setText("");
    },
    count: liveCount,
    onApply: apply,
  });

  const loc = locationSummary(filters);
  const locationRef = useRef<HTMLDivElement>(null);
  const locationInput = useRef<HTMLInputElement>(null);
  const sheetInput = useRef<HTMLInputElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const availRef = useRef<HTMLDivElement>(null);

  const locationPanel = (
    <PanelFrame
      open={openPanel === "location"}
      variant={panelVariant}
      title="Location"
      onClose={close}
      anchorRef={locationRef}
      initialFocusRef={isSheet ? sheetInput : locationInput}
      footer={footer("location")}
      width={420}
    >
      <LocationPanel
        draft={draft}
        onDraft={setDraft}
        text={text}
        onText={setText}
        showSearchInput={isSheet}
        inputRef={isSheet ? sheetInput : locationInput}
      />
    </PanelFrame>
  );

  const pill = (p: Exclude<PanelId, "location" | "all">, ref: React.RefObject<HTMLDivElement | null>, count: number, body: React.ReactNode, width: number) => (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={openPanel === p}
        onClick={() => (openPanel === p ? close() : open(p))}
        className={`inline-flex h-11 items-center gap-2 rounded-btn border bg-white pl-3.5 pr-2.5 text-sm transition-colors hover:border-ink ${
          openPanel === p || count ? "border-ink" : "border-line"
        } ${openPanel === p ? "bg-surface" : ""}`}
      >
        {TITLES[p]}
        {count > 0 && (
          <span className="tabular-nums text-muted">
            <span className="sr-only">, </span>
            {count}
            <span className="sr-only"> selected</span>
          </span>
        )}
        <Icon name={openPanel === p ? "keyboard_arrow_up" : "keyboard_arrow_down"} />
      </button>
      <PanelFrame open={openPanel === p} variant={panelVariant} title={TITLES[p]} onClose={close} anchorRef={ref} footer={footer(p)} width={width}>
        {body}
      </PanelFrame>
    </div>
  );

  const typePill = pill("type", typeRef, counts.type, <TypePanel draft={draft} onDraft={setDraft} />, 360);
  const sizePill = pill("size", sizeRef, counts.size, <SizePanel draft={draft} onDraft={setDraft} />, 380);
  const availPill = pill("avail", availRef, counts.avail, <AvailabilityPanel draft={draft} onDraft={setDraft} />, 340);

  const filtersButton = (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={openPanel === "all"}
      onClick={() => open("all")}
      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-btn border-[1.5px] border-ink bg-white px-3.5 text-sm font-medium"
    >
      <Icon name="tune" />
      Filters
      {groups > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs leading-5 text-white tabular-nums">
          <span className="sr-only">, </span>
          {groups}
          <span className="sr-only"> active</span>
        </span>
      )}
    </button>
  );

  const clearLocation = () => onApply({ ...filters, q: "", pref: [] });

  return (
    <div ref={barRef} className="sticky top-0 z-30 border-b border-line bg-white">
      <Container className="py-3 md:py-5">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Location: real combobox on tablet and desktop, sheet trigger on mobile */}
          <div ref={locationRef} className="relative min-w-0 flex-1 md:w-[340px] md:flex-none">
            {isSheet ? (
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={openPanel === "location"}
                onClick={() => open("location")}
                className="flex h-12 w-full items-center gap-2.5 rounded-btn border border-line bg-white pl-3.5 pr-3 text-left text-[15px]"
              >
                <Icon name="search" className="text-muted" />
                <span className={`min-w-0 flex-1 truncate ${loc.text ? "" : "text-muted"}`}>{loc.text || `Search ${MARKET.regionLabel}, city or estate`}</span>
                {loc.extra > 0 && <span className="text-sm text-muted">+{loc.extra}</span>}
              </button>
            ) : (
              <>
                <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-muted" />
                <input
                  ref={locationInput}
                  role="combobox"
                  aria-label="Location"
                  aria-expanded={openPanel === "location"}
                  aria-controls="location-suggestions"
                  aria-autocomplete="list"
                  autoComplete="off"
                  value={openPanel === "location" ? text : loc.text + (loc.extra ? ` +${loc.extra}` : "")}
                  placeholder={`Search ${MARKET.regionLabel}, city or estate`}
                  onFocus={() => openPanel !== "location" && open("location")}
                  onClick={() => openPanel !== "location" && open("location")}
                  onChange={(e) => {
                    if (openPanel !== "location") open("location");
                    setText(e.target.value);
                    setDraft((d) => ({ ...d, q: e.target.value.trim() }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      apply();
                      locationInput.current?.blur();
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      document.getElementById("location-suggestions")?.querySelector("button")?.focus();
                    }
                  }}
                  className="field h-11 w-full rounded-btn border border-line bg-white pl-11 pr-10 text-[15px] placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                />
                {(loc.text || (openPanel === "location" && text)) && (
                  <button
                    type="button"
                    aria-label="Clear location"
                    onClick={() => {
                      if (openPanel === "location") {
                        setText("");
                        setDraft((d) => ({ ...d, q: "", pref: [] }));
                        locationInput.current?.focus();
                      } else clearLocation();
                    }}
                    className="absolute right-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-btn text-muted hover:text-ink"
                  >
                    <Icon name="close" size={18} />
                  </button>
                )}
              </>
            )}
            {locationPanel}
          </div>

          {/* Mobile list/map toggle sits beside the field */}
          <button
            type="button"
            onClick={onToggleView}
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-btn border border-line bg-white px-3.5 text-[15px] md:h-11 md:text-sm lg:hidden"
          >
            <Icon name={view === "list" ? "map" : "list"} />
            {view === "list" ? "Map" : "List"}
          </button>

          {/* Tablet and desktop pills */}
          {!isSheet && (
            <>
              <div className="flex items-center gap-2.5">
                {typePill}
                {sizePill}
                {availPill}
              </div>
              <div className="hidden flex-1 lg:block" />
              <div className="flex items-center gap-2.5">
                <button
              type="button"
              aria-disabled="true"
              title="Saved searches are not part of this prototype"
              className="hidden h-11 items-center gap-2 rounded-btn border border-line bg-white px-3.5 text-sm lg:inline-flex"
            >
              <Icon name="bookmark_add" />
              Save search
                </button>
                {filtersButton}
              </div>
            </>
          )}
        </div>

        {/* Mobile row 2: Filters + dropdown pills, scrolls sideways */}
        {isSheet && (
          <div className="no-scrollbar -mx-6 mt-2.5 flex items-center gap-2 overflow-x-auto px-6">
            {filtersButton}
            {typePill}
            {sizePill}
            {availPill}
          </div>
        )}

        <AppliedChips filters={filters} onApply={onApply} />
      </Container>

      <AllFiltersPanel
        open={openPanel === "all"}
        variant={isSheet ? "fullsheet" : "modal"}
        draft={draft}
        onDraft={setDraft}
        text={text}
        onText={setText}
        onClose={close}
        footer={footer("all")}
      />
    </div>
  );
}
