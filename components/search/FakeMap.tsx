"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Property } from "@/data/types";
import { LAND, LABELS, ROADS, WATER, type LatLng } from "@/data/mapGeometry";
import { Icon } from "@/components/ui/Icon";
import { pinText } from "@/lib/display";
import type { Bbox } from "@/lib/filters";

type Props = {
  pins: Property[];
  /** When this changes the map refits to the pins and forgets any pan. */
  fitKey: string;
  hoveredId: string | null;
  selectedId: string | null;
  onPinClick: (id: string) => void;
  onPinHover: (id: string | null) => void;
  onSearchArea: (bbox: Bbox) => void;
  /** Extra bottom inset in px (mobile carousel) so fitted pins clear it */
  bottomInset?: number;
  className?: string;
  children?: React.ReactNode;
};

type View = { lat: number; lng: number; k: number };

const COS = Math.cos((35.5 * Math.PI) / 180);
const K_MIN = 40;
const K_MAX = 8000;
const JAPAN: View = { lat: 36.2, lng: 137.6, k: 70 };

function fit(pins: Property[], w: number, h: number, bottomInset: number): View {
  if (!pins.length || !w || !h) return JAPAN;
  let s = 90, n = -90, west = 180, e = -180;
  for (const p of pins) {
    s = Math.min(s, p.lat); n = Math.max(n, p.lat);
    west = Math.min(west, p.lng); e = Math.max(e, p.lng);
  }
  const usableH = Math.max(120, h - bottomInset - 100);
  const kx = (w - 200) / Math.max(0.02, (e - west) * COS);
  const ky = usableH / Math.max(0.02, n - s);
  const k = Math.min(K_MAX, Math.max(K_MIN, Math.min(kx, ky, pins.length === 1 ? 700 : 420)));
  // Shift the centre down so pins sit above any bottom inset.
  const lat = (s + n) / 2 - bottomInset / 2 / k;
  return { lat, lng: (west + e) / 2, k };
}

/**
 * Simulated map. No tiles, no API key: a greyscale SVG of Japan drawn in the same
 * projection as the pins. Drag or use arrow keys to pan, buttons to zoom. Panning or
 * zooming reveals "Search this area", which only refilters when pressed.
 */
export function FakeMap({ pins, fitKey, hoveredId, selectedId, onPinClick, onPinHover, onSearchArea, bottomInset = 0, className = "", children }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>(JAPAN);
  const [moved, setMoved] = useState(false);
  const drag = useRef<{ x: number; y: number; view: View; dist: number } | null>(null);
  const fittedFor = useRef<string | null>(null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // Refit when the search changes, or when the map resizes before the user has touched it.
  // Streaming in more results does not refit, so the map never jumps while the list scrolls.
  const touched = useRef(false);
  useEffect(() => {
    if (!size.w || !size.h) return;
    const newSearch = fittedFor.current !== fitKey;
    if (!newSearch && touched.current) return;
    fittedFor.current = fitKey;
    touched.current = false;
    setView(fit(pins, size.w, size.h, bottomInset));
    setMoved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pins intentionally read at fit time only
  }, [fitKey, size.w, size.h, bottomInset]);

  const project = useCallback(
    ([lat, lng]: LatLng) => ({ x: size.w / 2 + (lng - view.lng) * view.k * COS, y: size.h / 2 - (lat - view.lat) * view.k }),
    [size, view],
  );

  const toPath = useCallback(
    (pts: LatLng[], close: boolean) =>
      pts.map((p, i) => {
        const { x, y } = project(p);
        return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join("") + (close ? "Z" : ""),
    [project],
  );

  const land = useMemo(() => LAND.map((poly) => toPath(poly, true)), [toPath]);
  const water = useMemo(() => WATER.map((poly) => toPath(poly, true)), [toPath]);
  const roads = useMemo(() => ROADS.map((r) => ({ major: r.major, d: toPath(r.path, false) })), [toPath]);

  const zoom = (factor: number) => {
    touched.current = true;
    setView((v) => ({ ...v, k: Math.min(K_MAX, Math.max(K_MIN, v.k * factor)) }));
    setMoved(true);
  };

  const pan = (dx: number, dy: number) => {
    touched.current = true;
    setView((v) => ({ ...v, lng: v.lng - dx / (v.k * COS), lat: v.lat + dy / v.k }));
    setMoved(true);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, view, dist: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    d.dist = Math.max(d.dist, Math.hypot(dx, dy));
    setView({ ...d.view, lng: d.view.lng - dx / (d.view.k * COS), lat: d.view.lat + dy / d.view.k });
    if (d.dist > 4) {
      setMoved(true);
      touched.current = true;
    }
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const step = 60;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => pan(step, 0),
      ArrowRight: () => pan(-step, 0),
      ArrowUp: () => pan(0, step),
      ArrowDown: () => pan(0, -step),
      "+": () => zoom(1.5),
      "=": () => zoom(1.5),
      "-": () => zoom(1 / 1.5),
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  const searchArea = () => {
    const halfW = size.w / 2 / (view.k * COS);
    const halfH = (size.h / 2) / view.k;
    onSearchArea([view.lat - halfH, view.lng - halfW, view.lat + halfH, view.lng + halfW]);
    setMoved(false);
  };

  const labels = LABELS.filter((l) => view.k >= l.minK);

  // Label layout: pins that would overlap are nudged to the nearest free slot, so every result keeps its own pin.
  const placed = useMemo(() => {
    const W = 96, H = 34;
    const OFFSETS = [[0, 0], [0, -H], [0, H], [-W, 0], [W, 0], [-W, -H], [W, -H], [-W, H], [W, H], [0, -2 * H], [0, 2 * H], [-2 * W, 0], [2 * W, 0]];
    const boxes: { x: number; y: number }[] = [];
    const out = new Map<string, { x: number; y: number; ax: number; ay: number }>();
    for (const p of pins) {
      const a = project([p.lat, p.lng]);
      let pos = a;
      for (const [dx, dy] of OFFSETS) {
        const c = { x: a.x + dx, y: a.y + dy };
        const inside = c.x > W / 2 && c.x < size.w - W / 2 && c.y > H && c.y < size.h - H;
        if ((dx || dy) && !inside) continue;
        if (!boxes.some((b) => Math.abs(b.x - c.x) < W - 4 && Math.abs(b.y - c.y) < H - 2)) {
          pos = c;
          break;
        }
      }
      boxes.push(pos);
      out.set(p.id, { x: pos.x, y: pos.y, ax: a.x, ay: a.y });
    }
    return out;
  }, [pins, project, size]);

  // Minor street texture, anchored to the map so it pans with it.
  const origin = project([36, 138]);
  const tile = Math.max(40, view.k * 0.12);
  const raised = selectedId ?? hoveredId;

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      role="region"
      aria-label="Map of results (simulated). Drag or use arrow keys to pan, plus and minus to zoom."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
      className={`focus-inset relative cursor-grab touch-none select-none overflow-hidden bg-[#D7DADE] active:cursor-grabbing ${className}`}
    >
      {size.w > 0 && (
        <svg aria-hidden="true" width={size.w} height={size.h} className="absolute inset-0">
          <defs>
            <clipPath id="land-clip">
              {land.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </clipPath>
            <pattern id="streets" patternUnits="userSpaceOnUse" width={tile} height={tile} patternTransform={`translate(${origin.x % tile} ${origin.y % tile})`}>
              <path
                d={`M0 ${tile * 0.3}H${tile} M${tile * 0.15} 0V${tile} M0 ${tile * 0.78}L${tile} ${tile * 0.62} M${tile * 0.62} 0L${tile * 0.7} ${tile} M${tile * 0.35} ${tile * 0.3}L${tile * 0.45} ${tile * 0.7}`}
                stroke="#E8EAED"
                strokeWidth={1}
                fill="none"
              />
            </pattern>
          </defs>
          {land.map((d, i) => (
            <path key={i} d={d} fill="#F5F6F8" stroke="#C4C8CD" strokeWidth={1} strokeLinejoin="round" />
          ))}
          {view.k >= 150 && <rect width={size.w} height={size.h} fill="url(#streets)" clipPath="url(#land-clip)" />}
          {water.map((d, i) => (
            <path key={i} d={d} fill="#D7DADE" />
          ))}
          {roads.map((r, i) => (
            <g key={i}>
              <path d={r.d} fill="none" stroke="#DADDE1" strokeWidth={r.major ? 4.5 : 3} strokeLinecap="round" strokeLinejoin="round" />
              <path d={r.d} fill="none" stroke="#FFFFFF" strokeWidth={r.major ? 2.5 : 1.5} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
          {pins.map((p) => {
            const pl = placed.get(p.id);
            if (!pl || (pl.x === pl.ax && pl.y === pl.ay)) return null;
            return <line key={p.id} x1={pl.ax} y1={pl.ay} x2={pl.x} y2={pl.y} stroke="#111826" strokeOpacity={0.35} strokeWidth={1} />;
          })}
          {pins.map((p) => {
            const pl = placed.get(p.id);
            return pl ? <circle key={p.id} cx={pl.ax} cy={pl.ay} r={2.5} fill="#111826" /> : null;
          })}
          {labels.map((l) => {
            const { x, y } = project(l.at);
            if (x < -40 || y < -20 || x > size.w + 40 || y > size.h + 20) return null;
            return (
              <text key={l.name} x={x} y={y} dy={-6} textAnchor="middle" className="fill-muted text-[11px] font-medium" style={{ paintOrder: "stroke", stroke: "#F5F6F8", strokeWidth: 3 }}>
                {l.name}
              </text>
            );
          })}
        </svg>
      )}

      {/* Pins: one per visible result, labelled with size */}
      {size.w > 0 &&
        pins.map((p) => {
          const { x, y } = placed.get(p.id)!;
          if (x < -60 || y < -30 || x > size.w + 60 || y > size.h + 30) return null;
          const on = hoveredId === p.id || selectedId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              data-pin={p.id}
              onClick={() => onPinClick(p.id)}
              onMouseEnter={() => onPinHover(p.id)}
              onMouseLeave={() => onPinHover(null)}
              aria-label={`${p.name}, ${p.city}. ${pinText(p)}. Show in list`}
              aria-pressed={selectedId === p.id}
              className={`absolute left-0 top-0 inline-flex h-8 items-center whitespace-nowrap rounded-full border px-3 text-xs font-medium tabular-nums shadow-sm transition-colors duration-100 ${
                on ? "border-ink bg-ink text-white" : "border-ink bg-white text-ink hover:bg-surface"
              }`}
              style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${on ? 1.08 : 1})`, zIndex: raised === p.id ? 20 : on ? 15 : 10 }}
            >
              {pinText(p)}
            </button>
          );
        })}

      {/* Draw your own area: visible but non-functional */}
      <button
        type="button"
        aria-disabled="true"
        title="Drawing an area is not part of this prototype"
        className="absolute left-3 top-3 z-30 inline-flex h-10 cursor-default items-center gap-2 rounded-btn border border-ink bg-white px-3 text-sm"
      >
        <Icon name="gesture" />
        Draw your own area
      </button>

      <div className="absolute right-3 top-3 z-30 flex flex-col overflow-hidden rounded-btn border border-line bg-white">
        <button type="button" aria-label="Zoom in" onClick={() => zoom(1.5)} className="focus-inset inline-flex size-10 items-center justify-center hover:bg-surface">
          <Icon name="add" />
        </button>
        <span className="h-px bg-line" />
        <button type="button" aria-label="Zoom out" onClick={() => zoom(1 / 1.5)} className="focus-inset inline-flex size-10 items-center justify-center hover:bg-surface">
          <Icon name="remove" />
        </button>
      </div>

      {moved && (
        <div className="pointer-events-none absolute inset-x-0 z-30 flex justify-center" style={{ bottom: bottomInset + 20 }}>
          <button
            type="button"
            onClick={searchArea}
            className="anim-pop pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white shadow-panel"
          >
            <Icon name="refresh" />
            Search this area
          </button>
        </div>
      )}

      <p className="pointer-events-none absolute left-3 z-30 rounded-[4px] bg-white px-1.5 py-0.5 text-[11px] text-muted" style={{ bottom: bottomInset ? bottomInset + 8 : 10 }}>
        Simulated map
      </p>
      {children}
    </div>
  );
}
