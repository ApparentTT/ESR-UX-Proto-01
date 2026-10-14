"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { HIT } from "@/components/ui/type";

/** The ESR Japan property search results, where this form submits. */
const SEARCH_PATH = "/properties/search";

export type PropertySearchEntryProps = {
  title: string;
  sub: string;
  placeholder: string;
  filtersLabel: string;
  submitLabel: string;
  viewAll: { label: string; href: string | null };
  /** Heading level (h2 under the page h1) */
  headingLevel?: "h2" | "h3";
};

/**
 * "Search entry / desktop" (Figma 1290:26943 on the Japan homepage, 1290:31163 on Properties): a surface band
 * with the Bold 24 heading and 16/1.45 muted sub, then a 73px search row (white field with the search icon,
 * an outlined Filters button and the ink Search button, 12 apart, radius 10) and "View all properties".
 * Search (or Enter) opens the ESR Japan property search with the text as its query (all properties when
 * empty); Filters opens the same search, where the filters live. 390: the buttons drop under the field.
 */
export function PropertySearchEntry({ title, sub, placeholder, filtersLabel, submitLabel, viewAll, headingLevel: H = "h2" }: PropertySearchEntryProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const uid = useId();
  const headingId = `${uid}-title`;
  const inputId = `${uid}-q`;
  return (
    <section aria-labelledby={headingId} className="bg-surface">
      <Container className="pb-8 pt-10 md:pt-12 lg:pb-8 lg:pt-[59px]">
        <H id={headingId} className="text-[22px] font-bold leading-[1.15] text-ink lg:text-[24px]">
          {title}
        </H>
        <p className="mt-3 max-w-[720px] text-[15px] leading-[1.45] text-muted-surface md:text-[16px]">{sub}</p>

        <form
          role="search"
          aria-labelledby={headingId}
          className="mt-6 flex flex-col gap-3 md:mt-8 md:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            const query = q.trim();
            router.push(query ? `${SEARCH_PATH}?q=${encodeURIComponent(query)}` : SEARCH_PATH);
          }}
        >
          <div className="relative md:flex-1">
            <label htmlFor={inputId} className="sr-only">
              {placeholder}
            </label>
            <Icon name="search" size={26} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted lg:left-6" />
            <input
              id={inputId}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              autoComplete="off"
              enterKeyHint="search"
              className="h-14 w-full rounded-[10px] border border-line bg-white pl-14 pr-4 text-[16px] text-ink placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink md:h-[73px] lg:pl-[65px] lg:text-[18px]"
            />
          </div>
          <div className="flex gap-3">
            <Link
              href={SEARCH_PATH}
              className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-[10px] border-[1.5px] border-ink bg-white px-6 text-[16px] font-medium text-ink hover:bg-surface md:h-[73px] md:flex-none lg:text-[18px]"
            >
              <Icon name="tune" size={24} />
              {filtersLabel}
            </Link>
            <button
              type="submit"
              className="inline-flex h-14 flex-[1.4] items-center justify-center rounded-[10px] bg-ink px-10 text-[16px] font-medium text-white hover:bg-black md:h-[73px] md:flex-none lg:text-[18px]"
            >
              {submitLabel}
            </button>
          </div>
        </form>

        <div className="mt-6 flex md:mt-8">
          <SmartLink href={viewAll.href} className={`${HIT} text-[14px] leading-[1.45] text-muted-surface underline underline-offset-2 hover:text-ink`}>
            {viewAll.label}
          </SmartLink>
        </div>
      </Container>
    </section>
  );
}
