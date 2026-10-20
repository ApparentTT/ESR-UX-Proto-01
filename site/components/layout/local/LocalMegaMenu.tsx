"use client";

import { useId } from "react";
import { Icon } from "@/components/ui/Icon";
import { Block, GroupLabel, Strip } from "@/components/layout/nav/MegaMenu";
import { LatestCardLink } from "@/components/layout/nav/parts";
import type { FundsBlock, LocalItemBlock, LocalMegaBlock, LocalMegaCell, LocalSection } from "@/config/local-nav";
import { LocalExploreLink, PropertySearchForm } from "./parts";

const px = (n: number | string) => (typeof n === "number" ? `${n}px` : n);
const HEADING = "text-[14px] font-bold leading-5 text-body";

/**
 * Local desktop mega menu (Figma Local_Our portfolio / Investors / ESG / News / About): the group mega menu
 * layout (a full-bleed white panel laid out from the section's data as a grid of cells in the 1440 ratios,
 * with an optional grey link strip) under the 112px local header. The group blocks (downloads, Latest,
 * Our people) and the strip are the group menu's own; items, the property search and the fund cards are local.
 * Rendered right after its trigger button, so it follows the trigger in tab order; a region named by that button.
 */
export function LocalMegaMenu({
  section,
  id,
  labelledBy,
  animate,
  onSubmitted,
}: {
  section: LocalSection;
  id: string;
  labelledBy: string;
  animate: boolean;
  /** The property search was submitted (the header closes the menu) */
  onSubmitted: () => void;
}) {
  const { panel } = section;
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      className={`sb-pad absolute inset-x-0 top-full max-h-[calc(var(--full-h)-112px)] overflow-y-auto overflow-x-hidden overscroll-contain bg-white ${animate ? "anim-pop" : ""}`}
    >
      <div
        className="mx-auto grid max-w-(--page-max)"
        style={{
          gridTemplateColumns: panel.cols.map((c) => (typeof c === "number" ? `minmax(0, ${c}fr)` : `minmax(${c[1]}px, ${c[0]}fr)`)).join(" "),
          gridTemplateRows: panel.rows.map((r) => `minmax(${r}px, auto)`).join(" "),
        }}
      >
        {panel.cells.map((cell, i) => (
          <Cell key={i} cell={cell} lastCol={panel.cols.length} onSubmitted={onSubmitted} />
        ))}
      </div>
      {panel.strip && <Strip strip={panel.strip} />}
    </div>
  );
}

/** A grid cell, as in the group mega menu: padding, column divider, bottom line and grey carried on to the window edge. */
function Cell({ cell, lastCol, onSubmitted }: { cell: LocalMegaCell; lastCol: number; onSubmitted: () => void }) {
  const { col, span = 1, row, rowSpan = 1, pad, line = "", surface, eyebrow, label, center, flow = "column", gap = 0, blocks } = cell;
  const uid = useId();
  const lineB = line.includes("b");
  const bleed: string[] = [];
  if (surface || lineB) {
    if (col === 1) bleed.push("right-full");
    if (col + span - 1 === lastCol) bleed.push("left-full");
  }
  const layout = `flex ${flow === "row" ? "items-start" : "flex-col items-start"}`;
  return (
    <div
      className={`relative min-w-0 ${line.includes("l") ? "shadow-[inset_1px_0_0_var(--color-line)]" : ""} ${lineB ? "border-b border-line" : ""} ${surface ? "bg-surface" : ""} ${center ? "flex flex-col justify-center" : ""}`}
      style={{ gridColumn: `${col} / span ${span}`, gridRow: `${row ?? 1} / span ${rowSpan}`, padding: pad.map(px).join(" ") }}
    >
      {bleed.map((side) => (
        <span
          key={side}
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 w-[calc(var(--full-w)/2)] ${side} ${surface ? "bg-surface" : ""} ${lineB ? "-bottom-px border-b border-line" : "bottom-0"}`}
        />
      ))}
      {label ? (
        <GroupLabel>{label}</GroupLabel>
      ) : eyebrow ? (
        <>
          <p id={uid} className="mb-[41px] text-[12px] font-medium leading-5 text-body">
            {eyebrow}
          </p>
          <ul aria-labelledby={uid} className={layout} style={{ gap: px(gap) }}>
            {blocks.map((b, i) => (
              <li key={i} className="max-w-full">
                <LocalBlock block={b} onSubmitted={onSubmitted} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={layout} style={{ gap: px(gap) }}>
          {blocks.map((b, i) => (
            <LocalBlock key={i} block={b} onSubmitted={onSubmitted} />
          ))}
        </div>
      )}
    </div>
  );
}

function LocalBlock({ block, onSubmitted }: { block: LocalMegaBlock; onSubmitted: () => void }) {
  switch (block.type) {
    case "item":
      return <Item block={block} />;
    case "propertySearch":
      return <PropertySearchForm block={block} onSubmitted={onSubmitted} className="w-[412px] max-w-full" />;
    case "funds":
      return <Funds block={block} />;
    default:
      return <Block block={block} />;
  }
}

/** Icon, Bold title, Regular description, then Explore (icon 24, gaps 20 / 12, 202px wide), as in the group menu. */
function Item({ block: { item, reserve, wide } }: { block: LocalItemBlock }) {
  return (
    <div className={`flex max-w-full flex-col items-start ${wide ? "w-full" : "w-[202px]"}`}>
      {item.icon && <Icon name={item.icon} size={24} opsz={24} className="mb-5 text-ink" />}
      <p className={HEADING}>{item.title}</p>
      <p className={`text-[14px] leading-5 text-body ${reserve ? "min-h-10" : ""}`}>{item.text}</p>
      <LocalExploreLink href={item.href} context={item.title} label={item.cta} external={item.external} offsite={item.offsite} className="mt-3" />
    </div>
  );
}

/** "Explore key funds" with "Explore All funds" at the right, over two 236 x 280 fund cards 38 apart. */
function Funds({ block }: { block: FundsBlock }) {
  const uid = useId();
  return (
    <div className="w-full max-w-[510px]">
      <div className="flex items-start justify-between gap-6">
        <p id={uid} className={`pt-px ${HEADING}`}>
          {block.heading}
        </p>
        <LocalExploreLink href={block.link.href} label={block.link.label} />
      </div>
      <ul aria-labelledby={uid} className="mt-[18px] grid grid-cols-2 gap-[clamp(20px,3.6vw-14px,38px)]">
        {block.cards.map((c, i) => (
          <li key={i}>
            <LatestCardLink card={c} className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
