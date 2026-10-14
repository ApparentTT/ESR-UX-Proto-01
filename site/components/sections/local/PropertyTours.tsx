"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";
import { PAD, T } from "@/components/ui/type";
import { LAND, PLACES, ROADS, WATER, type LatLng } from "@/data/mapGeometry";
import type { Tour } from "@/data/site/local/property-tours";

type Copy = {
  upcomingTitle: string;
  upcomingCount: string;
  mapHint: string;
  listTitle: string;
  listSub: string;
  pastLabel: string;
  pastBadge: string;
  selectedBadge: string;
  signUp: string;
  signUpClosed: string;
  signUpHref: string | null;
  close: string;
};

/**
 * Property tours (Local_PropertyTours 1258:28925 "UpcomingEventsByMap" + 1258:28940 "PropertyTourList", with
 * the drawn clicked state and annotation 1258:29850). The map is a simplified greyscale Japan (the property
 * search's outline) fitted to the upcoming tours; each upcoming tour has a pin (past tours have none).
 * Clicking a pin opens a card anchored to it (on top of the map from 768, under the map below that) and
 * highlights the matching row ("Selected on map"). The same pin again, the close button, Esc or a click on the
 * map clears both. One pin at a time.
 */
export function PropertyTours({ tours, copy }: { tours: Tour[]; copy: Copy }) {
  const [selected, setSelected] = useState<string | null>(null);
  const toggle = (id: string) => setSelected((s) => (s === id ? null : id));
  return (
    <>
      <TourMap tours={tours} copy={copy} selected={selected} onToggle={toggle} onClear={() => setSelected(null)} />
      <TourList tours={tours} copy={copy} selected={selected} />
    </>
  );
}

/* ------------------------------------------------------------------------------------------------ map */

const COS = Math.cos((35.3 * Math.PI) / 180);
/** Area every upcoming tour sits in (Kansai to Kanto), kept in view at every size */
const FIT = { lat: [34.45, 35.85] as const, lng: [134.95, 140.2] as const };
const LABELS: { name: string; at: LatLng }[] = [
  { name: "Tokyo", at: PLACES.tokyo },
  { name: "Nagoya", at: PLACES.nagoya },
  { name: "Osaka", at: PLACES.osaka },
  { name: "Kyoto", at: PLACES.kyoto },
  { name: "Shizuoka", at: PLACES.shizuoka },
];

function useSize<T extends HTMLElement>(fallback: { w: number; h: number }) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, ...size };
}

function TourMap({
  tours,
  copy,
  selected,
  onToggle,
  onClear,
}: {
  tours: Tour[];
  copy: Copy;
  selected: string | null;
  onToggle: (id: string) => void;
  onClear: () => void;
}) {
  const headingId = useId();
  const popId = useId();
  const { ref, w, h } = useSize<HTMLDivElement>({ w: 1306, h: 420 });
  const pins = tours.filter((t) => t.pin && !t.past);
  const active = pins.find((t) => t.id === selected) ?? null;

  // Fit the tour area ("meet"), centred; the rest of the outline fills the frame around it.
  const spanX = (FIT.lng[1] - FIT.lng[0]) * COS;
  const spanY = FIT.lat[1] - FIT.lat[0];
  const s = Math.min(w / (spanX * 1.12), h / (spanY * 1.25));
  const cLat = (FIT.lat[0] + FIT.lat[1]) / 2;
  const cLng = (FIT.lng[0] + FIT.lng[1]) / 2;
  const px = ([lat, lng]: LatLng) => [w / 2 + (lng - cLng) * COS * s, h / 2 - (lat - cLat) * s] as const;
  const path = (pts: LatLng[], close = true) => pts.map((p, i) => `${i ? "L" : "M"}${px(p)[0].toFixed(1)},${px(p)[1].toFixed(1)}`).join("") + (close ? "Z" : "");

  // Esc clears the selection
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClear();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onClear]);

  // Popover beside the pin (768+), kept inside the map
  const POP_W = 280;
  const POP_H = 300;
  let popStyle: React.CSSProperties | undefined;
  if (active?.pin) {
    const [x, y] = px(active.pin.at);
    const left = x > w / 2 ? x - POP_W - 20 : x + 20;
    popStyle = { left: Math.max(12, Math.min(left, w - POP_W - 12)), top: Math.max(12, Math.min(y - POP_H / 2, h - POP_H - 12)), width: POP_W };
  }

  return (
    <Section bg="surface" aria-labelledby={headingId} className={PAD.mid} containerClassName="flex flex-col gap-6 lg:gap-7">
      <div className="flex items-center gap-4">
        <h2 id={headingId} className={`${T.h36b} flex-1`}>
          {copy.upcomingTitle}
        </h2>
        <p className="whitespace-nowrap text-[14px] font-medium leading-[1.48] text-muted-surface">{copy.upcomingCount}</p>
      </div>
      <div
        ref={ref}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button, a, [data-popover]")) onClear();
        }}
        className="relative h-[260px] overflow-hidden rounded-card border border-line bg-[#EEF0F2] md:h-[340px] lg:h-[420px]"
      >
        <svg aria-hidden="true" width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0">
          {LAND.map((poly, i) => (
            <path key={i} d={path(poly)} fill="#fff" stroke="#D5D8DC" strokeWidth={1} />
          ))}
          {WATER.map((poly, i) => (
            <path key={i} d={path(poly)} fill="#EEF0F2" />
          ))}
          {ROADS.map((r, i) => (
            <path key={i} d={path(r.path, false)} fill="none" stroke={r.major ? "#C9CDD2" : "#DDE0E3"} strokeWidth={r.major ? 2 : 1.25} strokeLinejoin="round" />
          ))}
        </svg>
        {LABELS.map((l) => {
          const [x, y] = px(l.at);
          return (
            <span
              key={l.name}
              aria-hidden="true"
              className={`pointer-events-none absolute -translate-y-1/2 translate-x-1.5 text-[11px] font-medium text-[#5F6670] ${l.name === "Tokyo" ? "hidden md:block" : ""}`}
              style={{ left: x, top: y }}
            >
              {l.name}
            </span>
          );
        })}
        <ul aria-label="Upcoming tours on the map">
          {pins.map((t, i) => {
            const [x, y] = px(t.pin!.at);
            const on = t.id === selected;
            const dark = on || !selected;
            // Alternate the pill above / below its dot so pins that sit close together stay apart
            const up = i % 2 === 0;
            return (
              <li key={t.id} className="absolute" style={{ left: x, top: y }}>
                <span aria-hidden="true" className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-white" />
                <button
                  type="button"
                  aria-pressed={on}
                  aria-controls={on ? popId : undefined}
                  onClick={() => onToggle(t.id)}
                  className={`absolute left-0 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border px-[11px] py-[5px] text-[12px] font-medium leading-[1.48] transition-colors ${
                    up ? "bottom-2" : "top-2"
                  } ${dark ? "border-ink bg-ink text-white hover:bg-black" : "border-black bg-[#E9E9E9] text-ink hover:bg-white"}`}
                >
                  <Icon name="tour" size={16} />
                  {t.pin!.label}
                  <span className="sr-only">
                    : {t.date}, {t.address}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="pointer-events-none absolute bottom-2.5 left-4 text-[12px] leading-[1.48] text-muted-surface">{copy.mapHint}</p>
        {active && (
          <div data-popover id={popId} className="absolute hidden md:block" style={popStyle}>
            <TourCard tour={active} copy={copy} onClose={onClear} />
          </div>
        )}
      </div>
      {active && (
        <div data-popover className="md:hidden">
          <TourCard tour={active} copy={copy} onClose={onClear} />
        </div>
      )}
    </Section>
  );
}

function TourCard({ tour, copy, onClose }: { tour: Tour; copy: Copy; onClose: () => void }) {
  return (
    <div role="group" aria-label={`${tour.name}, ${tour.date}`} className="overflow-hidden rounded-[9px] bg-white shadow-[0_8px_21px_rgba(0,0,0,0.18)]">
      <div className="relative">
        <ImagePlaceholder className="h-[113px] w-full" iconSize={28} />
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-white text-ink hover:bg-surface"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-1.5 px-4 pb-3.5 pt-3">
        <Meta tour={tour} size="sm" />
        <p className="text-[15px] font-medium leading-[1.48] text-ink">{tour.name}</p>
        <Address tour={tour} size="sm" />
        <SmartLink
          href={copy.signUpHref}
          className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-[5px] bg-ink py-2.5 text-[13px] font-medium leading-[1.48] text-white hover:bg-black"
        >
          {copy.signUp}
          <Icon name="open_in_new" size={15} />
        </SmartLink>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------ list */

function Meta({ tour, size = "md", badge }: { tour: Tour; size?: "sm" | "md"; badge?: React.ReactNode }) {
  const text = size === "sm" ? "text-[12px]" : "text-[14px]";
  const icon = size === "sm" ? 14 : 17;
  return (
    <div className={`flex flex-wrap items-center gap-x-3.5 gap-y-1 leading-[1.48] ${text}`}>
      <span className={`inline-flex items-center gap-1.5 font-medium ${tour.past ? "text-muted-surface" : "text-ink"}`}>
        <Icon name="calendar_today" size={icon} className="text-muted-surface" />
        {tour.date}
      </span>
      <span className="inline-flex items-center gap-1.5 text-muted-surface">
        <Icon name="schedule" size={icon} />
        {tour.time}
      </span>
      {badge}
    </div>
  );
}

function Address({ tour, size = "md" }: { tour: Tour; size?: "sm" | "md" }) {
  return (
    <p className={`flex items-start gap-1.5 leading-[1.48] text-muted-surface ${size === "sm" ? "text-[12px]" : "text-[14px]"}`}>
      <Icon name="location_on" size={size === "sm" ? 14 : 17} className="mt-px shrink-0" />
      {tour.address}
    </p>
  );
}

function TourList({ tours, copy, selected }: { tours: Tour[]; copy: Copy; selected: string | null }) {
  const headingId = useId();
  const upcoming = tours.filter((t) => !t.past);
  const past = tours.filter((t) => t.past);
  return (
    <Section aria-labelledby={headingId} className={PAD.block} containerClassName="flex flex-col gap-6 lg:gap-7">
      <div className="flex flex-col gap-2">
        <h2 id={headingId} className={T.h36b}>
          {copy.listTitle}
        </h2>
        <p className={T.body17}>{copy.listSub}</p>
      </div>
      <div>
        <ul>
          {upcoming.map((t) => (
            <TourRow key={t.id} tour={t} copy={copy} selected={t.id === selected} />
          ))}
        </ul>
        {past.length > 0 && (
          <>
            <h3 className="mt-5 border-t border-line pt-2.5 text-[14px] font-medium leading-[1.48] text-muted lg:mt-8">{copy.pastLabel}</h3>
            <ul>
              {past.map((t) => (
                <TourRow key={t.id} tour={t} copy={copy} selected={false} />
              ))}
            </ul>
          </>
        )}
      </div>
    </Section>
  );
}

function TourRow({ tour, copy, selected }: { tour: Tour; copy: Copy; selected: boolean }) {
  const badge = tour.past ? (
    <span className="rounded-[4px] bg-surface px-2.5 py-1 text-[12px] font-medium leading-[1.48] text-muted-surface">{copy.pastBadge}</span>
  ) : selected ? (
    <span className="rounded-[4px] bg-ink px-2.5 py-1 text-[12px] font-medium leading-[1.48] text-white">{copy.selectedBadge}</span>
  ) : null;
  return (
    <li className="border-b border-line">
      <article
        className={`flex flex-col gap-4 py-6 transition-colors md:flex-row md:items-center md:gap-6 ${selected ? "my-1 rounded-card bg-surface px-4 md:px-5" : ""}`}
      >
        <ImagePlaceholder className={`aspect-[200/130] w-full shrink-0 rounded-control md:w-[160px] lg:w-[200px] ${tour.past ? "opacity-55" : ""}`} iconSize={28} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Meta tour={tour} badge={badge} />
          <h3 className={`text-[20px] font-medium leading-[1.48] lg:text-[22px] ${tour.past ? "text-muted" : "text-ink"}`}>{tour.name}</h3>
          <Address tour={tour} />
        </div>
        {tour.past ? (
          <span className="inline-flex min-h-[43px] shrink-0 items-center justify-center rounded-btn bg-surface px-[22px] text-[14px] font-medium leading-[1.48] text-muted-surface">
            {copy.signUpClosed}
          </span>
        ) : (
          <SmartLink
            href={copy.signUpHref}
            className="inline-flex min-h-[43px] shrink-0 items-center justify-center gap-2 rounded-btn bg-ink pl-[22px] pr-[18px] text-[14px] font-medium leading-[1.48] text-white hover:bg-black"
          >
            {copy.signUp}
            <span className="sr-only">: {tour.date}</span>
            <Icon name="open_in_new" size={17} />
          </SmartLink>
        )}
      </article>
    </li>
  );
}
