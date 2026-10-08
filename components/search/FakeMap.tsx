"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Property } from "@/data/types";
import { LAND, LABELS, ROADS, WATER, type LatLng } from "@/data/mapGeometry";
import { Icon } from "@/components/ui/Icon";
import { pinText } from "@/lib/display";
import type { Bbox } from "@/lib/filters";
import { simplifyPolygon } from "@/lib/geo";

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
  /** The applied hand-drawn search area, drawn with everything outside it dimmed */
  area?: LatLng[] | null;
  /** Enables Draw your own area. Called with the finished outline, or null to clear it. */
  onDrawArea?: (area: LatLng[] | null) => void;
  /** Ask the map to enter drawing mode as soon as it can (from a filter panel or a link). */
  drawRequested?: boolean;
  onDrawRequestHandled?: () => void;
  /** Called when drawing starts, so the page can bring the whole map into view */
  onDrawStart?: () => void;
  className?: string;
  children?: React.ReactNode;
};

type View = { lat: number; lng: number; k: number };

const COS = Math.cos((35.5 * Math.PI) / 180);
const K_MIN = 40;
const K_MAX = 8000;
const JAPAN: View = { lat: 36.2, lng: 137.6, k: 70 };

function fit(pins: Property[], area: LatLng[] | null | undefined, w: number, h: number, bottomInset: number): View {
  const pts: LatLng[] = [...pins.map((p) => [p.lat, p.lng] as LatLng), ...(area ?? [])];
  if (!pts.length || !w || !h) return JAPAN;
  let s = 90, n = -90, west = 180, e = -180;
  for (const [lat, lng] of pts) {
    s = Math.min(s, lat); n = Math.max(n, lat);
    west = Math.min(west, lng); e = Math.max(e, lng);
  }
  const usableH = Math.max(120, h - bottomInset - 100);
  const kx = (w - 200) / Math.max(0.02, (e - west) * COS);
  const ky = usableH / Math.max(0.02, n - s);
  const k = Math.min(K_MAX, Math.max(K_MIN, Math.min(kx, ky, pts.length === 1 ? 700 : 420)));
  // Shift the centre down so pins sit above any bottom inset.
  const lat = (s + n) / 2 - bottomInset / 2 / k;
  return { lat, lng: (west + e) / 2, k };
}

const DRAW_HELP = "Drawing an area. Press and drag to draw, or click to place points and click the first point to finish. Keyboard: arrow keys move the map, Enter places a point at the centre, Backspace removes the last point, Escape cancels.";

/**
 * Simulated map. No tiles, no API key: a greyscale SVG of Japan drawn in the same
 * projection as the pins. Drag or use arrow keys to pan, buttons to zoom. Panning or
 * zooming reveals "Search this area", which only refilters when pressed.
 * Draw your own area: freehand (press and drag) or point by point (click, or Enter at the
 * centre crosshair from the keyboard). Finishing the shape applies it straight away.
 */
export function FakeMap({
  pins,
  fitKey,
  hoveredId,
  selectedId,
  onPinClick,
  onPinHover,
  onSearchArea,
  bottomInset = 0,
  area = null,
  onDrawArea,
  drawRequested,
  onDrawRequestHandled,
  onDrawStart,
  className = "",
  children,
}: Props) {
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
    setView(fit(pins, area, size.w, size.h, bottomInset));
    setMoved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pins and area intentionally read at fit time only
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

  /* ---------- Draw your own area ---------- */

  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<LatLng[]>([]);
  const pointsRef = useRef<LatLng[]>([]);
  pointsRef.current = points;
  const [hint, setHint] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const [kbCursor, setKbCursor] = useState(false);
  const stroke = useRef<{ sx: number; sy: number; lx: number; ly: number; dragged: boolean; base: LatLng[] } | null>(null);

  const unproject = useCallback(
    (x: number, y: number): LatLng => [view.lat - (y - size.h / 2) / view.k, view.lng + (x - size.w / 2) / (view.k * COS)],
    [size, view],
  );
  const local = (e: React.PointerEvent | React.MouseEvent) => {
    const r = boxRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const startDrawing = useCallback(() => {
    setDrawing(true);
    setPoints([]);
    setHint(null);
    setMoved(false);
    setAnnounce("Drawing mode on. Press and drag on the map, or click to place points.");
    boxRef.current?.focus({ preventScroll: true });
    onDrawStart?.();
  }, [onDrawStart]);

  const cancelDrawing = useCallback(() => {
    setDrawing(false);
    setPoints([]);
    setHint(null);
    setKbCursor(false);
    setAnnounce("Drawing cancelled.");
  }, []);

  const finishDrawing = (raw: LatLng[]) => {
    // Drop points that land on top of each other on screen (double clicks, jittery touch).
    const pts: LatLng[] = [];
    for (const p of raw) {
      const a = project(p);
      const last = pts[pts.length - 1];
      if (!last) pts.push(p);
      else {
        const b = project(last);
        if (Math.hypot(a.x - b.x, a.y - b.y) > 4) pts.push(p);
      }
    }
    const xs = pts.map((p) => project(p).x);
    const ys = pts.map((p) => project(p).y);
    const big = pts.length >= 3 && Math.max(...xs) - Math.min(...xs) >= 24 && Math.max(...ys) - Math.min(...ys) >= 24;
    const shape = big ? simplifyPolygon(pts, 2.5 / view.k, 24) : [];
    if (shape.length < 3) {
      setPoints([]);
      setHint("That area is too small. Try drawing a larger shape.");
      setAnnounce("That area is too small. Try drawing a larger shape.");
      return;
    }
    setDrawing(false);
    setPoints([]);
    setHint(null);
    setKbCursor(false);
    setAnnounce("Area drawn. Results now show properties inside it.");
    onDrawArea?.(shape);
  };

  // Requests from filter panels, the prototype panel or ?draw=1.
  useEffect(() => {
    if (!drawRequested || !size.w || !onDrawArea) return;
    startDrawing();
    onDrawRequestHandled?.();
  }, [drawRequested, size.w, onDrawArea, startDrawing, onDrawRequestHandled]);

  // Escape cancels drawing wherever focus is inside the page.
  useEffect(() => {
    if (!drawing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelDrawing();
        boxRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawing, cancelDrawing]);

  const addPoint = (p: LatLng) => {
    const next = [...pointsRef.current, p];
    setPoints(next);
    setHint(null);
    setAnnounce(`${next.length} ${next.length === 1 ? "point" : "points"} placed.${next.length >= 3 ? " Press Done or select the first point to finish." : ""}`);
  };
  const undoPoint = () => {
    const next = pointsRef.current.slice(0, -1);
    setPoints(next);
    setAnnounce(`${next.length} ${next.length === 1 ? "point" : "points"} placed.`);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (drawing) {
      if (e.button !== 0) return;
      e.preventDefault();
      setKbCursor(false);
      const { x, y } = local(e);
      stroke.current = { sx: x, sy: y, lx: x, ly: y, dragged: false, base: pointsRef.current };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY, view, dist: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const st = stroke.current;
    if (drawing && st) {
      const { x, y } = local(e);
      if (!st.dragged && Math.hypot(x - st.sx, y - st.sy) > 6) {
        st.dragged = true;
        setPoints([...st.base, unproject(st.sx, st.sy)]);
        setHint(null);
      }
      if (st.dragged && Math.hypot(x - st.lx, y - st.ly) > 3) {
        st.lx = x;
        st.ly = y;
        setPoints((prev) => [...prev, unproject(x, y)]);
      }
      return;
    }
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
  const onPointerUp = (e: React.PointerEvent) => {
    const st = stroke.current;
    stroke.current = null;
    drag.current = null;
    if (!drawing || !st || e.type === "pointercancel") return;
    if (st.dragged) {
      // Lifting the pen closes a freehand shape.
      finishDrawing(pointsRef.current);
      return;
    }
    const pts = pointsRef.current;
    const { x, y } = local(e);
    if (pts.length >= 3) {
      const first = project(pts[0]);
      if (Math.hypot(first.x - x, first.y - y) <= 14) {
        finishDrawing(pts);
        return;
      }
    }
    addPoint(unproject(x, y));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const step = 60;
    const drawKeys: Record<string, () => void> = drawing
      ? {
          Enter: () => addPoint(unproject(size.w / 2, size.h / 2)),
          " ": () => addPoint(unproject(size.w / 2, size.h / 2)),
          Backspace: () => undoPoint(),
          Delete: () => undoPoint(),
        }
      : {};
    if (drawing) setKbCursor(true);
    const keys: Record<string, () => void> = {
      ...drawKeys,
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
    const boxes: { x: number; y: number; ax: number; ay: number; extra: number }[] = [];
    const out = new Map<string, { x: number; y: number; ax: number; ay: number }>();
    for (const p of pins) {
      const a = project([p.lat, p.lng]);
      let pos: { x: number; y: number } | null = null;
      for (const [dx, dy] of OFFSETS) {
        const c = { x: a.x + dx, y: a.y + dy };
        const inside = c.x > W / 2 && c.x < size.w - W / 2 && c.y > H && c.y < size.h - H;
        if ((dx || dy) && !inside) continue;
        if (!boxes.some((b) => Math.abs(b.x - c.x) < W - 4 && Math.abs(b.y - c.y) < H - 2)) {
          pos = c;
          break;
        }
      }
      if (!pos) {
        // No free slot nearby: fold into a "+n" badge on the nearest pin rather than stacking.
        let best = boxes[0];
        for (const b of boxes) if ((b.ax - a.x) ** 2 + (b.ay - a.y) ** 2 < (best.ax - a.x) ** 2 + (best.ay - a.y) ** 2) best = b;
        if (best) {
          best.extra++;
          continue;
        }
        pos = a;
      }
      boxes.push({ ...pos, ax: a.x, ay: a.y, extra: 0 });
      out.set(p.id, { x: pos.x, y: pos.y, ax: a.x, ay: a.y });
    }
    return { out, overflow: boxes.filter((b) => b.extra > 0) };
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
      aria-label={drawing ? DRAW_HELP : "Map of results (simulated). Drag or use arrow keys to pan, plus and minus to zoom."}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => drawing && pointsRef.current.length >= 3 && finishDrawing(pointsRef.current)}
      onKeyDown={onKeyDown}
      className={`focus-inset relative isolate touch-none select-none overflow-hidden bg-[#D7DADE] ${drawing ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"} ${className}`}
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
            const pl = placed.out.get(p.id);
            if (!pl || (pl.x === pl.ax && pl.y === pl.ay)) return null;
            return <line key={p.id} x1={pl.ax} y1={pl.ay} x2={pl.x} y2={pl.y} stroke="#111826" strokeOpacity={0.35} strokeWidth={1} />;
          })}
          {pins.map((p) => {
            const pl = placed.out.get(p.id);
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

          {/* Applied drawn area: everything outside it is dimmed */}
          {area && !drawing && (
            <g>
              <path d={`M0,0H${size.w}V${size.h}H0Z ${toPath(area, true)}`} fill="#111826" fillOpacity={0.12} fillRule="evenodd" />
              <path d={toPath(area, true)} fill="none" stroke="#111826" strokeWidth={2} strokeLinejoin="round" />
            </g>
          )}

          {/* Shape in progress */}
          {drawing && points.length > 0 && (
            <g>
              {points.length >= 3 && <path d={toPath(points, true)} fill="#111826" fillOpacity={0.08} stroke="none" />}
              <path d={toPath(points, false)} fill="none" stroke="#111826" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              {points.length >= 3 && (
                <path d={toPath([points[points.length - 1], points[0]], false)} fill="none" stroke="#111826" strokeWidth={1.5} strokeDasharray="4 4" />
              )}
              {points.length < 30 &&
                points.map((p, i) => {
                  const { x, y } = project(p);
                  return <circle key={i} cx={x} cy={y} r={i === 0 && points.length >= 3 ? 7 : 4.5} fill="#FFFFFF" stroke="#111826" strokeWidth={2} />;
                })}
            </g>
          )}
        </svg>
      )}

      {/* Keyboard drawing: points land under this crosshair */}
      {drawing && kbCursor && (
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <Icon name="add" size={32} className="text-ink" />
        </span>
      )}

      {/* Pins: one per visible result, labelled with size */}
      {size.w > 0 &&
        pins.map((p) => {
          const pl = placed.out.get(p.id);
          if (!pl) return null;
          const { x, y } = pl;
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
              tabIndex={drawing ? -1 : undefined}
              aria-hidden={drawing || undefined}
              className={`absolute left-0 top-0 inline-flex h-8 ${drawing ? "pointer-events-none opacity-50" : ""} items-center whitespace-nowrap rounded-full border px-3 text-xs font-medium tabular-nums shadow-sm transition-colors duration-100 ${
                on ? "border-ink bg-ink text-white" : "border-ink bg-white text-ink hover:bg-surface"
              }`}
              style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${on ? 1.08 : 1})`, zIndex: raised === p.id ? 20 : on ? 15 : 10 }}
            >
              {pinText(p)}
            </button>
          );
        })}

      {/* Pins with no room fold into "+n"; pressing it zooms in on that spot */}
      {!drawing && placed.overflow.map((b) => (
        <button
          key={`${Math.round(b.ax)}:${Math.round(b.ay)}`}
          type="button"
          onClick={() => {
            touched.current = true;
            setView((v) => ({ lat: v.lat - (b.ay - size.h / 2) / v.k, lng: v.lng + (b.ax - size.w / 2) / (v.k * COS), k: Math.min(K_MAX, v.k * 2) }));
            setMoved(true);
          }}
          aria-label={`${b.extra} more ${b.extra === 1 ? "property" : "properties"} here. Zoom in`}
          className="absolute left-0 top-0 z-[25] inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-ink px-1.5 text-[11px] font-semibold tabular-nums text-white"
          style={{ transform: `translate(${b.x + 40}px, ${b.y - 22}px) translate(-50%, 0)` }}
        >
          +{b.extra}
        </button>
      ))}

      {/* Draw your own area */}
      {drawing ? (
        <div className="anim-pop absolute left-3 right-[60px] top-3 z-30 rounded-card border border-ink bg-white p-3 shadow-panel sm:right-auto sm:w-[340px]">
          <p className="text-sm font-medium">Draw around the area you want to search</p>
          <p className="mt-0.5 text-[13px] text-muted">{hint ?? "Press and drag, or click to place points."}</p>
          <div className="mt-2.5 flex items-center gap-2">
            <button type="button" onClick={cancelDrawing} className="inline-flex h-9 items-center rounded-btn border border-line bg-white px-3 text-sm hover:border-ink">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => finishDrawing(pointsRef.current)}
              disabled={points.length < 3}
              className="inline-flex h-9 items-center rounded-btn bg-ink px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Done
            </button>
            {points.length > 0 && (
              <button type="button" onClick={undoPoint} aria-label="Remove last point" className="ml-auto inline-flex size-9 items-center justify-center rounded-btn hover:bg-surface">
                <Icon name="undo" />
              </button>
            )}
          </div>
        </div>
      ) : area && onDrawArea ? (
        <div className="absolute left-3 top-3 z-30 flex gap-2">
          <button type="button" onClick={startDrawing} className="inline-flex h-10 items-center gap-2 rounded-btn border border-ink bg-white px-3 text-sm">
            <Icon name="gesture" />
            Redraw area
          </button>
          <button type="button" onClick={() => onDrawArea(null)} className="inline-flex h-10 items-center gap-2 rounded-btn border border-line bg-white px-3 text-sm hover:border-ink">
            <Icon name="close" />
            Clear area
          </button>
        </div>
      ) : onDrawArea ? (
        <button type="button" onClick={startDrawing} className="absolute left-3 top-3 z-30 inline-flex h-10 items-center gap-2 rounded-btn border border-ink bg-white px-3 text-sm hover:bg-surface">
          <Icon name="gesture" />
          Draw your own area
        </button>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>

      <div className="absolute right-3 top-3 z-30 flex flex-col overflow-hidden rounded-btn border border-line bg-white">
        <button type="button" aria-label="Zoom in" onClick={() => zoom(1.5)} className="focus-inset inline-flex size-10 items-center justify-center hover:bg-surface">
          <Icon name="add" />
        </button>
        <span className="h-px bg-line" />
        <button type="button" aria-label="Zoom out" onClick={() => zoom(1 / 1.5)} className="focus-inset inline-flex size-10 items-center justify-center hover:bg-surface">
          <Icon name="remove" />
        </button>
      </div>

      {moved && !drawing && (
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
      {!drawing && children}
    </div>
  );
}
