"use client";

import { useId } from "react";
import { Icon } from "@/components/ui/Icon";
import { InertLink } from "@/components/ui/InertLink";
import { SmartLink } from "@/components/ui/SmartLink";
import {
  marketsIn,
  type DownloadsBlock,
  type GlanceBlock,
  type ItemBlock,
  type LatestBlock,
  type MarketListBlock,
  type MegaBlock,
  type MegaCell,
  type MegaStrip,
  type NavSection,
  type NavStat,
  type PeopleBlock,
  type RegionsBlock,
} from "@/config/nav";
import { CurrentLink, ExploreLink, LatestCardLink, NavMap } from "./parts";

const px = (n: number) => `${n}px`;
const HEADING = "text-[14px] font-bold leading-5 text-body";
const MARKET_LINK = "hover:text-ink hover:underline";

/**
 * Desktop mega menu (Figma Group_Portfolio / Investor / ESG / News / About): a full-bleed white panel
 * under the 72px header, laid out from the section's data as a grid of cells (columns in the 1440
 * ratios, paddings in px), with an optional grey link strip. Rendered right after its trigger button,
 * so it follows the trigger in tab order.
 */
export function MegaMenu({ section, id, animate }: { section: NavSection; id: string; animate: boolean }) {
  const { panel } = section;
  return (
    <div
      id={id}
      className={`absolute inset-x-0 top-full max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain bg-white ${panel.bottomLine ? "border-b border-line" : ""} ${animate ? "anim-pop" : ""}`}
    >
      <div
        className="mx-auto grid max-w-[1440px]"
        style={{
          gridTemplateColumns: panel.cols.map((c) => `minmax(0, ${c}fr)`).join(" "),
          gridTemplateRows: panel.rows.map((r) => `minmax(${r}px, auto)`).join(" "),
        }}
      >
        {panel.cells.map((cell, i) => (
          <Cell key={i} cell={cell} />
        ))}
      </div>
      {panel.strip && <Strip strip={panel.strip} />}
    </div>
  );
}

function Cell({ cell }: { cell: MegaCell }) {
  const { col, span = 1, row, rowSpan = 1, pad, line = "", surface, eyebrow, flow = "column", gap = 0, blocks } = cell;
  return (
    <div
      className={`min-w-0 ${line.includes("r") ? "border-r border-line" : ""} ${line.includes("b") ? "border-b border-line" : ""} ${surface ? "bg-surface" : ""}`}
      style={{ gridColumn: `${col} / span ${span}`, gridRow: `${row ?? 1} / span ${rowSpan}`, padding: pad.map(px).join(" ") }}
    >
      {eyebrow && <p className="mb-[41px] text-[12px] font-medium leading-5 text-body">{eyebrow}</p>}
      <div className={`flex ${flow === "row" ? "items-start" : "flex-col items-start"}`} style={{ gap: px(gap) }}>
        {blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </div>
  );
}

function Block({ block }: { block: MegaBlock }) {
  switch (block.type) {
    case "item":
      return <Item block={block} />;
    case "regions":
      return <Regions block={block} />;
    case "glance":
      return <Glance block={block} />;
    case "markets":
      return <MarketList block={block} />;
    case "downloads":
      return <Downloads block={block} />;
    case "latest":
      return <Latest block={block} />;
    case "people":
      return <People block={block} />;
  }
}

/** Icon, Bold title, Regular description, then Explore (icon 24, gaps 20 / 12, 202px wide). */
function Item({ block: { item, reserve } }: { block: ItemBlock }) {
  return (
    <div className="flex w-[202px] max-w-full flex-col items-start">
      {item.icon && <Icon name={item.icon} size={24} className="mb-5 text-ink" />}
      <p className={HEADING}>{item.title}</p>
      <p className={`text-[14px] leading-5 text-body ${reserve ? "min-h-10" : ""}`}>{item.text}</p>
      <ExploreLink href={item.href} context={item.title} className="mt-3" />
    </div>
  );
}

/** "Browse properties by region": 4 columns of 144 (gap 10), Asia spanning two; Regular 14/18 links, 32px pitch. */
function Regions({ block }: { block: RegionsBlock }) {
  const uid = useId();
  let start = 1;
  return (
    <div className="w-[606px] min-w-0 shrink">
      <p className={HEADING}>{block.heading}</p>
      <div className="mt-[5px] grid grid-cols-[repeat(4,minmax(0,144px))] gap-x-2.5">
        {block.regions.map((r, i) => {
          const span = r.span ?? 1;
          const column = `${start} / span ${span}`;
          start += span;
          const markets = marketsIn(r.name);
          return (
            <div key={r.name} className="contents">
              <p id={`${uid}-${i}`} className="py-2.5 text-[14px] font-bold leading-5 text-ink" style={{ gridColumn: column, gridRow: 1 }}>
                {r.name}
              </p>
              <ul
                aria-labelledby={`${uid}-${i}`}
                className="grid grid-flow-col gap-x-2.5 gap-y-[14px] py-2.5 text-[14px] leading-[18px] text-body"
                style={{
                  gridColumn: column,
                  gridRow: 2,
                  gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${Math.ceil(markets.length / span)}, auto)`,
                }}
              >
                {markets.map((m) => (
                  <li key={m}>
                    <InertLink className={MARKET_LINK}>{m}</InertLink>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="mt-[42px] flex">
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
    </div>
  );
}

/** Value over label, read as "label: value" (dt first in the DOM). */
function Stats({ stats, className, valueClass, labelClass, gapClass }: { stats: NavStat[]; className: string; valueClass: string; labelClass: string; gapClass: string }) {
  return (
    <dl className={className}>
      {stats.map((s) => (
        <div key={s.label} className={`flex flex-col-reverse justify-end ${gapClass}`}>
          <dt className={labelClass}>{s.label}</dt>
          <dd className={valueClass}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** "ESR at a glance": with the map (Our portfolio, 760 x 244) or as a grey card (Investor, 465 x 358). */
function Glance({ block }: { block: GlanceBlock }) {
  if (block.variant === "map")
    return (
      <div className="mt-1 flex h-[244px] min-w-0 max-w-[760px] flex-1 overflow-hidden rounded-[4px]">
        <NavMap variant="panel" />
        <div className="w-[clamp(250px,20.85vw,300px)] shrink-0 bg-surface pl-[22px] pt-[18px]">
          <p className="text-[11px] font-bold leading-5 text-body">{block.heading}</p>
          <Stats
            stats={block.stats}
            className="mt-[60px] grid grid-cols-[minmax(0,153px)_minmax(0,1fr)] gap-y-[21px]"
            gapClass=""
            valueClass="text-[22px] font-bold leading-6 text-body"
            labelClass="text-[11px] leading-5 text-body"
          />
        </div>
      </div>
    );
  return (
    <div className="mt-[7px] h-[358px] min-w-0 max-w-[465px] flex-1 rounded-[4px] bg-surface pl-9 pt-[18px]">
      <p className="text-[11px] font-bold leading-5 text-body">{block.heading}</p>
      <Stats
        stats={block.stats}
        className="ml-[7px] mt-[42px] grid grid-cols-[218fr_204fr] gap-y-[42px]"
        gapClass="gap-[5px]"
        valueClass="text-[clamp(20px,1.875vw,27px)] font-bold leading-[26px] text-body"
        labelClass="text-[14px] leading-[26px] text-body"
      />
    </div>
  );
}

/** "Invest by Market": region headings inline in each column, Medium 14/20 links, 34px pitch. */
function MarketList({ block }: { block: MarketListBlock }) {
  const uid = useId();
  return (
    <div className="shrink-0">
      <p className={HEADING}>{block.heading}</p>
      <div className="mt-6 flex">
        {block.columns.map((regions, ci) => (
          <div key={ci} style={{ width: px(block.widths[ci]) }}>
            {regions.map((region, gi) => (
              <div key={region} className={gi > 0 ? "mt-12" : ""}>
                <p id={`${uid}-${region}`} className="text-[14px] font-bold leading-5 text-ink">
                  {region}
                </p>
                <ul aria-labelledby={`${uid}-${region}`} className="mt-[14px] flex flex-col gap-[14px] text-[14px] font-medium leading-5 text-ink">
                  {marketsIn(region).map((m) => (
                    <li key={m}>
                      <InertLink className={MARKET_LINK}>{m}</InertLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** "Latest downloads": 2 x 2 (filled column by column), docs icon + Medium 14/20 label, then the reports link. */
function Downloads({ block }: { block: DownloadsBlock }) {
  return (
    <div className="w-full">
      <p className={HEADING}>{block.heading}</p>
      <ul className="mt-[22px] grid grid-flow-col grid-cols-[minmax(0,226px)_minmax(0,1fr)] grid-rows-2 gap-y-[23px]">
        {block.items.map((d) => (
          <li key={d.label}>
            <SmartLink href={d.href} className="flex w-fit items-center gap-[11px] text-[14px] font-medium leading-5 text-ink hover:underline">
              <Icon name="docs" size={24} className="text-body" />
              {d.label}
            </SmartLink>
          </li>
        ))}
      </ul>
      <div className="mt-[39px] flex">
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
    </div>
  );
}

/** "Latest": three 236 x 280 article cards, gap 20. */
function Latest({ block }: { block: LatestBlock }) {
  const uid = useId();
  return (
    <div className="w-full">
      <p id={uid} className={HEADING}>
        {block.heading}
      </p>
      <ul aria-labelledby={uid} className="mt-7 grid grid-cols-3 gap-5">
        {block.cards.map((c) => (
          <li key={c.title}>
            <LatestCardLink card={c} className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Our people": heading (links to the built page), body, two Bold 34/32 stats, jobs link. */
function People({ block }: { block: PeopleBlock }) {
  return (
    <div className="w-full">
      <p className={HEADING}>
        <CurrentLink href={block.heading.href} className="hover:underline">
          {block.heading.label}
        </CurrentLink>
      </p>
      <p className="max-w-[363px] text-[14px] leading-5 text-body">{block.text}</p>
      <Stats
        stats={block.stats}
        className="mt-9 grid max-w-[428px] grid-cols-[minmax(0,245fr)_minmax(0,183fr)]"
        gapClass="gap-1.5"
        valueClass="text-[34px] font-bold leading-8 text-body"
        labelClass="text-[14px] leading-8 text-body"
      />
      <div className="mt-[30px] flex">
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
    </div>
  );
}

/** Grey 59px link strip along the bottom of the News and About menus. */
function Strip({ strip }: { strip: MegaStrip }) {
  return (
    <div className={`bg-surface ${strip.line ? "border-t border-line" : ""}`}>
      <div
        className={`mx-auto flex h-[59px] max-w-[1440px] items-center ${strip.align === "end" ? "justify-end" : ""}`}
        style={{ paddingLeft: px(strip.pad[0]), paddingRight: px(strip.pad[1]), gap: px(strip.gap ?? 24) }}
      >
        {strip.links.map((l) => (
          <ExploreLink key={l.label} href={l.href} label={l.label} />
        ))}
      </div>
    </div>
  );
}
