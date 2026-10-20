"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ExploreLink } from "@/components/layout/nav/parts";
import type { PropertySearchBlock } from "@/config/local-nav";

/** The ESR Japan property search, where "Find available property" submits. */
export const PROPERTY_SEARCH_PATH = "/properties/search";

/** "Explore" in the local menus: the group ExploreLink, with open_in_new for a link to the ESR Group site (external) or another website (offsite). */
export function LocalExploreLink(props: { href: string | null; context?: string; external?: boolean; offsite?: boolean; label?: string; className?: string }) {
  return <ExploreLink {...props} />;
}

/**
 * "Find available property" (Our portfolio, desktop 672:25997 and mobile 718:923): the Bold 14 heading is the
 * field's label; a 51px grey pill with a search button at its right; "View all properties" 32 below.
 * Enter or the button opens the ESR Japan property search with the text as its query; an empty field keeps
 * focus in it. onSubmitted lets the header close its layer.
 */
export function PropertySearchForm({ block, onSubmitted, className = "" }: { block: PropertySearchBlock; onSubmitted?: () => void; className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  return (
    <div className={className}>
      <form
        role="search"
        aria-label={block.heading}
        onSubmit={(e) => {
          e.preventDefault();
          const query = q.trim();
          if (!query) return inputRef.current?.focus();
          onSubmitted?.();
          router.push(`${PROPERTY_SEARCH_PATH}?q=${encodeURIComponent(query)}`);
        }}
      >
        <label htmlFor={id} className="block text-[14px] font-bold leading-5 text-[#393939]">
          {block.heading}
        </label>
        <div className="relative mt-[15px]">
          <input
            ref={inputRef}
            id={id}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={block.placeholder}
            autoComplete="off"
            enterKeyHint="search"
            className="h-[51px] w-full rounded-full bg-surface pl-4 pr-14 text-[14px] font-medium leading-5 text-ink placeholder:text-muted-surface"
          />
          <button
            type="submit"
            aria-label="Search properties"
            className="absolute right-1.5 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-line/60"
          >
            <Icon name="search" size={20} className="text-ink" />
          </button>
        </div>
      </form>
      <div className="mt-8 flex">
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
    </div>
  );
}
