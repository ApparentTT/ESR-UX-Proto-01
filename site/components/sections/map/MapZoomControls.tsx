import { Icon } from "@/components/ui/Icon";

/**
 * The map's + / − zoom buttons (inventory B15): two squares stacked top right, translucent black
 * with a 2px backdrop blur and white 24px icons. 56px with a 16px gap from 1280 (17px from the
 * right, + at top 40 on PORT / 57 on DEV). Below 1280: 40px, side by side top right, so they stay
 * clear of the Japan and South Korea dots on the cropped map.
 * The fill is darker than the wireframe's 20% black so the white icons keep a 3:1 contrast on the
 * light map. Render inside a `relative` map frame.
 */
export function MapZoomControls({
  zoom,
  min,
  max,
  onZoomIn,
  onZoomOut,
  offset = "port",
  className = "",
}: {
  zoom: number;
  min: number;
  max: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  /** Top offset at 1280+: port (+ at 40px) or dev (+ at 57px) */
  offset?: "port" | "dev";
  className?: string;
}) {
  const top = offset === "dev" ? "xl:top-[57px]" : "xl:top-[40px]";
  const btn =
    "flex size-10 items-center justify-center bg-black/45 text-white backdrop-blur-[2px] transition-colors hover:bg-black/60 aria-disabled:hover:bg-black/25 aria-disabled:cursor-not-allowed aria-disabled:bg-black/25 aria-disabled:text-white/70 xl:size-14 motion-reduce:transition-none";
  return (
    <div className={`absolute right-3 top-3 z-10 flex gap-2 xl:right-[17px] xl:flex-col xl:gap-4 ${top} ${className}`}>
      <button
        type="button"
        className={btn}
        onClick={() => zoom < max && onZoomIn()}
        aria-disabled={zoom >= max}
        aria-label="Zoom in"
      >
        <Icon name="add" size={24} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => zoom > min && onZoomOut()}
        aria-disabled={zoom <= min}
        aria-label="Zoom out"
      >
        <Icon name="remove" size={24} />
      </button>
    </div>
  );
}
