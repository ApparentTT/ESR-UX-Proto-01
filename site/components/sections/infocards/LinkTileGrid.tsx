import { useId } from "react";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { GroupLabel, type GroupLabelOn } from "./GroupLabel";

/**
 * B28 LinkTileGrid: compact whole-tile links (grid only, no section band).
 * - reit (INV §4c "Our listed REITs"): white, 1px line border, r10, padding 18 / 20, a row (gap 14):
 *   40 x 40 logo placeholder (r6), name Medium 15/1.48 + "Market  ·  Exchange" 13/1.48 muted, open_in_new 18.
 *   100 tall. Hover: border #9CA3AF, fill #F9FAFB. Fluid 3-up (gap 16) from 1024, 2-up from 768, 1 column below.
 * - market (PEOPLE §6 market careers): white, r10, no border, padding 22 / 20 / 22 / 24, name Medium 15/1.48
 *   (wraps) + arrow_outward 20. 100 tall. Hover: 1px ink ring, the arrow nudges 2px up and right.
 *   Fluid 5-up from 1280, 3-up from 768, 2-up from 640, a 1-column list below.
 * Every tile is an external destination in the wireframes, so pass href null (inert).
 */
export type LinkTileVariant = "reit" | "market";

export type LinkTileItem = {
  name: string;
  /** reit: the "Market  ·  Exchange" line, verbatim (double spaces around the dot are kept) */
  meta?: string;
  href: string | null;
};

export type LinkTileGridProps = {
  variant: LinkTileVariant;
  items: LinkTileItem[];
  /** Group label above the grid (e.g. "Our listed REITs") */
  label?: string;
  labelAs?: "h3" | "h4" | "p";
  /** Background the label sits on, so its muted grey keeps 4.5:1 contrast */
  labelOn?: GroupLabelOn;
  /** Space between the label and the tiles at desktop: 20 (INV) or 32 (PEOPLE mobility) */
  labelGap?: 20 | 32;
  className?: string;
};

const GRID: Record<LinkTileVariant, string> = {
  reit: "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3",
  market: "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-5",
};

function ReitTile({ name, meta, href }: LinkTileItem) {
  return (
    <SmartLink
      href={href}
      className="group flex h-full min-h-[80px] items-center gap-3.5 rounded-[10px] border border-line bg-white px-5 py-[18px] transition-colors hover:border-[#9CA3AF] hover:bg-[#F9FAFB] lg:min-h-[100px]"
    >
      <div aria-hidden="true" className="shrink-0">
        <ImagePlaceholder className="size-10 rounded-btn" iconSize={20} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] font-medium leading-[1.48] text-ink">{name}</span>
        {meta && <span className="whitespace-pre-wrap text-[13px] leading-[1.48] text-muted">{meta}</span>}
      </div>
      <Icon name="open_in_new" size={18} className="text-ink" />
      <span className="sr-only">(external site)</span>
    </SmartLink>
  );
}

function MarketTile({ name, href }: LinkTileItem) {
  return (
    <SmartLink
      href={href}
      className="group flex h-full min-h-[72px] items-center gap-3 rounded-[10px] bg-white py-4 pl-6 pr-5 transition-shadow hover:shadow-[0_0_0_1px_#111826] sm:min-h-[88px] xl:min-h-[100px] xl:py-[22px]"
    >
      <span className="min-w-0 flex-1 text-[15px] font-medium leading-[1.48] text-ink">{name}</span>
      <Icon
        name="arrow_outward"
        size={20}
        className="text-ink transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
      <span className="sr-only">(external site)</span>
    </SmartLink>
  );
}

export function LinkTileGrid({
  variant,
  items,
  label,
  labelAs = "p",
  labelOn = "white",
  labelGap = 20,
  className = "",
}: LinkTileGridProps) {
  const labelId = useId();
  const Tile = variant === "reit" ? ReitTile : MarketTile;
  const list = (
    <ul role="list" aria-labelledby={label ? labelId : undefined} className={GRID[variant]}>
      {items.map((item) => (
        <li key={item.name}>
          <Tile {...item} />
        </li>
      ))}
    </ul>
  );

  if (!label) return className ? <div className={className}>{list}</div> : list;
  return (
    <div className={`flex flex-col ${labelGap === 32 ? "gap-5 md:gap-6 lg:gap-8" : "gap-4 lg:gap-5"} ${className}`}>
      <GroupLabel id={labelId} as={labelAs} on={labelOn}>
        {label}
      </GroupLabel>
      {list}
    </div>
  );
}
