"use client";

import Link from "next/link";
import { forwardRef, useState } from "react";
import type { Property } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { factList, isSummary, locationText, sizeText, statusText, typeText } from "@/lib/display";
import { enquireHref, propertyHref } from "@/lib/propertyLinks";

type Props = {
  property: Property;
  /** Hovered on the map, or this card is hovered */
  active?: boolean;
  /** Pin selected (outlined even when the card itself is hovered) */
  selected?: boolean;
  /** Pin selected on desktop: the card spans the full top row with more detail */
  expanded?: boolean;
  onClose?: () => void;
  onHover?: (id: string | null) => void;
};

const INERT_TITLE = "Property pages are not part of this prototype";

/** A link, or an inert one (href="#", no navigation) where the page is not part of the prototype. */
export function CardLink({ href, children, ...rest }: { href: string | null } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (href) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href="#" title={INERT_TITLE} {...rest} onClick={(e) => e.preventDefault()}>
      {children}
    </a>
  );
}

/** The summary listing line: info icon + muted text ("Enquire for details" in the short form on map cards) */
export function SummaryLine({ short, className = "" }: { short?: boolean; className?: string }) {
  return (
    <span className={`flex items-center gap-1.5 text-muted ${short ? "text-xs leading-4" : "text-[13px] leading-5"} ${className}`}>
      <Icon name="info" size={16} className="shrink-0" />
      {short ? "Enquire for details" : "Summary listing · Enquire for details"}
    </span>
  );
}

/**
 * Result card, in two types.
 * - Linked: the whole card is one link to the property detail page (stretched from the name), with a hover ring and
 *   shadow and a "View property" line.
 * - Summary: some markets only share a top-line view. Same footprint, but a plain article: no link, no hover state,
 *   and an info line "Summary listing · Enquire for details" instead.
 * Expanded (pin selected on desktop): spans both columns, image left, more facts and actions right, with Close.
 */
export const PropertyCard = forwardRef<HTMLElement, Props>(function PropertyCard(
  { property: p, active, selected, expanded, onClose, onHover },
  ref,
) {
  const summary = isSummary(p);
  const href = propertyHref(p);
  // Summary cards have no hover state of their own: hovering one still lights its pin, but only a pin hover or
  // selection outlines the card.
  const [selfHover, setSelfHover] = useState(false);
  const outlined = selected || expanded || (active && !(summary && selfHover));
  const ring = outlined ? "ring-2 ring-ink" : "ring-1 ring-transparent";
  const hover = summary ? "" : "hover:shadow-panel hover:ring-ink";
  const status = <span className="rounded-[4px] bg-white px-2 py-1 text-xs font-medium">{statusText(p)}</span>;

  if (expanded) {
    return (
      <article
        ref={ref}
        data-property-id={p.id}
        data-expanded=""
        aria-label={`${p.name}, selected on the map`}
        onMouseEnter={() => onHover?.(p.id)}
        onMouseLeave={() => onHover?.(null)}
        className={`anim-pop relative flex min-h-[300px] overflow-hidden rounded-card bg-white shadow-panel ${ring}`}
      >
        <div className="relative w-[45%] shrink-0 self-stretch">
          <ImagePlaceholder className="absolute inset-0 h-full w-full" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col px-6 pb-5 pt-5">
          <div className="pr-10">
            <span className="inline-block rounded-[4px] bg-surface px-2 py-1 text-xs font-medium">{statusText(p)}</span>
            <p className="mt-3 text-xs text-muted">{typeText(p)}</p>
            <h3 className="mt-1 text-[20px] font-medium leading-snug">{p.name}</h3>
            <p className="mt-1 text-sm text-muted">{locationText(p)}</p>
            <p className="mt-2 text-[17px] font-medium">{sizeText(p)}</p>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
            {factList(p).map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="mt-0.5 text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
          {summary && <SummaryLine className="mt-4" />}
          <div className="mt-auto flex flex-wrap gap-3 pt-5">
            {!summary && (
              <CardLink
                href={href}
                className="inline-flex h-11 items-center gap-2 rounded-btn bg-ink px-5 text-sm font-medium text-white"
              >
                View property
                <Icon name="arrow_forward" size={18} />
              </CardLink>
            )}
            <CardLink
              href={enquireHref(p)}
              className="inline-flex h-11 items-center rounded-btn border border-ink bg-white px-5 text-sm font-medium hover:bg-surface"
            >
              Enquire
              <span className="sr-only"> about {p.name}</span>
            </CardLink>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close (Esc)"
          className="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-line bg-white hover:border-ink"
        >
          <Icon name="close" />
        </button>
      </article>
    );
  }

  return (
    <article
      ref={ref}
      data-property-id={p.id}
      data-listing={p.listing}
      onMouseEnter={() => {
        setSelfHover(true);
        onHover?.(p.id);
      }}
      onMouseLeave={() => {
        setSelfHover(false);
        onHover?.(null);
      }}
      onFocus={() => onHover?.(p.id)}
      onBlur={() => onHover?.(null)}
      className={`group relative flex flex-col overflow-hidden rounded-card bg-white transition-shadow ${ring} ${hover}`}
    >
      <div className="relative">
        <ImagePlaceholder className="aspect-[16/9] w-full" />
        <span className="absolute left-3 top-3">{status}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3.5">
        <p className="text-xs text-muted">{typeText(p)}</p>
        <h3 className="text-[17px] font-medium leading-snug">
          {summary ? (
            p.name
          ) : (
            <CardLink
              href={href}
              className="focus-visible:outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ink focus-visible:after:-outline-offset-2"
            >
              {p.name}
            </CardLink>
          )}
        </h3>
        <p className="text-sm text-muted">{locationText(p)}</p>
        <p className="mt-1 text-[15px] font-medium">{sizeText(p)}</p>
        {summary ? (
          <SummaryLine className="mt-auto pt-3" />
        ) : (
          <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 pt-3 text-[13px] font-bold leading-5 text-[#393939] underline underline-offset-2">
            View property
            <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </article>
  );
});

export function SkeletonCard() {
  return (
    <div aria-hidden="true" className="skeleton flex flex-col overflow-hidden rounded-card bg-white">
      <div className="aspect-[16/9] w-full bg-line" />
      <div className="space-y-2.5 px-4 pb-5 pt-4">
        <div className="h-3 w-1/3 rounded bg-line" />
        <div className="h-4 w-4/5 rounded bg-line" />
        <div className="h-3 w-1/2 rounded bg-line" />
        <div className="h-4 w-1/4 rounded bg-line" />
        <div className="h-3 w-1/3 rounded bg-line" />
      </div>
    </div>
  );
}
