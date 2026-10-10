import { StatList } from "@/components/sections/stats/StatRow";
import { T } from "@/components/ui/type";
import type { MapStat } from "./types";

/**
 * The "We span" stats row above the map (inventory B15, PORT §2a, DEV §4a): the Medium 40 heading,
 * a 30px gap, then StatRow's `map` stats (4 x 146px, Bold 26.9 values, #393939), right-aligned.
 * 390: heading on its own line, stats 2 x 2. 768: heading above a 4-up row. 1024+: one row.
 */
export function MapStatsRow({
  title = "We span",
  stats,
  headingId,
  as: Heading = "h2",
  className = "",
}: {
  title?: string;
  stats: MapStat[];
  /** id on the heading, for the section's aria-labelledby */
  headingId?: string;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start lg:gap-[30px] ${className}`}>
      <Heading id={headingId} className={`${T.h40m} shrink-0 whitespace-nowrap`}>
        {title}
      </Heading>
      <StatList stats={stats} variant="map" label={title} className="md:w-fit lg:w-auto lg:min-w-0 lg:flex-1" />
    </div>
  );
}
