import type { CSSProperties, ReactNode } from "react";
import { MapArtwork, MAP_ART_HEIGHT, MAP_ART_WIDTH } from "./MapArtwork";
import type { MapDot } from "./types";

const RATIO = MAP_ART_WIDTH / MAP_ART_HEIGHT;

/**
 * Default focal point (fractions of the artwork): centred, so narrow frames crop both sides evenly
 * and the India dot stays clear of the overlay panel at 1280.
 */
export const MAP_FOCUS = { x: 0.5, y: 0.555 };

/**
 * The map frame (inventory B15 §2b): a 1306:635 greyscale map "image" that always covers the frame
 * (like object-cover) and keeps the dots on their Figma percentages, plus optional dark overlay (DEV)
 * and children (zoom controls). Frame shape: 4:3 at 390, 16:10 at 768, 1306:635 from 1024 (min 600px
 * tall from 1280, where the region panel is overlaid). Crops centre on `focus`, so on narrow frames the
 * empty sea on either side goes first; zoom scales the artwork around the same point.
 *
 * Dots: 16px black circles (14px on phones). The active market's dot scales up with a dark ring and a
 * name label. Dots are a pointer shortcut only (aria-hidden): the region panel's buttons are the
 * accessible controls.
 */
/** Frame shape per breakpoint: 4:3 → 16:10 → 1306:635, at least 600px tall from 1280. */
export const MAP_FRAME_SIZE = "aspect-[4/3] md:aspect-[16/10] lg:aspect-[1306/635] xl:min-h-[600px]";

export function MapCanvas({
  dots,
  names,
  activeId = null,
  zoom = 1,
  focus = MAP_FOCUS,
  overlay = false,
  label = "Map of ESR markets",
  onDotHover,
  onDotClick,
  sizeClassName = MAP_FRAME_SIZE,
  className = "",
  children,
}: {
  dots: MapDot[];
  /** marketId → display name, for the active dot's label */
  names?: Record<string, string>;
  /** The highlighted market (hovered or selected) */
  activeId?: string | null;
  /** Artwork scale, 1 = cover */
  zoom?: number;
  /** Point to keep centred when the artwork is cropped or zoomed, as fractions (0-1) of the artwork */
  focus?: { x: number; y: number };
  /** DEV: a 20% dark overlay rgba(46,46,46,0.2) on the map image */
  overlay?: boolean;
  /** Accessible name of the map image */
  label?: string;
  onDotHover?: (marketId: string | null) => void;
  onDotClick?: (marketId: string) => void;
  /** Replaces the frame's aspect / height classes (default MAP_FRAME_SIZE) */
  sizeClassName?: string;
  className?: string;
  /** Rendered over the map, e.g. <MapZoomControls /> */
  children?: ReactNode;
}) {
  // Canvas = the artwork box. It covers the frame (container query units), is scaled by --z and is
  // offset so the focal point sits in the middle without ever showing past the artwork's edges.
  const w = `(max(100cqw, 100cqh * ${RATIO}) * var(--z))`;
  const h = `(max(100cqw / ${RATIO}, 100cqh) * var(--z))`;
  const canvasStyle = {
    "--z": zoom,
    width: `calc${w}`,
    height: `calc${h}`,
    left: `clamp(calc(100cqw - ${w}), calc(50cqw - ${focus.x} * ${w}), 0px)`,
    top: `clamp(calc(100cqh - ${h}), calc(50cqh - ${focus.y} * ${h}), 0px)`,
  } as CSSProperties;

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#EFEFEF] [container-type:size] ${sizeClassName} ${className}`}
    >
      <div
        role="img"
        aria-label={label}
        className="absolute transition-[width,height,left,top] duration-300 ease-out motion-reduce:transition-none"
        style={canvasStyle}
      >
        <MapArtwork className="absolute inset-0 size-full" />
        {overlay && <div aria-hidden="true" className="absolute inset-0 bg-[rgba(46,46,46,0.2)]" />}
        {dots.map((d) => {
          const active = d.marketId === activeId;
          const name = names?.[d.marketId];
          return (
            <span
              key={d.marketId}
              aria-hidden="true"
              className={`absolute ${active ? "z-[2]" : "z-[1]"}`}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
            >
              <span
                onMouseEnter={onDotHover ? () => onDotHover(d.marketId) : undefined}
                onMouseLeave={onDotHover ? () => onDotHover(null) : undefined}
                onClick={onDotClick ? () => onDotClick(d.marketId) : undefined}
                className={`absolute left-0 top-0 block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-[scale,box-shadow] duration-200 motion-reduce:transition-none md:size-4 ${
                  onDotClick ? "cursor-pointer" : ""
                } ${active ? "scale-[1.35] shadow-[0_0_0_4px_rgba(0,0,0,0.25)]" : ""}`}
              />
              {active && name && (
                <span
                  className={`pointer-events-none absolute top-0 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-white px-2 py-0.5 text-[12px] font-medium leading-5 text-ink shadow-[0_1px_3px_rgba(0,0,0,0.2)] ${
                    d.x > 65 ? "right-4 md:right-5" : "left-4 md:left-5"
                  }`}
                >
                  {name}
                </span>
              )}
            </span>
          );
        })}
      </div>
      {children}
    </div>
  );
}
