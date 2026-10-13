"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { NAV_COPY, SEARCH_COPY } from "@/config/nav";
import { searchSite } from "@/data/site/searchIndex";
import { ExploreLink, useIsDesktop } from "./parts";

/** /search?q=… */
export const siteSearchHref = (q: string) => `${SEARCH_COPY.path}?q=${encodeURIComponent(q)}`;

/**
 * Header search (Figma Group_Search 672:25712 / Group_SearchResults 672:25754, mobile 705:28849 / 705:29172).
 * Desktop: a 73px white row under the header (borderless field with a 1px underline, close X), over the
 * black/80 overlay. Mobile and tablet: a full-screen white sheet. Once something is typed, the results
 * block shows as drawn ("4 Results", rows of title over URL), filled from the whole-site index: the number
 * of matches and the top four, each linking to its page (inert where it has none), then "See all results".
 * Enter, or "See all results", goes to /search?q=; an empty search keeps the panel open.
 */
export function SearchPanel({ id, animate, onClose, onSubmitted }: { id: string; animate: boolean; onClose: () => void; onSubmitted: () => void }) {
  const router = useRouter();
  const desktop = useIsDesktop();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const query = q.trim();
  const results = useMemo(() => searchSite(query), [query]);
  const n = results.length;
  const status = !query ? "" : n === 0 ? SEARCH_COPY.noResults.replace("{q}", query) : (n === 1 ? SEARCH_COPY.countSingular : SEARCH_COPY.count).replace("{n}", String(n));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 24 / 33 at 390 as drawn; narrower phones take 8px off the close button and 17 off the gutter so the placeholder fits
  const gutter = "pl-6 pr-[33px] max-[389px]:pr-4 md:px-10 nav:px-[67px]";
  return (
    <div
      id={id}
      className={`sb-pad absolute inset-x-0 top-full h-dvh overflow-y-auto overscroll-contain bg-white pb-24 nav:h-auto nav:max-h-[calc(100dvh-72px)] nav:pb-0 ${animate ? "anim-pop" : ""}`}
    >
      <form
        role="search"
        aria-label="Site search"
        onSubmit={(e) => {
          e.preventDefault();
          if (!query) return inputRef.current?.focus();
          onSubmitted();
          router.push(siteSearchHref(query));
        }}
        // The row's full-bleed line sits on its last pixel row (72 to 145), and goes once results show
        className={`sb-bleed ${query ? "" : "nav:shadow-[inset_0_-1px_0_var(--color-line)]"}`}
      >
        <div className={`mx-auto flex max-w-[1440px] items-center pt-[37px] nav:py-4 ${gutter}`}>
          {/* Focus: the underline turns ink and thickens to 2px */}
          <div className="relative min-w-0 flex-1 border-b border-line focus-within:border-ink focus-within:shadow-[inset_0_-1px_0_var(--color-ink)]">
            <Icon name="search" className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-ink" />
            <label htmlFor={inputId} className="sr-only">
              Search
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={desktop ? NAV_COPY.searchPlaceholder : NAV_COPY.searchPlaceholderMobile}
              autoComplete="off"
              className="field h-10 w-full bg-transparent pl-[30px] pr-2 text-[14px] font-medium leading-5 text-ink placeholder:text-muted nav:placeholder:text-body"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex h-10 w-[52px] shrink-0 items-center justify-center rounded-btn max-[389px]:w-11"
          >
            <Icon name="close" className="text-ink" />
          </button>
        </div>
      </form>
      <div className={`mx-auto max-w-[1440px] ${gutter} ${query ? "pb-[35px] pt-[35px] nav:pr-[119px] nav:pt-[31px]" : ""}`}>
        <p role="status" className={query ? "pb-2 text-[14px] font-bold leading-5 text-body [overflow-wrap:anywhere]" : "sr-only"}>
          {status}
        </p>
        {n > 0 && (
          <>
            <ul className="mt-4 flex flex-col gap-4" aria-label="Top results">
              {results.slice(0, SEARCH_COPY.rows).map((r) => (
                <li key={r.id}>
                  <SmartLink href={r.href} className="group block border-b border-line pb-2 text-[14px] leading-5 text-body">
                    <span className="block font-bold group-hover:text-ink group-hover:underline">{r.title}</span>{" "}
                    <span className="block [overflow-wrap:anywhere]">{SEARCH_COPY.site + r.path}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex">
              <ExploreLink href={siteSearchHref(query)} label={SEARCH_COPY.seeAll} context={`for ${query}`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
