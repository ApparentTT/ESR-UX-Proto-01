"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { HIT, T } from "@/components/ui/type";

export type BentoLink = { label: string; href: string | null };

export type BentoTile = {
  /** Stable key, e.g. "industrial" */
  id: string;
  title: string;
  /** Text shown when open. Falls back to the section `description` (the undesigned open states reuse the lorem). */
  description?: string;
  /** White sub-cards across the bottom of the open tile */
  links?: BentoLink[];
  /**
   * Makes the tile title a link (Data centres → /portfolio/data-centres; Infrastructure → null = inert).
   * Leave undefined for a plain title (Industrial and logistics).
   */
  href?: string | null;
};

export type BentoAccordionProps = {
  /** "Our assets" / "What we develop" / "Explore the portfolio" */
  heading: string;
  /** Description of the open tile (verbatim per page) */
  description: string;
  tiles: BentoTile[];
  /** Tile open by default and after "−" (defaults to the first tile) */
  defaultOpenId?: string;
  /** Route of the current page: matching links get aria-current="page" and a highlight. Defaults to the pathname. */
  currentHref?: string;
  headingLevel?: "h2" | "h3";
};

// Desktop slot geometry from the 1306 frame: open tile 869, right column 417, 20px gaps, row 520 tall.
const OPEN_W = "calc((100% - 20px) * 869 / 1286)";
const SIDE_L = "calc((100% - 20px) * 869 / 1286 + 20px)";
const SIDE_W = "calc((100% - 20px) * 417 / 1286)";
const SLOTS = [
  { "--l": "0px", "--t": "0px", "--w": OPEN_W, "--h": "100%" },
  { "--l": SIDE_L, "--t": "0px", "--w": SIDE_W, "--h": "calc(50% - 10px)" },
  { "--l": SIDE_L, "--t": "calc(50% + 10px)", "--w": SIDE_W, "--h": "calc(50% - 10px)" },
] as unknown as React.CSSProperties[];

/**
 * B14 BentoAccordion ("Explore the portfolio" component: PORT §3, DEV §6, DC §8).
 * One tile is always open. "+" on a closed tile opens it into the wide slot (the tiles glide to their new slots
 * over ~300ms at desktop) and closes the current one; "−" returns to the default tile. The default tile's "−"
 * cannot collapse further, so it is aria-disabled (APG accordion pattern). Toggles are buttons with aria-expanded.
 * 1024+: the 869 / 417 bento, 520 tall. 768: the open tile full width, closed tiles side by side below.
 * 390: one column, open tile first.
 */
export function BentoAccordion({ heading, description, tiles, defaultOpenId, currentHref, headingLevel: H = "h2" }: BentoAccordionProps) {
  const fallback = defaultOpenId ?? tiles[0]?.id;
  const [openId, setOpenId] = useState(fallback);
  const pathname = usePathname();
  const current = currentHref ?? pathname;
  const uid = useId();
  const headingId = `${uid}-h`;

  let side = 0;
  const slotOf = (id: string) => (id === openId ? 0 : ++side);
  // Render in visual order (open tile first) so reading and focus order match what is on screen.
  const ordered = [...tiles.filter((t) => t.id === openId), ...tiles.filter((t) => t.id !== openId)];

  return (
    <section aria-labelledby={headingId} className="bg-white py-12 md:py-16 lg:py-20">
      <Container>
        <H id={headingId} className={T.h32r}>
          {heading}
        </H>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:relative lg:mt-7 lg:block lg:h-[520px]">
          {ordered.map((tile) => {
            const open = tile.id === openId;
            const slot = slotOf(tile.id);
            const isDefault = tile.id === fallback;
            const panelId = `${uid}-${tile.id}`;
            const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
              const btn = e.currentTarget;
              if (!open) setOpenId(tile.id);
              else if (!isDefault) setOpenId(fallback);
              // Reordering can move this tile in the DOM, which drops focus; put it back on the toggle.
              requestAnimationFrame(() => btn.isConnected && document.activeElement !== btn && btn.focus({ preventScroll: true }));
            };
            return (
              <div
                key={tile.id}
                style={SLOTS[Math.min(slot, SLOTS.length - 1)]}
                className={`relative overflow-hidden rounded-card bg-line lg:absolute lg:left-[var(--l)] lg:top-[var(--t)] lg:h-[var(--h)] lg:w-[var(--w)] lg:transition-[left,top,width,height] lg:duration-300 lg:ease-out lg:motion-reduce:transition-none ${
                  open ? "md:col-span-2" : "min-h-[140px] md:min-h-[180px] lg:min-h-0"
                }`}
              >
                <div className={`flex h-full flex-col p-5 md:p-6 lg:p-7 ${open ? "" : "justify-end"}`}>
                  <h3 className={`pr-14 text-[20px] font-bold text-black md:pr-16 lg:text-[24px] ${open ? "leading-[1.2] lg:pt-[17px] lg:leading-[1.12]" : "leading-[1.45]"}`}>
                    <TileTitle tile={tile} current={current} />
                  </h3>
                  <div id={panelId} hidden={!open} className={open ? "anim-fade flex flex-1 flex-col" : ""}>
                    <p className={`mt-4 max-w-[658px] lg:mt-[29px] ${T.bodyLg}`}>{tile.description ?? description}</p>
                    {!!tile.links?.length && (
                      <ul role="list" className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:mt-auto lg:gap-[26px]">
                        {tile.links.map((l) => (
                          <li key={l.label}>
                            <SubCard link={l} current={current} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggle}
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-disabled={open && isDefault ? true : undefined}
                  aria-label={tile.title}
                  className={`absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors md:right-5 md:top-5 lg:right-6 lg:top-6 ${
                    open ? "bg-white" : "bg-white/90 hover:bg-white"
                  } ${open && isDefault ? "cursor-default" : "hover:shadow-[0_1px_4px_rgba(0,0,0,0.12)]"}`}
                >
                  <Icon name={open ? "remove" : "add"} size={22} />
                </button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function isCurrent(href: string | null | undefined, current: string | null | undefined) {
  return !!href && !!current && href === current;
}

/** The tile title: plain text, or a link when the tile has an href (current page → aria-current + thicker underline). */
function TileTitle({ tile, current }: { tile: BentoTile; current?: string | null }) {
  if (tile.href === undefined) return <>{tile.title}</>;
  const here = isCurrent(tile.href, current);
  return (
    <SmartLink
      href={tile.href}
      aria-current={here ? "page" : undefined}
      className={`${HIT} underline-offset-4 hover:underline ${here ? "underline decoration-2" : ""}`}
    >
      {tile.title}
    </SmartLink>
  );
}

/** White sub-card, content bottom-aligned: Medium 17/1.45 label + arrow_forward at the right. */
function SubCard({ link, current }: { link: BentoLink; current?: string | null }) {
  const here = isCurrent(link.href, current);
  return (
    <SmartLink
      href={link.href}
      aria-current={here ? "page" : undefined}
      className={`group flex h-[120px] items-end justify-between gap-3 rounded-card bg-white pb-6 pl-[18px] pr-4 text-[16px] font-medium leading-[1.45] text-ink transition-shadow hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] md:h-[180px] lg:h-[227px] lg:pb-8 lg:text-[17px] ${
        here ? "ring-2 ring-inset ring-ink" : ""
      }`}
    >
      <span className="underline-offset-4 group-hover:underline">{link.label}</span>
      <Icon name="arrow_forward" size={20} className="mb-0.5 transition-transform group-hover:translate-x-1" />
    </SmartLink>
  );
}
