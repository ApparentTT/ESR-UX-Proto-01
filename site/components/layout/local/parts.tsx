"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { Tag } from "@/components/ui/Tag";
import { HIT } from "@/components/ui/type";
import { ExploreLink } from "@/components/layout/nav/parts";
import { GROUP_SITE_CARD, GROUP_SITE_SUFFIX, type PropertySearchBlock } from "@/config/local-nav";

/** The ESR Japan property search, where "Find available property" submits. */
export const PROPERTY_SEARCH_PATH = "/properties/search";

/** The current market's card in the market panel: a dark border, as drawn (672:26096 / 719:1563). */
export const CURRENT_MARKET_CARD = "[&_a]:border-ink [&_a:hover]:border-ink";

/**
 * "Explore" (Bold 13 underlined), with the block title as a visually hidden suffix. A link to the ESR Group
 * site (external) carries open_in_new 16 instead of the arrow, as drawn on Data centres, and says so to
 * screen readers. Same tap target and styles as the group ExploreLink.
 */
export function LocalExploreLink({
  href,
  context,
  external,
  label,
  className = "",
}: {
  href: string | null;
  context?: string;
  external?: boolean;
  label?: string;
  className?: string;
}) {
  if (!external) return <ExploreLink href={href} context={context} label={label} className={className} />;
  return (
    <SmartLink
      href={href}
      className={`${HIT} group inline-flex items-center gap-3 text-[13px] font-bold leading-5 text-[#393939] underline underline-offset-2 ${className}`}
    >
      {label ?? "Explore"}
      {context && <span className="sr-only"> {context}</span>}
      <span className="sr-only"> {GROUP_SITE_SUFFIX}</span>
      <Icon name="open_in_new" size={16} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
    </SmartLink>
  );
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

/**
 * The ESR Group site as a twelfth card in the market panel (not drawn; see GROUP_SITE_CARD), in the market
 * card design: region tag, Bold name, languages.
 */
export function GroupSiteCard({ compact = false }: { compact?: boolean }) {
  const c = GROUP_SITE_CARD;
  return (
    <Link
      href={c.href}
      className={`group flex h-full items-start gap-6 rounded-card border border-line bg-white hover:border-ink/30 ${compact ? "py-2 pl-3 pr-6" : "min-h-24 px-3 py-6"}`}
    >
      <Tag className={compact ? "w-[73px] shrink-0 justify-center whitespace-nowrap px-1!" : "shrink-0 whitespace-nowrap"}>{c.region}</Tag>{" "}
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[15px] font-bold leading-5 text-ink group-hover:underline">{c.name}</span>{" "}
        <span className="text-[14px] font-medium leading-5 text-muted">{c.languages}</span>
      </span>
    </Link>
  );
}
