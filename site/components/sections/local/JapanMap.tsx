"use client";

import { useId, useState } from "react";
import { Section } from "@/components/ui/Section";
import { PAD } from "@/components/ui/type";
import { MapStatsRow } from "@/components/sections/map/MapStatsRow";
import { MapZoomControls } from "@/components/sections/map/MapZoomControls";
import type { MapStat } from "@/components/sections/map/types";

const ZOOM = { min: 1, max: 2, step: 0.5 };

/**
 * "We span" stats and the Japan map (Figma InteractiveMap 1110:63787 on R2_local_PortfolioOverview-Japan):
 * the group "We span" stats row, then the drawn map (Japan in dark grey with the Kanto, Kansai, Chubu and
 * Fukuoka region call-outs) as a static image exported from the frame, with the group map's + / − zoom
 * buttons. The map is 1306:635 from 1024, 16:10 at 768 and 4:3 at 390, cropped around Japan. Zoom scales the
 * image around the centre (no motion with reduced motion). The region names are listed for screen readers.
 */
export function JapanMap({ stats, regions, title = "We span" }: { stats: MapStat[]; regions: string[]; title?: string }) {
  const uid = useId();
  const headingId = `${uid}-title`;
  const [zoom, setZoom] = useState(ZOOM.min);
  return (
    <Section aria-labelledby={headingId} className={PAD.block}>
      <div className="flex flex-col gap-8 md:gap-10 lg:gap-[60px]">
        <MapStatsRow title={title} stats={stats} headingId={headingId} />
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EFEFEF] md:aspect-[16/10] lg:aspect-[1306/635]">
          {/* eslint-disable-next-line @next/next/no-img-element -- a static export, no optimisation needed */}
          <img
            src="/local/japan-map.png"
            alt=""
            width={1306}
            height={635}
            draggable={false}
            className="absolute inset-0 size-full select-none object-cover transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: `scale(${zoom})` }}
          />
          <p className="sr-only">
            Map of Japan showing the {regions.length} regions:
          </p>
          <ul className="sr-only">
            {regions.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <MapZoomControls
            zoom={zoom}
            min={ZOOM.min}
            max={ZOOM.max}
            onZoomIn={() => setZoom((z) => Math.min(ZOOM.max, z + ZOOM.step))}
            onZoomOut={() => setZoom((z) => Math.max(ZOOM.min, z - ZOOM.step))}
          />
        </div>
      </div>
    </Section>
  );
}
