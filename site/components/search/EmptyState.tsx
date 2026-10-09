"use client";

import type { Property } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { PropertyCard } from "./PropertyCard";

type Props = {
  nearby: Property[];
  onClearAll: () => void;
  cardRefs: React.MutableRefObject<Map<string, HTMLElement>>;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
};

/** Filters stay applied above so the user can widen; nearby properties keep the page from ever being empty. */
export function EmptyState({ nearby, onClearAll, cardRefs, hoveredId, selectedId, onHover }: Props) {
  return (
    <div>
      <div className="flex flex-col items-center rounded-card bg-white px-6 py-12 text-center md:py-14">
        <Icon name="search_off" size={40} />
        <h2 className="mt-4 text-xl font-medium md:text-[22px]">No properties match these filters</h2>
        <p className="mt-3 max-w-sm text-[15px] text-muted">Try widening the size range, or clear a filter to see more.</p>
        <button
          type="button"
          onClick={onClearAll}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-btn bg-ink px-5 text-sm font-medium text-white sm:w-auto"
        >
          Clear all filters
        </button>
      </div>

      {nearby.length > 0 && (
        <section aria-labelledby="nearby-heading" className="mt-8">
          <h2 id="nearby-heading" className="text-lg font-medium">
            Nearby properties
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {nearby.map((p) => (
              <li key={p.id} className="flex flex-col [&>article]:flex-1">
                <PropertyCard
                  property={p}
                  active={hoveredId === p.id || selectedId === p.id}
                  onHover={onHover}
                  ref={(el) => {
                    if (el) cardRefs.current.set(p.id, el);
                    else cardRefs.current.delete(p.id);
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
