"use client";

import { createContext, useContext, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { InertLink } from "@/components/ui/InertLink";
import {
  ALL_MARKETS,
  marketsIn,
  type CaseStudiesBlock,
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
import { CaseStudyCardLink, CurrentLink, ExploreLink, LatestCardLink, NavMap, marketFocusMessage } from "./parts";

const px = (n: number | string) => (typeof n === "number" ? `${n}px` : n);
const HEADING = "text-[14px] font-bold leading-5 text-body";
const MARKET_LINK = "hover:text-ink hover:underline";

/**
 * The market chosen in "Browse properties by region" (Our portfolio), shared by the region list and the
 * "ESR at a glance" map card beside it. null is the drawn APAC view.
 */
type MarketFocus = {
  market: string | null;
  choose: (market: string | null) => void;
  /** Back to all markets, focus on the market button that was chosen (the control that did it goes away) */
  reset: () => void;
  buttons: React.RefObject<Record<string, HTMLButtonElement | null>>;
  glanceId: string;
};
const MarketFocusContext = createContext<MarketFocus | null>(null);

/**
 * Desktop mega menu (Figma Group_Portfolio / Investor / ESG / News / About): a full-bleed white panel
 * under the 72px header, laid out from the section's data as a grid of cells (columns in the 1440
 * ratios, paddings in px), with an optional grey link strip. Rendered right after its trigger button,
 * so it follows the trigger in tab order; a region named by that button.
 * Above 1440 the grid stays centred and the cells on its outer edges carry their grey and their bottom
 * line on to the window edge (clipped by the panel).
 */
export function MegaMenu({ section, id, labelledBy, animate }: { section: NavSection; id: string; labelledBy: string; animate: boolean }) {
  const { panel } = section;
  const hasRegions = panel.cells.some((c) => c.blocks.some((b) => b.type === "regions"));
  const [market, setMarket] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const glanceId = useId();
  const choose = (m: string | null) => {
    setMarket(m);
    setMessage(marketFocusMessage(m));
  };
  const focus: MarketFocus = {
    market,
    choose,
    reset: () => {
      const was = market;
      choose(null);
      if (was) requestAnimationFrame(() => buttons.current[was]?.focus());
    },
    buttons,
    glanceId,
  };
  return (
    <MarketFocusContext.Provider value={focus}>
      <div
        id={id}
        role="region"
        aria-labelledby={labelledBy}
        className={`sb-pad absolute inset-x-0 top-full max-h-[calc(var(--full-h)-72px)] overflow-y-auto overflow-x-hidden overscroll-contain bg-white ${panel.bottomLine ? "border-b border-line" : ""} ${animate ? "anim-pop" : ""}`}
      >
        <div
          className="mx-auto grid max-w-(--page-max)"
          style={{
            gridTemplateColumns: panel.cols.map((c) => (typeof c === "number" ? `minmax(0, ${c}fr)` : `minmax(${c[1]}px, ${c[0]}fr)`)).join(" "),
            gridTemplateRows: panel.rows.map((r) => `minmax(${r}px, auto)`).join(" "),
          }}
        >
          {panel.cells.map((cell, i) => (
            <Cell key={i} cell={cell} lastCol={panel.cols.length} />
          ))}
        </div>
        {panel.strip && <Strip strip={panel.strip} />}
        {hasRegions && (
          <p role="status" className="sr-only">
            {message}
          </p>
        )}
      </div>
    </MarketFocusContext.Provider>
  );
}

function Cell({ cell, lastCol }: { cell: MegaCell; lastCol: number }) {
  const { col, span = 1, row, rowSpan = 1, pad, line = "", surface, eyebrow, label, center, flow = "column", gap = 0, blocks } = cell;
  const uid = useId();
  const lineB = line.includes("b");
  /** Sides that touch the panel edge and carry the grey or the bottom line on to the window edge */
  const bleed: string[] = [];
  if (surface || lineB) {
    if (col === 1) bleed.push("right-full");
    if (col + span - 1 === lastCol) bleed.push("left-full");
  }
  const layout = `flex ${flow === "row" ? "items-start" : "flex-col items-start"}`;
  return (
    <div
      // The column divider is the cell's first pixel column (x 295, 590 ... as drawn), so it takes no space
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
        // About: each eyebrow names the list of its pages
        <>
          <p id={uid} className="mb-[41px] text-[12px] font-medium leading-5 text-body">
            {eyebrow}
          </p>
          <ul aria-labelledby={uid} className={layout} style={{ gap: px(gap) }}>
            {blocks.map((b, i) => (
              <li key={i} className="max-w-full">
                <Block block={b} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={layout} style={{ gap: px(gap) }}>
          {blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * A group label over the cells below it (Our portfolio's "Industrial and logistics"), in the About eyebrow
 * style; the cell's bottom line is the rule under it. Exported for the local menus.
 */
export function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-medium leading-5 text-body">{children}</p>;
}

/** One block of a mega menu cell (exported for the local menus, components/layout/local). */
export function Block({ block }: { block: MegaBlock }) {
  switch (block.type) {
    case "item":
      return <Item block={block} />;
    case "regions":
      return <Regions block={block} />;
    case "glance":
      return <Glance block={block} />;
    case "markets":
      return <MarketList block={block} />;
    case "caseStudies":
      return <CaseStudies block={block} />;
    case "latest":
      return <Latest block={block} />;
    case "people":
      return <People block={block} />;
  }
}

/**
 * Icon, Bold title, Regular description, then Explore (icon 24, gaps 20 / 12, 202px wide). layout "row": the
 * icon beside the text (Investment management's stacked rows). An item's own call to action replaces
 * "Explore"; an offsite item (Infrastructure) gets open_in_new.
 */
function Item({ block: { item, reserve, wide, layout } }: { block: ItemBlock }) {
  if (layout === "row")
    return (
      <div className="flex max-w-full items-start gap-4">
        {item.icon && <Icon name={item.icon} size={24} opsz={24} className="text-ink" />}
        <div className="flex min-w-0 flex-col items-start">
          <p className={HEADING}>{item.title}</p>
          <p className="text-[14px] leading-5 text-body">{item.text}</p>
          <ExploreLink href={item.href} context={item.title} label={item.cta} offsite={item.offsite} className="mt-2" />
        </div>
      </div>
    );
  return (
    <div className={`flex max-w-full flex-col items-start ${wide ? "w-full" : "w-[202px]"}`}>
      {item.icon && <Icon name={item.icon} size={24} opsz={24} className="mb-5 text-ink" />}
      <p className={HEADING}>{item.title}</p>
      <p className={`text-[14px] leading-5 text-body ${reserve ? "min-h-10" : ""}`}>{item.text}</p>
      <ExploreLink href={item.href} context={item.title} label={item.cta} offsite={item.offsite} className="mt-3" />
    </div>
  );
}

/**
 * "Browse properties by region": 4 columns of 144 (gap 10), Asia spanning two; Regular 14/18 markets, 32px pitch.
 * Each market is a toggle button: it zooms the map beside it to that market and shows its "ESR at a glance"
 * (Bold and underlined while chosen); choosing it again returns to all markets.
 */
function Regions({ block }: { block: RegionsBlock }) {
  const uid = useId();
  const focus = useContext(MarketFocusContext);
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
                    {focus ? (
                      <button
                        ref={(el) => {
                          focus.buttons.current[m] = el;
                        }}
                        type="button"
                        aria-pressed={focus.market === m}
                        aria-controls={focus.glanceId}
                        onClick={() => focus.choose(focus.market === m ? null : m)}
                        className={`rounded-[2px] text-left decoration-1 underline-offset-2 ${MARKET_LINK} aria-pressed:font-bold aria-pressed:text-ink aria-pressed:underline`}
                      >
                        {m}
                      </button>
                    ) : (
                      <InertLink className={MARKET_LINK}>{m}</InertLink>
                    )}
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
          <dd className={valueClass} style={s.size ? { fontSize: s.size } : undefined}>
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * "ESR at a glance": with the map (Our portfolio, 760 x 244) or as a grey card (Investor, 358 high, filling its column).
 * Map variant, with a market chosen in the region list: the map zooms to it, the heading reads
 * "ESR at a glance: {market}" over that market's stats, and "All markets" (top left of the map) goes back.
 */
function Glance({ block }: { block: GlanceBlock }) {
  const focus = useContext(MarketFocusContext);
  const market = block.variant === "map" ? (focus?.market ?? null) : null;
  if (block.variant === "map")
    return (
      <div id={focus?.glanceId} className="mt-1 flex h-[244px] min-w-0 max-w-[760px] flex-1 overflow-hidden rounded-[4px]">
        <div className="relative flex min-w-0 flex-1">
          <NavMap variant="panel" focus={market} />
          {market && focus && (
            <button
              type="button"
              onClick={focus.reset}
              className="anim-pop absolute left-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white pl-2.5 pr-3 text-[12px] font-medium leading-[18px] text-ink shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:border-ink"
            >
              <Icon name="zoom_out_map" size={16} />
              {ALL_MARKETS}
            </button>
          )}
        </div>
        <div className="w-[clamp(250px,20.85vw,300px)] shrink-0 bg-surface pl-[22px] pr-4 pt-[18px]">
          <p className="text-[11px] font-bold leading-5 text-body">{market ? `${block.heading}: ${market}` : block.heading}</p>
          {/* Values on a 20px line, labels 2px under (Figma 98 / 120, 163 / 185); column 1 gives way first when narrow */}
          <Stats
            stats={(market && block.marketStats) || block.stats}
            className="mt-[60px] grid grid-cols-[minmax(0,153px)_auto] gap-y-[23px]"
            gapClass="gap-0.5"
            valueClass="whitespace-nowrap text-[22px] font-bold leading-5 text-body"
            labelClass="whitespace-nowrap text-[11px] leading-5 text-body"
          />
        </div>
      </div>
    );
  return (
    <div className="mt-[7px] h-[358px] min-w-0 flex-1 rounded-[4px] bg-surface pl-9 pr-4 pt-[18px]">
      <p className="text-[11px] font-bold leading-5 text-body">{block.heading}</p>
      <Stats
        stats={block.stats}
        className="ml-[7px] mt-[42px] grid grid-cols-[minmax(0,218px)_auto] gap-y-[42px]"
        gapClass="gap-[5px]"
        valueClass="whitespace-nowrap text-[clamp(20px,1.875vw,27px)] font-bold leading-[26px] text-body"
        labelClass="whitespace-nowrap text-[14px] leading-[26px] text-body"
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
                <p id={`${uid}-${ci}-${gi}`} className="text-[14px] font-bold leading-5 text-ink">
                  {region}
                </p>
                <ul aria-labelledby={`${uid}-${ci}-${gi}`} className="mt-[14px] flex flex-col gap-[14px] text-[14px] font-medium leading-5 text-ink">
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

/** "Featured case studies": heading with "View all case studies" at the right, over two 16:9 case study cards. */
function CaseStudies({ block }: { block: CaseStudiesBlock }) {
  const uid = useId();
  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-6">
        <p id={uid} className={HEADING}>
          {block.heading}
        </p>
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
      <ul aria-labelledby={uid} className="mt-[18px] grid grid-cols-2 gap-4">
        {block.cards.map((c, i) => (
          <li key={i}>
            <CaseStudyCardLink card={c} className="h-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Latest": three 236 x 280 article cards, gap 20. */
function Latest({ block }: { block: LatestBlock }) {
  const uid = useId();
  return (
    <div className="w-full">
      <p id={uid} className={`ml-0.5 ${HEADING}`}>
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

/** Grey 59px link strip along the bottom of the News and About menus (exported for the local menus). */
export function Strip({ strip }: { strip: MegaStrip }) {
  return (
    <div className={`sb-bleed bg-surface ${strip.line ? "border-t border-line" : ""}`}>
      <div
        className={`mx-auto flex h-[59px] max-w-(--page-max) items-center ${strip.align === "end" ? "justify-end" : ""}`}
        style={{ paddingLeft: px(strip.pad[0]), paddingRight: px(strip.pad[1]), gap: px(strip.gap ?? 24) }}
      >
        {strip.links.map((l) => (
          <ExploreLink key={l.label} href={l.href} label={l.label} external={l.external} />
        ))}
      </div>
    </div>
  );
}
