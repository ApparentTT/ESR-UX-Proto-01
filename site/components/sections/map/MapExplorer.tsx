"use client";

import { useMemo, useState } from "react";
import { MapCanvas, MAP_FOCUS } from "./MapCanvas";
import { MapRegionPanel } from "./MapRegionPanel";
import { MapZoomControls } from "./MapZoomControls";
import type { MapDot, MapRegion } from "./types";

const ZOOM_STEPS = [1, 1.25, 1.5];

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

/**
 * The interactive part of InteractiveMap (inventory B15): map frame + zoom + region panel, sharing
 * one selection. Hovering or focusing a market highlights it and its dot; clicking selects it (sticky,
 * aria-pressed, click again or Esc to clear). Selecting also centres a zoomed map on that market.
 * Zoom steps 1 → 1.25 → 1.5, clamped. Switching region clears the selection. No navigation: market
 * sites are not wireframed.
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
  const [zoomIndex, setZoomIndex] = useState(0);

  const names = useMemo(
    () => Object.fromEntries(regions.flatMap((r) => r.markets.map((m) => [m.id, m.name] as const))),
    [regions],
  );
  const regionOf = useMemo(
    () => Object.fromEntries(regions.flatMap((r) => r.markets.map((m) => [m.id, r.id] as const))),
    [regions],
  );

  const active = hovered ?? selected;
  const selectedDot = dots.find((d) => d.marketId === selected);
  const focus = selectedDot ? { x: selectedDot.x / 100, y: selectedDot.y / 100 } : MAP_FOCUS;
  const zoom = ZOOM_STEPS[zoomIndex];

  const toggleRegion = (id: string) => {
    setOpenRegion((cur) => (cur === id ? null : id));
    setSelected(null);
    setHovered(null);
  };

  const select = (id: string) => {
    setSelected((cur) => (cur === id ? null : id));
    // A dot click selects its market: open that market's region so the row is visible.
    const region = regionOf[id];
    if (region && region !== openRegion) setOpenRegion(region);
  };

  return (
    <div
      className={`relative ${className}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && selected) {
          setSelected(null);
          e.stopPropagation();
        }
      }}
    >
      <MapCanvas
        dots={dots}
        names={names}
        activeId={active}
        zoom={zoom}
        focus={focus}
        overlay={overlay ?? variant === "dev"}
        label={mapLabel}
        onDotHover={setHovered}
        onDotClick={select}
      >
        <MapZoomControls
          zoom={zoom}
          min={ZOOM_STEPS[0]}
          max={ZOOM_STEPS[ZOOM_STEPS.length - 1]}
          onZoomIn={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
          onZoomOut={() => setZoomIndex((i) => Math.max(0, i - 1))}
          offset={variant}
        />
        <p className="sr-only" aria-live="polite">
          {`Map zoom ${Math.round(zoom * 100)}%`}
        </p>
      </MapCanvas>
      <MapRegionPanel
        regions={regions}
        openRegion={openRegion}
        onToggleRegion={toggleRegion}
        activeId={active}
        selectedId={selected}
        onHoverMarket={setHovered}
        onSelectMarket={select}
        offset={variant}
        idPrefix={idPrefix}
      />
    </div>
  );
}
