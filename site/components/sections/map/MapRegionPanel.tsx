import { Icon } from "@/components/ui/Icon";
import type { MapRegion } from "./types";

/**
 * The region / market nav panel (inventory B15). Region headings are a single-open accordion
 * (buttons with aria-expanded); markets are inert toggle buttons (aria-pressed) that select and
 * highlight their dot. Hovered, focused and selected markets are Bold + underlined.
 *
 * From 1280 it overlays the map as drawn: 21px from the left, top 44 (PORT) / 61 (DEV), 319 x 538,
 * 24px padding, a 1px white rule, white text, translucent black with a 2px blur. The fill is 55% black
 * (the wireframe draws 20%, and 60% for its "selected" panel) so the white text passes 4.5:1 on the
 * light map. Below 1280 it is a normal block under the map on the surface grey, with ink text, no rule,
 * a chevron on each region and the open region's markets in 2 (390) or 3 (768) columns, every
 * region and market button at least 40px tall for touch.
 */
export function MapRegionPanel({
  regions,
  openRegion,
  onToggleRegion,
  activeId = null,
  selectedId = null,
  onHoverMarket,
  onSelectMarket,
  offset = "port",
  idPrefix = "map",
  className = "",
}: {
  regions: MapRegion[];
  /** id of the open region, or null when all are collapsed */
  openRegion: string | null;
  onToggleRegion: (regionId: string) => void;
  /** Highlighted market (hover / focus / selection): Bold + underline */
  activeId?: string | null;
  /** Selected (clicked) market: aria-pressed */
  selectedId?: string | null;
  onHoverMarket?: (marketId: string | null) => void;
  onSelectMarket?: (marketId: string) => void;
  /** Overlay top offset at 1280+: port (44px) or dev (61px) */
  offset?: "port" | "dev";
  /** Prefix for the accordion ids (unique per map on the page) */
  idPrefix?: string;
  className?: string;
}) {
  const top = offset === "dev" ? "xl:top-[61px]" : "xl:top-[44px]";
  return (
    <div
      role="group"
      aria-label="Regions and markets"
      className={`flex bg-surface px-5 py-5 text-ink md:px-6 xl:absolute xl:left-[21px] xl:z-10 xl:h-[538px] xl:w-[319px] xl:gap-[26px] xl:bg-black/55 xl:p-6 xl:text-white xl:backdrop-blur-[2px] ${top} ${className}`}
    >
      <span aria-hidden="true" className="hidden w-px shrink-0 bg-white xl:block" />
      <div className="flex min-w-0 flex-1 flex-col">
        {regions.map((region, i) => {
          const open = region.id === openRegion;
          const prevOpen = i > 0 && regions[i - 1].id === openRegion;
          const listId = `${idPrefix}-region-${region.id}`;
          return (
            <div key={region.id} className={i === 0 ? "" : open || prevOpen ? "mt-4 xl:mt-6" : "mt-1 xl:mt-2"}>
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={listId}
                  onClick={() => onToggleRegion(region.id)}
                  className={`group flex min-h-10 w-full items-center gap-2 text-left xl:min-h-0 xl:focus-visible:outline-white! text-[20px] leading-8 xl:text-[24px] ${
                    open ? "font-semibold" : "font-medium"
                  }`}
                >
                  {open && (
                    <span aria-hidden="true" className="w-2 font-black">
                      ·
                    </span>
                  )}
                  <span className="underline-offset-4 group-hover:underline">{region.name}</span>
                  <span aria-hidden="true" className="ml-auto flex xl:hidden">
                    <Icon
                      name="keyboard_arrow_down"
                      size={22}
                      className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
              </h3>
              <ul
                id={listId}
                hidden={!open}
                className={`mt-1 grid gap-x-4 pl-4 xl:mt-2 xl:grid-cols-1 ${
                  region.markets.length > 2 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {region.markets.map((m) => {
                  const on = m.id === activeId || m.id === selectedId;
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        aria-pressed={m.id === selectedId}
                        onClick={() => onSelectMarket?.(m.id)}
                        onMouseEnter={() => onHoverMarket?.(m.id)}
                        onMouseLeave={() => onHoverMarket?.(null)}
                        onFocus={() => onHoverMarket?.(m.id)}
                        onBlur={() => onHoverMarket?.(null)}
                        className={`min-h-10 text-left text-[16px] leading-8 underline-offset-4 xl:min-h-0 xl:focus-visible:outline-white! ${
                          on ? "font-bold underline" : "font-medium"
                        }`}
                      >
                        {m.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
