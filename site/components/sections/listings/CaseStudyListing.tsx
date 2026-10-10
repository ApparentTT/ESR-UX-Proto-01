"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Section, type SectionBg } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FilterDropdown, type DropdownOption } from "@/components/ui/FilterDropdown";
import { AppliedChip } from "@/components/ui/Tag";
import { HIT, PAD, T } from "@/components/ui/type";
import { MediaCardList } from "@/components/sections/cards/MediaCardGrid";
import { CaseStudyCard, type CaseStudyCardData } from "./CaseStudyCard";
import { MultiFilterDropdown } from "./MultiFilterDropdown";

/* ------------------------------------------------------------------------------------------------
 * Props
 * ---------------------------------------------------------------------------------------------- */

/** SCS §2: Country filter + count, 3-up ListingCard grid, "Load more case studies". */
export type ScsListingProps = {
  variant: "caseStudies";
  cards: CaseStudyCardData[];
  /** Country dropdown. Options match the country after the "·" in each card eyebrow (by label). */
  filter: { label: string; allLabel: string; options: DropdownOption[] };
  /** Count line; "{n}" becomes the number of cards shown ("Showing {n} of XX case studies") */
  countText: string;
  /** Shown in the grid area when the filter matches nothing */
  emptyText: string;
  /** Appends the card set again on each click, then hides after `maxLoads` clicks (default 2) */
  loadMore?: { label: string; maxLoads?: number };
  /** The band has no visible heading: name it for assistive tech */
  ariaLabel?: string;
  /** Card titles: h2 when the listing follows the page h1 directly (SCS), h3 under a section h2 */
  cardHeadingLevel?: "h2" | "h3";
  bg?: SectionBg;
  id?: string;
};

/** One CAP case-study card (MediaCard `case`). `meta` is verbatim: "Theme  ·  Market". */
export type CapCaseStudy = {
  title: string;
  meta: string;
  href: string | null;
  /** Not in the wireframe. Cards without one are never excluded by an Asset type filter. */
  assetType?: string;
};

export type CapFilterKey = "theme" | "market" | "assetType";

/** CAP §2–3: "Case studies" heading, Theme / Market / Asset type + pill chips + Sort, results line + "Clear all", 3-up grid. */
export type CapListingProps = {
  variant: "capCaseStudies";
  title: string;
  cards: CapCaseStudy[];
  /** Multi-select triggers, in order. Option labels match the card meta (theme before the "·", market after it). */
  filters: { key: CapFilterKey; label: string; options: DropdownOption[] }[];
  /** Sort trigger ("Sort · Newest first"). The first option is the data order; any other reverses it. */
  sort: { label: string; options: DropdownOption[] };
  /** Designed state on load: applied chips (option ids) and sort. Cards are filtered only after the first change. */
  initial?: Partial<Record<CapFilterKey, string[]>> & { sort?: string };
  /** "{n}" becomes the number of cards shown ("Showing {n} of 24 case studies") */
  countText: string;
  clearAllLabel: string;
  emptyText: string;
  bg?: SectionBg;
  id?: string;
};

export type CaseStudyListingProps = ScsListingProps | CapListingProps;

/**
 * B32 ListingSection for case studies.
 * - `caseStudies` (SCS §2): surface band 80/80, gap 32. Filter bar (Country, spacer, count), 3 x ListingCard
 *   (gap 24; 2 columns at 768, 1 at 390), "Load more case studies" (outlineDark) centred. Filters client-side
 *   on the eyebrow's country; Load more appends the set again and moves focus to the first new card.
 * - `capCaseStudies` (CAP §2–3, sections 2 and 3 merged): grey band 72/72, gap 64. Heading Medium 24, the
 *   filter block (bar, 1px divider, results line + "Clear all"), then a 3-up MediaCard `case` grid (row gap 64).
 *   Loads in the designed state (chips "Active management", "Japan"; all 6 cards; "Showing 6 of 24"), and
 *   filters on the card meta after the first interaction.
 * The filter bars wrap on narrow screens (never a scroll container, so the menus are not clipped).
 */
export function CaseStudyListing(props: CaseStudyListingProps) {
  return props.variant === "caseStudies" ? <ScsListing {...props} /> : <CapListing {...props} />;
}

const fill = (text: string, n: number) => text.replace("{n}", String(n));
const afterDot = (s: string) => s.split("·").pop()?.trim() ?? "";
const beforeDot = (s: string) => s.split("·")[0]?.trim() ?? "";
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/* ------------------------------------------------------------------------------------------------
 * SCS
 * ---------------------------------------------------------------------------------------------- */

function ScsListing({ cards, filter, countText, emptyText, loadMore, ariaLabel = "Case studies", cardHeadingLevel = "h2", bg = "surface", id }: ScsListingProps) {
  const [country, setCountry] = useState<string | null>(null);
  const [loads, setLoads] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const focusFrom = useRef<number | null>(null);

  const countryLabel = filter.options.find((o) => o.id === country)?.label;
  const matching = countryLabel ? cards.filter((c) => same(afterDot(c.eyebrow), countryLabel)) : cards;
  const pages = Array.from({ length: loads + 1 }, () => matching);
  const shown = pages.flat();
  const maxLoads = loadMore?.maxLoads ?? 2;
  const canLoad = !!loadMore && matching.length > 0 && loads < maxLoads;

  // After "Load more", move keyboard focus to the first appended card.
  useEffect(() => {
    if (focusFrom.current === null) return;
    const link = listRef.current?.children[focusFrom.current]?.querySelector<HTMLElement>("a");
    focusFrom.current = null;
    link?.focus();
  }, [loads]);

  const onLoadMore = () => {
    focusFrom.current = shown.length;
    setLoads((l) => l + 1);
  };

  return (
    <Section bg={bg} id={id} aria-label={ariaLabel} className={PAD.data} containerClassName="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-3">
        <div role="group" aria-label="Filter case studies" className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            label={filter.label}
            allLabel={filter.allLabel}
            options={filter.options}
            value={country}
            onChange={(v) => {
              setCountry(v);
              setLoads(0);
            }}
          />
        </div>
        <p aria-live="polite" className="text-[14px] font-medium leading-[1.45] text-ink md:text-right md:text-[15px]">
          {fill(countText, shown.length)}
        </p>
      </div>

      {shown.length > 0 ? (
        <ul ref={listRef} role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {pages.map((set, p) =>
            set.map((c, i) => (
              <li key={`${p}-${i}`} className={p > 0 ? "anim-fade" : ""}>
                <CaseStudyCard {...c} headingLevel={cardHeadingLevel} />
              </li>
            )),
          )}
        </ul>
      ) : (
        <p className="py-6 text-[15px] leading-[1.45] text-muted-surface">{emptyText}</p>
      )}

      {loadMore && canLoad && (
        <div className="flex justify-center">
          <Button variant="outlineDark" onClick={onLoadMore} className="w-full md:w-auto">
            {loadMore.label}
          </Button>
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * CAP
 * ---------------------------------------------------------------------------------------------- */

type Applied = Record<CapFilterKey, string[]>;

function CapListing({ title, cards, filters, sort, initial, countText, clearAllLabel, emptyText, bg = "surface", id }: CapListingProps) {
  const headingId = useId();
  const [applied, setApplied] = useState<Applied>({
    theme: initial?.theme ?? [],
    market: initial?.market ?? [],
    assetType: initial?.assetType ?? [],
  });
  const [sortId, setSortId] = useState<string>(initial?.sort ?? sort.options[0]?.id ?? "");
  // The designed state shows chips that do not match the cards: filter only after the user changes something.
  const [touched, setTouched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const labelOf = (key: CapFilterKey, optionId: string) => filters.find((f) => f.key === key)?.options.find((o) => o.id === optionId)?.label ?? optionId;

  const update = (next: Applied) => {
    setApplied(next);
    setTouched(true);
  };
  const toggle = (key: CapFilterKey, optionId: string) => {
    const cur = applied[key];
    update({ ...applied, [key]: cur.includes(optionId) ? cur.filter((v) => v !== optionId) : [...cur, optionId] });
  };
  const remove = (key: CapFilterKey, optionId: string) => {
    rootRef.current?.querySelector<HTMLElement>(`[data-filter="${key}"] button`)?.focus();
    update({ ...applied, [key]: applied[key].filter((v) => v !== optionId) });
  };
  const clearAll = () => update({ theme: [], market: [], assetType: [] });

  const matches = (c: CapCaseStudy) => {
    const theme = beforeDot(c.meta);
    const market = afterDot(c.meta);
    const ok = (key: CapFilterKey, value: string | undefined) =>
      applied[key].length === 0 || value === undefined || applied[key].some((o) => same(labelOf(key, o), value));
    return ok("theme", theme) && ok("market", market) && ok("assetType", c.assetType);
  };

  const filtered = touched ? cards.filter(matches) : cards;
  const ordered = sortId && sortId !== sort.options[0]?.id ? [...filtered].reverse() : filtered;
  const chips = filters.flatMap((f) => applied[f.key].map((o) => ({ key: f.key, id: o, label: labelOf(f.key, o) })));

  return (
    <Section bg={bg} id={id} aria-labelledby={headingId} className={PAD.block} containerClassName="flex flex-col gap-8 md:gap-12 lg:gap-16">
      <h2 id={headingId} className={T.h24m}>
        {title}
      </h2>

      <div ref={rootRef} className="flex flex-col gap-4">
        {/* 768+: one wrapping row of dropdowns and chips, with Sort pinned right on the first line.
            390: the dropdowns on one row, the chips on the next (wrapping), then Sort on its own row, right-aligned.
            The dropdown row wraps rather than scrolls so the menus are never clipped. */}
        <div role="group" aria-label="Filter and sort case studies" className="flex flex-col gap-3 md:flex-row md:items-start">
          <div className="flex min-w-0 flex-col gap-2 md:flex-1 md:flex-row md:flex-wrap md:items-center md:gap-3">
            <div className="flex flex-wrap items-center gap-2 md:contents">
              {filters.map((f) => (
                <div key={f.key} data-filter={f.key}>
                  <MultiFilterDropdown label={f.label} options={f.options} values={applied[f.key]} onToggle={(o) => toggle(f.key, o)} />
                </div>
              ))}
            </div>
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 md:contents">
                {chips.map((c) => (
                  <AppliedChip key={`${c.key}-${c.id}`} shape="pill" label={c.label} onRemove={() => remove(c.key, c.id)} />
                ))}
              </div>
            )}
          </div>
          <div className="self-end md:self-start">
            <FilterDropdown
              sortLabel
              align="right"
              label={sort.label}
              options={sort.options}
              value={sortId}
              onChange={(v) => {
                if (v && v !== sortId) {
                  setSortId(v);
                  setTouched(true);
                }
              }}
            />
          </div>
        </div>
        <div aria-hidden="true" className="h-px w-full bg-line" />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p aria-live="polite" className="text-[14px] font-medium leading-[1.45] text-ink md:text-[15px]">
            {fill(countText, ordered.length)}
          </p>
          <button
            type="button"
            onClick={clearAll}
            className={`${HIT} text-[14px] leading-[1.45] text-muted-surface underline-offset-4 transition-colors hover:text-ink hover:underline`}
          >
            {clearAllLabel}
          </button>
        </div>
      </div>

      {ordered.length > 0 ? (
        <MediaCardList variant="case3" cards={ordered.map(({ title: t, meta, href }) => ({ title: t, meta, href }))} cardHeadingLevel="h3" onSurface />
      ) : (
        <p className="text-[15px] leading-[1.45] text-muted-surface">{emptyText}</p>
      )}
    </Section>
  );
}
