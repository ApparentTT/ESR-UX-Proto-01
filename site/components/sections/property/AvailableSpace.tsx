"use client";

import { useMemo, useRef, useState } from "react";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Icon } from "@/components/ui/Icon";
import { unitEnquiryMessage, type SpaceUnit } from "@/data/site/local/property-detail";
import { goToEnquiry } from "./enquire";
import { GUTTER, SECTION_H2 } from "./PropertyBlocks";

type SizeOption = { id: string; label: string; min: number; max: number };
type Option = { id: string; label: string };

export type AvailableSpaceCopy = {
  title: string;
  units: SpaceUnit[];
  pageSize: number;
  columns: { unit: string; size: string; available: string; action: string };
  enquire: string;
  sizeLabel: string;
  availabilityLabel: string;
  sizeOptions: SizeOption[];
  anySize: string;
  availabilityOptions: Option[];
  anyAvailability: string;
  empty: string;
  clear: string;
};

const sqm = (n: number) => `${n.toLocaleString("en-US")} sqm`;

function matchesAvailability(u: SpaceUnit, id: string | null) {
  if (!id) return true;
  if (id === "now") return u.available === "Available now";
  return u.available.includes(id);
}

/**
 * "Available space" (1507:52279): Bold 36 heading; toolbar: "20 units available" (Medium 15) with the Size and
 * Availability filters (FilterDropdown, single select, with an "Any" item) over the sample units. Table: 13px
 * muted header row, 17px rows (unit Medium ink, size muted, availability ink, "Enquire" right) between line
 * rules. Under it "Showing 5 of 20 units" and the outline "Show 15 more units" button, which reveals the rest
 * (focus moves to the first new row's Enquire). Each Enquire scrolls to the enquiry form, pre-fills its Message
 * with the unit and focuses the first field. 390 (1507:59151): "20 units", Size / Available fold into a muted
 * line under the unit (the cells stay for screen readers), Enquire gets an arrow, "Show more" is full width.
 */
export function AvailableSpace({ copy, property }: { copy: AvailableSpaceCopy; property: string }) {
  const [size, setSize] = useState<string | null>(null);
  const [avail, setAvail] = useState<string | null>(null);
  const [shown, setShown] = useState(copy.pageSize);
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const range = copy.sizeOptions.find((o) => o.id === size);
    return copy.units.filter((u) => (!range || (u.sizeSqm >= range.min && u.sizeSqm < range.max)) && matchesAvailability(u, avail));
  }, [copy.units, copy.sizeOptions, size, avail]);

  const visible = filtered.slice(0, shown);
  const remaining = filtered.length - visible.length;
  /** The drawn button reveals every remaining unit ("Show 15 more units" with 5 of 20 shown) */
  const more = remaining;

  const setFilter = (fn: (v: string | null) => void) => (v: string | null) => {
    fn(v);
    setShown(copy.pageSize);
  };

  const showMore = () => {
    const first = visible.length;
    setShown((s) => s + more);
    requestAnimationFrame(() => tableRef.current?.querySelectorAll<HTMLButtonElement>("button[data-enquire]")[first]?.focus());
  };

  const clear = () => {
    setSize(null);
    setAvail(null);
    setShown(copy.pageSize);
    // The Clear button unmounts with the empty state: keep keyboard focus in the toolbar
    requestAnimationFrame(() => toolbarRef.current?.querySelector<HTMLButtonElement>("button")?.focus());
  };

  const unitsLabel = `${filtered.length} ${filtered.length === 1 ? "unit" : "units"}`;

  return (
    <section aria-labelledby="available-space" className="py-14 lg:py-[72px]">
      <div className={`${GUTTER} flex flex-col gap-5 lg:gap-6`}>
      <h2 id="available-space" className={SECTION_H2}>
        {copy.title}
      </h2>
      <div>
        <div ref={toolbarRef} className="flex flex-wrap items-center gap-2 pb-5 md:gap-3 lg:pb-6">
          <p className="min-w-0 flex-1 text-[14px] font-medium leading-[1.5] text-ink md:text-[15px]">
            {unitsLabel}
            <span className="max-md:hidden"> available</span>
          </p>
          <FilterDropdown label={copy.sizeLabel} options={copy.sizeOptions} value={size} onChange={setFilter(setSize)} allLabel={copy.anySize} align="right" />
          <FilterDropdown
            label={copy.availabilityLabel}
            options={copy.availabilityOptions}
            value={avail}
            onChange={setFilter(setAvail)}
            allLabel={copy.anyAvailability}
            align="right"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-start gap-3 border-t border-line py-6">
            <p className="text-[15px] leading-[1.45] text-muted">{copy.empty}</p>
            <button type="button" onClick={clear} className="text-[14px] font-medium text-ink underline underline-offset-2">
              {copy.clear}
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse text-left max-md:border-t max-md:border-line md:table-fixed">
            <caption className="sr-only">
              {copy.title} at {property}: showing {visible.length} of {unitsLabel}
            </caption>
            <thead>
              <tr className="border-b border-line text-[13px] font-medium leading-[1.45] text-muted max-md:sr-only">
                <th scope="col" className="w-[38.5%] pb-3 font-medium">
                  {copy.columns.unit}
                </th>
                <th scope="col" className="pb-3 font-medium">
                  {copy.columns.size}
                </th>
                <th scope="col" className="pb-3 font-medium">
                  {copy.columns.available}
                </th>
                <th scope="col" className="w-[15.4%] pb-3 text-right font-medium">
                  <span className="sr-only">{copy.columns.action}</span>
                </th>
              </tr>
            </thead>
            <tbody ref={tableRef}>
              {visible.map((u) => (
                <tr key={u.unit} className="border-b border-line text-[15px] leading-[1.45] md:text-[17px]">
                  <th scope="row" className="py-3.5 pr-3 font-medium text-ink md:py-4 md:pr-4">
                    {u.unit}
                    <span aria-hidden="true" className="mt-0.5 block text-[13px] font-normal text-muted md:hidden">
                      {sqm(u.sizeSqm)} · {u.available}
                    </span>
                  </th>
                  <td className="whitespace-nowrap py-4 pr-4 text-muted max-md:sr-only">{sqm(u.sizeSqm)}</td>
                  <td className="py-4 pr-4 text-ink max-md:sr-only">{u.available}</td>
                  <td className="py-2 text-right max-md:w-[110px]">
                    <button
                      type="button"
                      data-enquire
                      aria-label={`${copy.enquire} about ${u.unit}`}
                      onClick={() => goToEnquiry(unitEnquiryMessage(u, sqm(u.sizeSqm), property))}
                      className="-mr-2 inline-flex min-h-10 items-center gap-2 rounded-btn px-2 text-[14px] font-medium text-ink underline-offset-4 hover:underline md:text-[17px] md:font-normal"
                    >
                      {copy.enquire}
                      <span className="inline-flex md:hidden">
                        <Icon name="arrow_forward" size={18} />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* One persistent live region, so filter results (including no results) are announced */}
        <p className="sr-only" aria-live="polite">
          {filtered.length ? `Showing ${visible.length} of ${unitsLabel}` : copy.empty}
        </p>
        {filtered.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-5 md:flex-row md:items-center md:gap-4 lg:pt-[42px]">
            <p className="flex-1 text-[14px] leading-[1.5] text-muted">
              Showing {visible.length} of {unitsLabel}
            </p>
            {remaining > 0 && (
              <button
                type="button"
                onClick={showMore}
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-btn border border-ink bg-white py-3.5 pl-[22px] pr-[18px] text-[15px] font-medium leading-[1.5] text-ink transition-colors hover:bg-surface max-md:w-full md:pl-[26px] md:pr-[22px]"
              >
                Show {more} more {more === 1 ? "unit" : "units"}
                <Icon name="keyboard_arrow_down" size={18} />
              </button>
            )}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
