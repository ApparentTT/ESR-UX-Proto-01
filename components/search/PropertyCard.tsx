"use client";

import { forwardRef } from "react";
import type { Property } from "@/data/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { locationText, sizeText, statusText, typeText } from "@/lib/display";

type Props = {
  property: Property;
  active?: boolean;
  onHover?: (id: string | null) => void;
};

/** Result card. The whole card is one link target; detail pages are out of scope so it does not navigate. */
export const PropertyCard = forwardRef<HTMLElement, Props>(function PropertyCard({ property: p, active, onHover }, ref) {
  return (
    <article
      ref={ref}
      data-property-id={p.id}
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(p.id)}
      onBlur={() => onHover?.(null)}
      className={`group relative flex flex-col overflow-hidden rounded-card bg-white transition-shadow ${
        active ? "ring-2 ring-ink" : "ring-1 ring-transparent hover:ring-ink"
      }`}
    >
      <div className="relative">
        <ImagePlaceholder className="aspect-[16/9] w-full" />
        <span className="absolute left-3 top-3 rounded-[4px] bg-white px-2 py-1 text-xs font-medium">{statusText(p)}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3.5">
        <p className="text-xs text-muted">{typeText(p)}</p>
        <h3 className="text-[17px] font-medium leading-snug">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            title="Property pages are not part of this prototype"
            className="focus-visible:outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ink focus-visible:after:-outline-offset-2"
          >
            {p.name}
          </a>
        </h3>
        <p className="text-sm text-muted">{locationText(p)}</p>
        <p className="mt-1 text-[15px] font-medium">{sizeText(p)}</p>
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
      </div>
    </div>
  );
}
