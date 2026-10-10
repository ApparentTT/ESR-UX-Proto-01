"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
 * name label, placed beside, above or below the dot so it never covers a neighbouring dot (pickPlace). Dots are a pointer shortcut only (aria-hidden): the region panel's buttons are the
 * accessible controls.
 */
/** Where the active market's name sits relative to its dot. */
type LabelPlace = "right" | "left" | "above" | "below";
const LABEL_PLACE: Record<LabelPlace, string> = {
  right: "left-4 top-0 -translate-y-1/2 md:left-5",
  left: "right-4 top-0 -translate-y-1/2 md:right-5",
  above: "bottom-4 left-0 -translate-x-1/2",
  below: "top-4 left-0 -translate-x-1/2",
};

/**
 * Picks the first placement whose label box covers no other dot and stays inside the frame: the side away
 * from the nearer frame edge first, then the other side, above, below. Markets sit close together on narrow
 * frames (Japan beside South Korea, the South East Asia cluster), so no single fixed side works everywhere.
 */
function pickPlace(label: HTMLElement, dot: DOMRect, others: DOMRect[], frame: DOMRect, preferLeft: boolean): LabelPlace {
  const W = label.offsetWidth;
  const H = label.offsetHeight;
  const cx = dot.left + dot.width / 2;
  const cy = dot.top + dot.height / 2;
  const side = window.innerWidth >= 768 ? 20 : 16;
  const box: Record<LabelPlace, { l: number; t: number }> = {
    right: { l: cx + side, t: cy - H / 2 },
    left: { l: cx - side - W, t: cy - H / 2 },
    above: { l: cx - W / 2, t: cy - 16 - H },
    below: { l: cx - W / 2, t: cy + 16 },
  };
  const order: LabelPlace[] = preferLeft ? ["left", "right", "above", "below"] : ["right", "left", "above", "below"];
  const fits = (k: LabelPlace) => {
    const { l, t } = box[k];
    if (l < frame.left + 4 || l + W > frame.right - 4 || t < frame.top + 4 || t + H > frame.bottom - 4) return false;
    return !others.some((o) => o.right + 2 > l && o.left - 2 < l + W && o.bottom + 2 > t && o.top - 2 < t + H);
  };
  return order.find(fits) ?? order[0];
}

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
  // Active label placement, measured before paint and again when the frame resizes or a zoom settles.
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const activeDot = dots.find((d) => d.marketId === activeId);
  const preferLeft = !!activeDot && activeDot.x > 65;
  const [place, setPlace] = useState<LabelPlace>("right");
  useLayoutEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas || !activeId) return;
    const measure = () => {
      const label = labelRef.current;
      const dot = label?.parentElement?.querySelector<HTMLElement>("[data-dot]");
      if (!label || !dot) return;
      const others = Array.from(canvas.querySelectorAll<HTMLElement>("[data-dot]"))
        .filter((d) => d !== dot)
        .map((d) => d.getBoundingClientRect());
      setPlace(pickPlace(label, dot.getBoundingClientRect(), others, frame.getBoundingClientRect(), preferLeft));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    canvas.addEventListener("transitionend", measure);
    return () => {
      ro.disconnect();
      canvas.removeEventListener("transitionend", measure);
    };
  }, [activeId, preferLeft, zoom, focus.x, focus.y]);

  const canvasStyle = {
    "--z": zoom,
    width: `calc${w}`,
    height: `calc${h}`,
    left: `clamp(calc(100cqw - ${w}), calc(50cqw - ${focus.x} * ${w}), 0px)`,
    top: `clamp(calc(100cqh - ${h}), calc(50cqh - ${focus.y} * ${h}), 0px)`,
  } as CSSProperties;

  return (
    <div
      ref={frameRef}
      className={`relative w-full overflow-hidden bg-[#EFEFEF] [container-type:size] ${sizeClassName} ${className}`}
    >
      <div
        ref={canvasRef}
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
                data-dot
                onMouseEnter={onDotHover ? () => onDotHover(d.marketId) : undefined}
                onMouseLeave={onDotHover ? () => onDotHover(null) : undefined}
                onClick={onDotClick ? () => onDotClick(d.marketId) : undefined}
                className={`absolute left-0 top-0 block size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black transition-[scale,box-shadow] duration-200 motion-reduce:transition-none md:size-4 ${
                  onDotClick ? "cursor-pointer" : ""
                } ${active ? "scale-[1.35] shadow-[0_0_0_4px_rgba(0,0,0,0.25)]" : ""}`}
              />
              {active && name && (
                <span
                  ref={labelRef}
                  className={`pointer-events-none absolute whitespace-nowrap rounded-[4px] bg-white px-2 py-0.5 text-[12px] font-medium leading-5 text-ink shadow-[0_1px_3px_rgba(0,0,0,0.2)] ${LABEL_PLACE[place]}`}
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
