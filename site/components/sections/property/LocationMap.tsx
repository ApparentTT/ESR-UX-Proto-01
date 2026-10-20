"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { GUTTER } from "./PropertyBlocks";
import { MapZoomControls } from "@/components/sections/map/MapZoomControls";
import { SmartLink } from "@/components/ui/SmartLink";

type Pt = { x: number; y: number };
export type LocationMapCopy = {
  src: string;
  width: number;
  height: number;
  alt: string;
  pin: Pt;
  landmarks: (Pt & { label: string })[];
  zoom: { min: number; max: number; step: number };
  /** mobileOnly: drawn at 390 only */
  rows: { title: string; value: string; body: string; mobileOnly?: boolean }[];
  /** "Get directions" (drawn at 390 only; inert) */
  directions: string;
  /** "Estate page": the outline button to the overall estate page, at every width (not in the prototype: href null) */
  estate: { label: string; href: string | null };
};

/**
 * "LocationDeepDive" (1507:52332): surface band, 80 / 80 with 67px sides at 1440: the map (760 x 460, radius 12,
 * line border, the map image at 40% on white) beside the access rows (Medium 18 title + muted 14 "[XX min]",
 * muted 15 sentence, 18px padding, line rules), 40px apart and vertically centred. The estate pin is the drawn
 * dark pill with the warehouse icon (labelled with the property name) and the [Feature] pins are white outline
 * pills. 390 (1507:59203): stacked, the map 342 x 280, a fifth row ("Labour catchment") and a dark full-width
 * "Get directions" (inert: directions are not part of the prototype). Under the rows at every width, the outline
 * "Estate page" button (review feedback; the property page's outline button style) to the overall estate page:
 * beside Get directions from 768, under it (both full width) at 390, on its own at 1024+.
 * Zoom: the shared + / − controls (MapZoomControls) scale the map image around the estate pin, so the pin stays
 * where it is; feature pins move outward with the image and keep their size. Buttons are keyboard operable and
 * the new zoom level is announced.
 */
export function LocationMap({ map, name }: { map: LocationMapCopy; name: string }) {
  const headingId = useId();
  const [zoom, setZoom] = useState(map.zoom.min);
  const { pin } = map;
  const place = (p: Pt) => ({ left: `${pin.x + (p.x - pin.x) * zoom}%`, top: `${pin.y + (p.y - pin.y) * zoom}%` });
  const set = (z: number) => setZoom(Math.min(map.zoom.max, Math.max(map.zoom.min, z)));

  return (
    <section aria-labelledby={headingId} className="bg-surface py-14 md:py-16 lg:py-20">
      <h2 id={headingId} className="sr-only">
        Location and access
      </h2>
      <div className={`${GUTTER} flex flex-col gap-5 md:gap-8 lg:flex-row lg:items-center lg:gap-10`}>
        <div
          className="relative aspect-[342/280] w-full shrink-0 overflow-hidden rounded-card border border-line bg-white md:aspect-[1088/635] lg:aspect-[760/460] lg:w-[58%] lg:max-w-[760px]"
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
          <div data-print="hide" className="contents">
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

        <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-0">
          <ul className="flex flex-col">
            {map.rows.map((r, i) => (
              <li
                key={r.title}
                className={`flex flex-col gap-[5px] border-line py-4 leading-[1.5] lg:border-b lg:border-t-0 lg:py-[18px] ${i > 0 ? "border-t" : ""} ${
                  r.mobileOnly ? "lg:hidden" : ""
                }`}
              >
                <div className="flex items-center gap-2.5 font-medium">
                  <h3 className="min-w-0 flex-1 text-[17px] text-ink lg:text-[18px]">{r.title}</h3>
                  <span className="shrink-0 whitespace-nowrap text-[14px] text-muted-surface">{r.value}</span>
                </div>
                <p className="text-[14px] text-muted-surface lg:text-[15px]">{r.body}</p>
              </li>
            ))}
          </ul>
          <div data-print="hide" className="flex flex-col gap-3 md:flex-row lg:mt-8">
            <SmartLink
              href={null}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-btn bg-ink py-3.5 pl-[22px] pr-[18px] text-[15px] font-medium leading-[1.5] text-white transition-colors hover:bg-black md:flex-1 lg:hidden"
            >
              {map.directions}
              <Icon name="arrow_forward" size={18} />
            </SmartLink>
            <SmartLink
              href={map.estate.href}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-btn border border-ink bg-white py-3.5 pl-[22px] pr-[18px] text-[15px] font-medium leading-[1.5] text-ink transition-colors hover:bg-surface md:flex-1 lg:w-auto lg:flex-none lg:self-start lg:pl-[26px] lg:pr-[22px]"
            >
              {map.estate.label}
              <Icon name="arrow_forward" size={18} />
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
