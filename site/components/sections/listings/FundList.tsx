"use client";

import { useId, useRef, useState } from "react";
import { Section, type SectionBg } from "@/components/ui/Section";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { FootnoteText } from "@/components/ui/DataBits";
import { TextLink } from "@/components/ui/TextLink";
import { T } from "@/components/ui/type";
import { FundTable, type FundColumns, type FundRow } from "./FundTable";

/** A filter trigger. `key` names the row field it filters; "status" has no column, so it only shows `pending`. */
export type FundFilter = {
  key: "strategy" | "markets" | "sector" | "status";
  label: string;
  /** Clear item at the top of the menu ("All strategies") */
  allLabel?: string;
  /** Option labels, matched exactly against the row field */
  options?: string[];
  /** No options designed: the menu shows this single non-applying item instead */
  pending?: string;
};

export type FundListProps = {
  title: string;
  sub?: string;
  filters: FundFilter[];
  columns: FundColumns;
  rows: FundRow[];
  /** "{n} funds and mandates"; `countPlaceholder` ("XX") stands in for {n} while no filter is applied */
  countText: string;
  countPlaceholder?: string;
  /** Prototype-only empty state */
  empty: { text: string; clearLabel: string };
  footnote?: string;
  download?: { label: string; href: string | null };
  bg?: SectionBg;
  id?: string;
};

const PENDING = "__pending";

/**
 * B30 FundList (INV §6 "Our funds"). White band, 80 top / ~99 bottom, gap 28.
 * Head: Bold 40/1.2 + 18/1.45 muted sub (max 820, gap 10). Filter bar: Strategy, Market, Sector, Status
 * (single-select FilterDropdowns, the active one gets the dark border), spacer, "XX funds and mandates"
 * (Medium 15). The table filters in place; the count shows the real number once a filter is applied.
 * Footnote row: 13px muted note + "Download the fund factsheet" (inert).
 * Below 768 the count sits above the wrapping triggers, and the table becomes a card list.
 */
export function FundList({ title, sub, filters, columns, rows, countText, countPlaceholder = "XX", empty, footnote, download, bg = "white", id }: FundListProps) {
  const headingId = useId();
  const [applied, setApplied] = useState<Partial<Record<FundFilter["key"], string>>>({});
  const barRef = useRef<HTMLDivElement>(null);

  const active = Object.values(applied).some(Boolean);
  const visible = rows.filter((r) =>
    (Object.entries(applied) as [FundFilter["key"], string | undefined][]).every(([k, v]) => !v || k === "status" || r[k] === v),
  );
  const count = countText.replace("{n}", active ? String(visible.length) : countPlaceholder);

  const clear = () => {
    setApplied({});
    barRef.current?.querySelector<HTMLElement>("button")?.focus();
  };

  return (
    <Section
      bg={bg}
      id={id}
      aria-labelledby={headingId}
      className="pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-[99px] lg:pt-20"
      containerClassName="flex flex-col gap-6 lg:gap-7"
    >
      <div className="flex max-w-[820px] flex-col gap-2.5">
        <h2 id={headingId} className={T.h40b}>
          {title}
        </h2>
        {sub && <p className={`text-[16px] leading-[1.45] lg:text-[18px] ${bg === "white" ? "text-muted" : "text-muted-surface"}`}>{sub}</p>}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
        <div ref={barRef} role="group" aria-label="Filter funds" className="order-2 flex flex-wrap items-center gap-2 md:order-1 md:gap-3">
          {filters.map((f) => (
            <FilterDropdown
              key={f.key}
              label={f.label}
              allLabel={f.pending ? undefined : f.allLabel}
              options={f.pending ? [{ id: PENDING, label: f.pending }] : (f.options ?? []).map((o) => ({ id: o, label: o }))}
              value={applied[f.key] ?? null}
              onChange={(v) => {
                if (v === PENDING) return;
                setApplied((a) => ({ ...a, [f.key]: v ?? undefined }));
              }}
            />
          ))}
        </div>
        <p aria-live="polite" className="text-[14px] font-medium leading-[1.45] text-ink order-1 md:order-2 md:ml-auto md:text-[15px]">
          {count}
        </p>
      </div>

      <FundTable
        caption={title}
        columns={columns}
        rows={visible}
        empty={
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-[15px] leading-[1.45] text-muted lg:text-[16px]">{empty.text}</p>
            <button type="button" onClick={clear} className="text-[15px] font-medium leading-[1.45] text-ink underline underline-offset-4 hover:no-underline">
              {empty.clearLabel}
            </button>
          </div>
        }
      />

      {(footnote || download) && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {footnote && <FootnoteText className="flex-1">{footnote}</FootnoteText>}
          {download && (
            <TextLink href={download.href} variant="underline" size={15}>
              {download.label}
            </TextLink>
          )}
        </div>
      )}
    </Section>
  );
}
