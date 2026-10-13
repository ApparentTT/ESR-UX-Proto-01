"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { NAV_COPY } from "@/config/nav";
import { PAGES } from "@/config/site";
import { useIsDesktop } from "./parts";

/** Built pages whose title or section starts a word with every typed word ("port" finds the portfolio pages). */
function matchPages(q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return PAGES.filter((p) => {
    const have = `${p.label} ${p.group}`.toLowerCase().split(/[^a-z0-9]+/);
    return words.every((w) => have.some((h) => h.startsWith(w)));
  });
}

/**
 * Header search (Figma Group_Search 672:25712 / Group_SearchResults 672:25754, mobile 705:28849 / 705:29172).
 * Desktop: a 73px white row under the header (borderless field with a 1px underline, close X), over the
 * black/80 overlay. Mobile and tablet: a full-screen white sheet. Typing shows the results block as drawn
 * ("4 Results" / "Page title" / URL): here the matching built pages, title over its esr.com URL.
 * Enter goes to news search; an empty search keeps the panel open.
 */
export function SearchPanel({ id, animate, onClose, onSubmitted }: { id: string; animate: boolean; onClose: () => void; onSubmitted: () => void }) {
  const router = useRouter();
  const desktop = useIsDesktop();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const query = q.trim();
  const results = useMemo(() => (query ? matchPages(query) : []), [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const gutter = "pl-6 pr-[33px] md:px-10 nav:px-[67px]";
  return (
    <div
      id={id}
      className={`absolute inset-x-0 top-full h-dvh overflow-y-auto overscroll-contain bg-white pb-24 nav:h-auto nav:max-h-[calc(100dvh-72px)] nav:pb-0 ${animate ? "anim-pop" : ""}`}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (!query) return inputRef.current?.focus();
          onSubmitted();
          router.push(`/news/search?q=${encodeURIComponent(query)}`);
        }}
        className={query ? "" : "nav:border-b nav:border-line"}
      >
        <div className={`mx-auto flex max-w-[1440px] items-center pt-[37px] nav:py-4 ${gutter}`}>
          <div className="relative min-w-0 flex-1 border-b border-line focus-within:border-ink">
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
          <button type="button" onClick={onClose} aria-label="Close search" className="inline-flex h-10 w-[52px] shrink-0 items-center justify-center rounded-btn">
            <Icon name="close" className="text-ink" />
          </button>
        </div>
      </form>
      <div className={`mx-auto max-w-[1440px] ${gutter} ${query ? "pb-[35px] pt-[35px] nav:pr-[119px] nav:pt-[31px]" : ""}`}>
        <p role="status" className={query ? "pb-2 text-[14px] font-bold leading-5 text-body" : "sr-only"}>
          {query ? `${results.length} ${results.length === 1 ? "Result" : "Results"}` : ""}
        </p>
        {results.length > 0 && (
          <ul className="mt-4 flex flex-col gap-4">
            {results.map((p) => (
              <li key={p.href}>
                <Link href={p.href} onClick={onSubmitted} className="group block border-b border-line pb-2 text-[14px] leading-5 text-body">
                  <span className="block font-bold group-hover:text-ink group-hover:underline">{p.label}</span>
                  <span className="block break-all">https://www.esr.com{p.href === "/" ? "/" : p.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
