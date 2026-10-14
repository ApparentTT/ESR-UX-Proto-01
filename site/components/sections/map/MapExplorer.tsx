"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MapCanvas, MAP_FOCUS } from "./MapCanvas";
import { MAP_ART_HEIGHT, MAP_ART_WIDTH } from "./MapArtwork";
import { MapMarketCard } from "./MapMarketCard";
import { MapRegionPanel } from "./MapRegionPanel";
import { MapZoomControls } from "./MapZoomControls";
import { MARKET_SHAPES } from "./marketShapes";
import type { MapDot, MapMarket, MapRegion } from "./types";

/** Manual zoom: each + / − multiplies or divides by 1.5, between 1 (cover) and 6. */
const ZOOM_MIN = 1;
const ZOOM_MAX = 6;
const ZOOM_STEP = 1.5;
/** Zoom range when fitting a selected market (huge Greater China to tiny Singapore). */
const FIT_MIN = 1.2;
const FIT_MAX = 4;

/** The card overlays the map from 1280 (the region panel does too): 315 wide, right 88 (145 from 1400). */
const OVERLAY_QUERY = "(min-width: 1280px)";
/** Region panel's right edge over the map at 1280+ (21 + 319). */
const PANEL_RIGHT = 340;
const CARD_W = 315;
/** Card's distance from the map's right edge: 88, then 145 as drawn from 1400. */
const cardRight = (viewport: number) => (viewport >= 1400 ? 145 : 88);

export type MapExplorerProps = {
  regions: MapRegion[];
  dots: MapDot[];
  /** Region open on load (Asia as drawn). null = all collapsed. */
  defaultRegion?: string | null;
  /** port: panel top 44 / zoom top 40. dev: panel top 61 / zoom top 57 + the dark overlay. */
  variant?: "port" | "dev";
  /** Override the variant's overlay (DEV's rgba(46,46,46,0.2) on the map image) */
  overlay?: boolean;
  /** Accessible name of the map image */
  mapLabel?: string;
  /** Unique prefix for ids when two maps share a page */
  idPrefix?: string;
  className?: string;
};

type Frame = { w: number; h: number; overlay: boolean; cardRight: number };

/**
 * The interactive part of InteractiveMap (inventory B15, Figma InteractiveMap 592:49406: "default"
 * 592:49405 and "selected" 592:49404): map frame + zoom + region panel + market card, sharing one
 * selection. Hovering or focusing a market highlights it and its dot. Selecting it (panel button or
 * dot) zooms the map onto the market, fills its outline dark and pops out its card; selecting another
 * market moves the zoom; the card's close button, Esc, or re-selecting the market returns to the
 * default view. The zoom glides (instant under prefers-reduced-motion).
 *
 * Card: overlaid on the map's right from 1280, the market centred in the space between the region panel
 * and the card; below 1280 it sits under the map (the map scrolls into view if needed) with the market
 * centred in the frame. A keyboard selection moves focus into the card (a labelled region); closing
 * returns focus to the market's button. Each selection is also announced politely.
 * Switching region clears the selection. + / − still zoom around the current focus.
 */
export function MapExplorer({
  regions,
  dots,
  defaultRegion = regions[0]?.id ?? null,
  variant = "port",
  overlay,
  mapLabel,
  idPrefix = "map",
  className = "",
}: MapExplorerProps) {
  const [openRegion, setOpenRegion] = useState<string | null>(defaultRegion);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  /** Manual zoom (+ / −); null follows the selection: fitted to the market, or 1 with none */
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [message, setMessage] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  /** Set when a keyboard selection should move focus into the card once it renders */
  const focusCard = useRef(false);

  const markets = useMemo(
    () => Object.fromEntries(regions.flatMap((r) => r.markets.map((m) => [m.id, m] as const))) as Record<string, MapMarket>,
    [regions],
  );
  const names = useMemo(() => Object.fromEntries(Object.values(markets).map((m) => [m.id, m.name])), [markets]);
  const regionOf = useMemo(
    () => Object.fromEntries(regions.flatMap((r) => r.markets.map((m) => [m.id, r.id] as const))),
    [regions],
  );

  // Track the frame size (and whether the card overlays it) for fitting the zoom.
  useLayoutEffect(() => {
    const el = rootRef.current?.querySelector<HTMLElement>("[data-map-frame]");
    if (!el) return;
    const measure = () =>
      setFrame((cur) => {
        const next = {
          w: el.clientWidth,
          h: el.clientHeight,
          overlay: window.matchMedia(OVERLAY_QUERY).matches,
          cardRight: cardRight(window.innerWidth),
        };
        return cur && cur.w === next.w && cur.h === next.h && cur.overlay === next.overlay && cur.cardRight === next.cardRight
          ? cur
          : next;
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shape = selected ? MARKET_SHAPES[selected] : undefined;
  const selectedMarket = selected ? markets[selected] : undefined;

  // Free area the selected market is centred in: between the panel and the card when they overlay the map.
  const free = useMemo(() => {
    if (!frame) return null;
    if (!frame.overlay) return { x0: 16, x1: frame.w - 16, y0: 16, y1: frame.h - 16 };
    return { x0: PANEL_RIGHT + 24, x1: frame.w - frame.cardRight - CARD_W - 24, y0: 24, y1: frame.h - 24 };
  }, [frame]);

  // Fit the selected market's outline into the free area.
  const fitZoom = useMemo(() => {
    if (!shape || !frame || !free) return null;
    const cover = Math.max(frame.w / MAP_ART_WIDTH, frame.h / MAP_ART_HEIGHT);
    const [x0, y0, x1, y1] = shape.box;
    const bw = Math.max(1, x1 - x0) * cover;
    const bh = Math.max(1, y1 - y0) * cover;
    const z = Math.min(((free.x1 - free.x0) * 0.75) / bw, ((free.y1 - free.y0) * 0.75) / bh);
    return Math.min(FIT_MAX, Math.max(FIT_MIN, z));
  }, [shape, frame, free]);

  const focus = shape
    ? { x: (shape.box[0] + shape.box[2]) / 2 / MAP_ART_WIDTH, y: (shape.box[1] + shape.box[3]) / 2 / MAP_ART_HEIGHT }
    : MAP_FOCUS;
  const anchor = shape && free ? { x: Math.round((free.x0 + free.x1) / 2), y: Math.round((free.y0 + free.y1) / 2) } : null;

  const zoom = manualZoom ?? fitZoom ?? ZOOM_MIN;

  // After a selection: move focus into the card (keyboard), and below 1280 bring the map and card into view.
  useEffect(() => {
    if (!selected) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!window.matchMedia(OVERLAY_QUERY).matches) {
      stageRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
    if (focusCard.current) {
      focusCard.current = false;
      cardRef.current?.focus({ preventScroll: true });
    }
  }, [selected]);

  const returnFocus = (id: string) => {
    const active = document.activeElement;
    if (active && cardRef.current?.contains(active)) {
      rootRef.current?.querySelector<HTMLButtonElement>(`[data-market="${id}"]`)?.focus();
    }
  };

  const clear = () => {
    if (!selected) return;
    returnFocus(selected);
    setSelected(null);
    setManualZoom(null);
    setMessage("Map reset to all markets.");
  };

  const select = (id: string, viaKeyboard = false) => {
    if (selected === id) return clear();
    focusCard.current = viaKeyboard;
    setSelected(id);
    setManualZoom(null);
    const name = names[id] ?? id;
    setMessage(MARKET_SHAPES[id] ? `${name} selected. Map zoomed to ${name}, details shown.` : `${name} selected, details shown.`);
    // A dot click selects its market: open that market's region so the row is visible.
    const region = regionOf[id];
    if (region && region !== openRegion) setOpenRegion(region);
  };

  const toggleRegion = (id: string) => {
    setOpenRegion((cur) => (cur === id ? null : id));
    setSelected(null);
    setHovered(null);
    setManualZoom(null);
  };

  const zoomBy = (factor: number) => {
    const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(zoom * factor * 100) / 100));
    setManualZoom(next);
    setMessage(`Map zoom ${Math.round(next * 100)}%`);
  };

  const cardPos = variant === "dev" ? "xl:top-[176px]" : "xl:top-[159px]";

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && selected) {
          e.stopPropagation();
          clear();
        }
      }}
    >
      <div ref={stageRef} className="relative scroll-mt-4 scroll-mb-4">
        <MapCanvas
          dots={dots}
          names={names}
          activeId={hovered ?? selected}
          selectedId={selected}
          highlight={shape?.d}
          zoom={zoom}
          focus={focus}
          anchor={anchor}
          overlay={overlay ?? variant === "dev"}
          label={mapLabel}
          onDotHover={setHovered}
          onDotClick={(id) => select(id)}
        >
          <MapZoomControls
            zoom={zoom}
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            onZoomIn={() => zoomBy(ZOOM_STEP)}
            onZoomOut={() => zoomBy(1 / ZOOM_STEP)}
            offset={variant}
          />
        </MapCanvas>
        {selectedMarket && (
          <div
            ref={cardRef}
            tabIndex={-1}
            className={`my-4 rounded-[7px] xl:absolute xl:z-10 xl:my-0 xl:w-[315px] ${cardPos}`}
            style={{ right: frame?.cardRight ?? 88 }}
          >
            <MapMarketCard
              key={selectedMarket.id}
              id={`${idPrefix}-${selectedMarket.id}`}
              name={selectedMarket.name}
              facts={selectedMarket.facts}
              href={selectedMarket.href}
              onClose={clear}
            />
          </div>
        )}
      </div>
      <MapRegionPanel
        regions={regions}
        openRegion={openRegion}
        onToggleRegion={toggleRegion}
        activeId={hovered ?? selected}
        selectedId={selected}
        onHoverMarket={setHovered}
        onSelectMarket={select}
        offset={variant}
        idPrefix={idPrefix}
      />
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
