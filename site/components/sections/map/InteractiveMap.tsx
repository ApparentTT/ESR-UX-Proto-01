import { Section, type SectionBg } from "@/components/ui/Section";
import { PAD } from "@/components/ui/type";
import { MapExplorer } from "./MapExplorer";
import { MapStatsRow } from "./MapStatsRow";
import type { MapDot, MapRegion, MapStat } from "./types";

export type InteractiveMapProps = {
  /** The 4 "We span" stats (data/site/stats.ts: PORT_MAP_STATS or DEV_MAP_STATS) */
  stats: MapStat[];
  /** Region nav content (data/site/markets.ts: MAP_REGIONS) */
  regions: MapRegion[];
  /** Market dots (data/site/markets.ts: MAP_DOTS) */
  dots: MapDot[];
  /** Heading, "We span" as drawn */
  title?: string;
  /** port: PORT §2 (panel top 44, zoom top 40). dev: DEV §4 (panel top 61, zoom top 57, dark overlay). */
  variant?: "port" | "dev";
  /** Override the variant's dark overlay on the map image */
  overlay?: boolean;
  /** Region open on load (default: the first, Asia) */
  defaultRegion?: string | null;
  bg?: SectionBg;
  /** Section id; also prefixes the heading and accordion ids (keep unique per page) */
  id?: string;
  className?: string;
};

/**
 * "We span" stats + interactive map (inventory B15; PORT §2, DEV §4). Padding 72/72 and a 60px
 * column gap at desktop: the stats row ("We span" + StatRow map stats, right-aligned), then the map
 * frame with its region / market panel and zoom controls. A static greyscale map (no map APIs).
 *
 * Responsive: 390 → heading on its own line, stats 2 x 2, map 4:3, panel stacked under the map,
 * 40px zoom buttons. 768 → map 16:10. 1024 → stats in one row, map 1306:635. 1280+ → panel and zoom
 * overlaid on the map as drawn (map at least 600px tall so the 538px panel fits).
 */
export function InteractiveMap({
  stats,
  regions,
  dots,
  title = "We span",
  variant = "port",
  overlay,
  defaultRegion,
  bg = "white",
  id = "we-span",
  className = "",
}: InteractiveMapProps) {
  const headingId = `${id}-title`;
  return (
    <Section bg={bg} id={id} aria-labelledby={headingId} className={`${PAD.block} ${className}`}>
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-[60px]">
        <MapStatsRow title={title} stats={stats} headingId={headingId} />
        <MapExplorer
          regions={regions}
          dots={dots}
          variant={variant}
          overlay={overlay}
          defaultRegion={defaultRegion}
          idPrefix={id}
        />
      </div>
    </Section>
  );
}
