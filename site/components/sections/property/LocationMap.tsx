"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { MapZoomControls } from "@/components/sections/map/MapZoomControls";

type Pt = { x: number; y: number };
export type LocationMapCopy = {
  src: string;
  width: number;
  height: number;
  alt: string;
  pin: Pt;
  landmarks: (Pt & { label: string })[];
  zoom: { min: number; max: number; step: number };
  rows: { title: string; value: string; body: string }[];
};

/**
 * "LocationDeepDive" (1478:49678). 80 / 80 with 67px sides at 1440: the map (760 x 460, radius 12, line border, the
 * map image at 40% on white) beside the four access rows (Medium 18 title + muted 14 "[XX min]", muted 15 sentence,
 * 18px padding, line rules), 40px apart. The estate pin is the drawn dark pill with the warehouse icon (labelled with
 * the property name) and the [Landmark] pins are white outline pills.
 * Zoom: the shared + / − controls (MapZoomControls) scale the map image around the estate pin, so the pin stays
 * where it is; landmark pins move outward with the image and keep their size. Buttons are keyboard operable and
 * the new zoom level is announced. Stacked below 1024; on the surface grey at 390 as drawn.
 */
export function LocationMap({ map, name }: { map: LocationMapCopy; name: string }) {
  const headingId = useId();
  const [zoom, setZoom] = useState(map.zoom.min);
  const { pin } = map;
  const place = (p: Pt) => ({ left: `${pin.x + (p.x - pin.x) * zoom}%`, top: `${pin.y + (p.y - pin.y) * zoom}%` });
  const set = (z: number) => setZoom(Math.min(map.zoom.max, Math.max(map.zoom.min, z)));

  return (
    <section aria-labelledby={headingId} className="bg-surface py-12 md:py-16 lg:bg-white lg:px-[67px] lg:py-20" data-print-section>
      <h2 id={headingId} className="sr-only">
        Location and access
      </h2>
      <div className="mx-auto flex max-w-[1306px] flex-col gap-8 px-6 md:px-10 lg:flex-row lg:items-start lg:gap-10 lg:px-0">
        <div
          className="relative aspect-[342/260] w-full shrink-0 overflow-hidden rounded-card border border-line bg-white md:aspect-[1088/635] lg:w-[58%] lg:max-w-[760px] lg:aspect-[760/460]"
          data-print-avoid
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- a static map tile, no optimisation needed */}
          <img
            src={map.src}
            alt={map.alt}
            width={map.width}
            height={map.height}
            draggable={false}
            className="absolute inset-0 size-full select-none object-cover opacity-40 transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: `scale(${zoom})`, transformOrigin: `${pin.x}% ${pin.y}%`, objectPosition: `${pin.x}% ${pin.y}%` }}
          />
          {map.landmarks.map((l, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-ink bg-white px-[9px] py-1.5 text-[11px] font-medium leading-[1.5] text-ink transition-[left,top] duration-300 motion-reduce:transition-none"
              style={place(l)}
            >
              {l.label}
            </span>
          ))}
          <span
            className="absolute z-[1] flex max-w-[80%] -translate-x-1/2 -translate-y-1/2 items-center gap-[7px] rounded-full bg-ink px-3 py-2 text-white shadow-sm"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <Icon name="warehouse" size={16} />
            <span className="truncate text-[12px] font-medium leading-[1.5]">{name}</span>
          </span>
          <div data-print-hide>
            <MapZoomControls
              zoom={zoom}
              min={map.zoom.min}
              max={map.zoom.max}
              onZoomIn={() => set(zoom + map.zoom.step)}
              onZoomOut={() => set(zoom - map.zoom.step)}
            />
          </div>
          <p className="sr-only" aria-live="polite">
            {zoom > map.zoom.min ? `Map zoomed to ${Math.round(zoom * 100)}%` : ""}
          </p>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col">
          {map.rows.map((r) => (
            <li key={r.title} className="flex flex-col gap-[5px] border-b border-line py-[18px] leading-[1.5]">
              <div className="flex items-center gap-2.5 font-medium">
                <h3 className="min-w-0 flex-1 text-[17px] text-ink lg:text-[18px]">{r.title}</h3>
                <span className="shrink-0 whitespace-nowrap text-[14px] text-muted-surface lg:text-muted">{r.value}</span>
              </div>
              <p className="text-[15px] text-muted-surface lg:text-muted">{r.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
