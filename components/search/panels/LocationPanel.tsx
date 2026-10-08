"use client";

import { forwardRef, useRef } from "react";
import { PREFECTURES } from "@/data/locations";
import { displayQuery, isKnownPlace, locationSuggestions, prefectureCounts, type Filters, type Suggestion } from "@/lib/filters";
import { CheckboxRow, TogglePill } from "@/components/ui/Controls";
import { Icon } from "@/components/ui/Icon";
import { MARKET, regionLabelTitle } from "@/config/market";

type Props = {
  draft: Filters;
  onDraft: (f: Filters) => void;
  /** Current typed text (may differ from draft.q while typing) */
  text: string;
  onText: (t: string) => void;
  /** Sheets and the all-filters panel carry their own search input; the desktop dropdown uses the field in the bar. */
  showSearchInput?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  layout?: "list" | "pills";
  /** id used by the bar's combobox for aria-controls */
  listboxId?: string;
  /** Close the panel and start drawing on the map */
  onStartDraw?: () => void;
};

const KIND_ICON: Record<Suggestion["kind"], string> = { city: "location_on", ward: "location_on", prefecture: "map", estate: "warehouse" };

/** Picking a place replaces any drawn area. */
export function applySuggestion(draft: Filters, s: Suggestion): Filters {
  if (s.kind === "prefecture") {
    const id = PREFECTURES.find((p) => p.name === s.value)!.id;
    return { ...draft, q: "", area: null, pref: draft.pref.includes(id) ? draft.pref : [...draft.pref, id] };
  }
  return { ...draft, q: s.value, area: null };
}

export function LocationPanel({ draft, onDraft, text, onText, showSearchInput, inputRef, layout = "list", listboxId = "location-suggestions", onStartDraw }: Props) {
  const drawOptionRef = useRef<HTMLButtonElement>(null);
  const removeArea = () => {
    onDraft({ ...draft, area: null });
    // The row (and its Remove button) disappears; keep focus inside the panel.
    requestAnimationFrame(() => (drawOptionRef.current ?? inputRef?.current)?.focus());
  };
  const suggestions = locationSuggestions(text, draft);
  // Once a known place is picked, the field shows its name; hide the suggestion list until the user types again.
  const picked = isKnownPlace(draft.q) && text.trim().toLowerCase() === displayQuery(draft.q).toLowerCase();
  const counts = prefectureCounts(draft);
  const togglePref = (id: (typeof PREFECTURES)[number]["id"], on: boolean) =>
    onDraft({ ...draft, area: null, pref: on ? [...draft.pref, id] : draft.pref.filter((p) => p !== id) });

  const pick = (s: Suggestion) => {
    onDraft(applySuggestion(draft, s));
    onText(s.kind === "prefecture" ? "" : s.label);
  };

  const onListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === "ArrowDown" ? i + 1 : i - 1;
    if (next < 0) inputRef?.current?.focus();
    else items[Math.min(next, items.length - 1)]?.focus();
  };

  return (
    <div>
      {showSearchInput && (
        <div className="mb-4">
          <label htmlFor="location-search" className="block text-[15px] font-medium">
            Search
          </label>
          <p className="mt-0.5 text-[13px] text-muted">Cities, wards and named estates</p>
          <div className="relative mt-3">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="location-search"
              ref={inputRef}
              type="search"
              autoComplete="off"
              value={text}
              placeholder={`Search ${MARKET.regionLabel}, city or estate`}
              onChange={(e) => {
                onText(e.target.value);
                onDraft({ ...draft, q: e.target.value.trim(), area: e.target.value.trim() ? null : draft.area });
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  document.getElementById(listboxId)?.querySelector("button")?.focus();
                }
              }}
              aria-controls={listboxId}
              className="field h-12 w-full rounded-btn border border-line bg-white pl-11 pr-3 text-[15px] placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>
        </div>
      )}

      {text.trim().length >= 2 && !picked && (
        <section aria-label="Suggestions" className="mb-2">
          <h3 className="mb-1 text-[13px] text-muted">Suggestions</h3>
          {suggestions.length ? (
            <ul id={listboxId} onKeyDown={onListKey} className="-mx-2">
              {suggestions.map((s) => (
                <li key={`${s.kind}:${s.value}`}>
                  <button
                    type="button"
                    onClick={() => pick(s)}
                    className="focus-inset flex min-h-11 w-full items-center gap-3 rounded-btn px-2 py-2 text-left text-[15px] hover:bg-surface"
                  >
                    <Icon name={KIND_ICON[s.kind]} className="text-muted" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{s.label}</span>
                    </span>
                    <span className="shrink-0 text-[13px] tabular-nums text-muted">
                      {s.kind === "estate" ? `estate · ${s.count}` : `${s.count} ${s.count === 1 ? "property" : "properties"}`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-2 text-sm text-muted">No cities, wards or estates match “{text.trim()}”.</p>
          )}
          <div className="mt-3 border-t border-line" />
        </section>
      )}

      {draft.area && (
        <div className="mb-3 flex min-h-11 items-center gap-3 rounded-btn bg-surface px-3 text-[15px]">
          <Icon name="gesture" />
          <span className="flex-1">Drawn area on the map</span>
          <button type="button" onClick={removeArea} className="rounded-btn px-1 py-1 text-sm text-muted-surface underline hover:text-ink">
            Remove
          </button>
        </div>
      )}

      <section aria-labelledby="browse-region">
        <div className="mb-1 mt-2 flex items-baseline justify-between gap-3">
          <h3 id="browse-region" className="text-[13px] text-muted">
            Browse by {MARKET.regionLabel}
          </h3>
          <span className="text-[13px] text-muted">{MARKET.name}</span>
        </div>
        {layout === "pills" ? (
          <div className="mt-2 flex flex-wrap gap-2.5">
            {PREFECTURES.map((p) => (
              <TogglePill key={p.id} label={p.name} count={counts[p.id]} pressed={draft.pref.includes(p.id)} onClick={() => togglePref(p.id, !draft.pref.includes(p.id))} />
            ))}
          </div>
        ) : (
          <fieldset>
            <legend className="sr-only">{regionLabelTitle}</legend>
            {PREFECTURES.map((p) => (
              <CheckboxRow key={p.id} label={p.name} count={counts[p.id]} checked={draft.pref.includes(p.id)} onChange={(on) => togglePref(p.id, on)} />
            ))}
          </fieldset>
        )}
      </section>

      {onStartDraw && (
        <div className="mt-3 border-t border-line pt-2">
          <DrawAreaOption ref={drawOptionRef} onClick={onStartDraw} redraw={!!draft.area} />
        </div>
      )}
    </div>
  );
}

/** Closes the panel and puts the map into drawing mode. */
export const DrawAreaOption = forwardRef<HTMLButtonElement, { onClick: () => void; redraw?: boolean }>(function DrawAreaOption({ onClick, redraw }, ref) {
  return (
    <button ref={ref} type="button" onClick={onClick} className="-mx-2 flex min-h-11 w-[calc(100%+16px)] items-center gap-3 rounded-btn px-2 text-left text-[15px] hover:bg-surface">
      <Icon name="gesture" />
      <span className="flex-1">{redraw ? "Redraw your area on the map" : "Draw your own area on the map"}</span>
      <Icon name="arrow_forward" className="text-muted" />
    </button>
  );
});
