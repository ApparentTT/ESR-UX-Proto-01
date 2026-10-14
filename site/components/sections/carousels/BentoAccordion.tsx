"use client";

import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { HIT, T } from "@/components/ui/type";

export type BentoLink = { label: string; href: string | null; /** Material Symbols name; defaults by label */ icon?: string };

export type BentoTile = {
  /** Stable key, e.g. "industrial" */
  id: string;
  title: string;
  /** Text shown when open. Falls back to the section `description`. */
  description?: string;
  /** White sub-cards across the bottom of the first (wide) tile when it is open */
  links?: BentoLink[];
  /** "Explore now" destination of the other tiles when open (null = inert). Undefined = no link. */
  href?: string | null;
};

export type BentoAccordionProps = {
  /** "Our assets" / "What we develop" / "Explore the portfolio" */
  heading: string;
  /** Text of the open tile (verbatim per page) */
  description: string;
  tiles: BentoTile[];
  /** Tile open by default (defaults to the first tile) */
  defaultOpenId?: string;
  /** Route of the current page: matching links get aria-current="page" and a highlight. Defaults to the pathname. */
  currentHref?: string;
  headingLevel?: "h2" | "h3";
};

const SUB_ICONS: Record<string, string> = { Properties: "apartment", Developments: "handyman" };

/**
 * "Our assets / our portfolio" module (Figma 1455:42800, Explore the portfolio: Open, Open-data, Open-infrastructure).
 * One tile is always open and none has a close control; a closed tile opens with its "+" (the whole tile is the hit area).
 * 1024+: the first tile (Industrial and logistics) owns the left column and the others stack on the right, 520 tall
 *   (taller only if content needs it at narrow desktop widths).
 *   First tile open: 869 / 417 columns, the right tiles 250 tall each.
 *   Another tile open: 449 / 837 columns, the open right tile 322 tall and the closed one 178, the first tile collapsed.
 *   Columns and rows glide between states (instant under reduced motion).
 * Below 1024: one column in source order, the open tile expanded in place.
 * Each title is a button in an h3 (accordion pattern) that stays in place across states, so focus is never lost.
 */
export function BentoAccordion({ heading, description, tiles, defaultOpenId, currentHref, headingLevel: H = "h2" }: BentoAccordionProps) {
  const [openId, setOpenId] = useState(defaultOpenId ?? tiles[0]?.id);
  const pathname = usePathname();
  const current = currentHref ?? pathname;
  const uid = useId();
  const headingId = `${uid}-h`;

  const [first, ...rest] = tiles;
  const firstOpen = openId === first?.id;
  // Grid tracks in fr so the browser can interpolate them between states.
  const columns = firstOpen ? "869fr 417fr" : "449fr 837fr";
  const rows = rest.map((t) => (firstOpen ? "1fr" : t.id === openId ? "322fr" : "178fr")).join(" ");

  return (
    <section aria-labelledby={headingId} className="bg-white py-12 md:py-16 lg:py-20">
      <Container>
        <H id={headingId} className={T.h32r}>
          {heading}
        </H>
        <div
          className="mt-6 flex flex-col gap-4 lg:mt-7 lg:grid lg:min-h-[520px] lg:gap-5 lg:transition-[grid-template-columns,grid-template-rows] lg:duration-500 lg:ease-out lg:motion-reduce:transition-none"
          style={{ gridTemplateColumns: columns, gridTemplateRows: rows }}
        >
          {tiles.map((tile, i) => {
            const wide = i === 0;
            return (
              <Tile
                key={tile.id}
                tile={tile}
                open={tile.id === openId}
                wide={wide}
                description={tile.description ?? description}
                current={current}
                onOpen={() => setOpenId(tile.id)}
                style={wide ? { gridColumn: 1, gridRow: `1 / span ${Math.max(1, rest.length)}` } : { gridColumn: 2, gridRow: i }}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Tile({
  tile,
  open,
  wide,
  description,
  current,
  onOpen,
  style,
}: {
  tile: BentoTile;
  open: boolean;
  wide: boolean;
  description: string;
  current?: string | null;
  onOpen: () => void;
  style: React.CSSProperties;
}) {
  const panelId = useId();
  return (
    <div
      style={style}
      className={`relative flex min-h-0 flex-col overflow-hidden rounded-card bg-line p-5 md:p-6 lg:px-7 ${
        open ? (wide ? "lg:pb-7 lg:pt-[41px]" : "lg:pb-8 lg:pt-[30px]") : "min-h-[120px] justify-end md:min-h-[150px] lg:min-h-0 lg:pb-7"
      }`}
    >
      <h3 className={`text-[20px] font-bold text-black lg:text-[24px] ${open ? "leading-[1.12]" : "pr-14 leading-[1.45]"}`}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-disabled={open || undefined}
          onClick={() => !open && onOpen()}
          className={`text-left focus-visible:outline-offset-4 ${
            open ? "cursor-default" : "after:absolute after:inset-0 after:rounded-card after:content-[''] hover:underline hover:underline-offset-4"
          }`}
        >
          {tile.title}
        </button>
      </h3>

      {/* Decorative: the title button above covers the whole closed tile */}
      {!open && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-ink md:right-5 md:top-5 lg:right-6 lg:top-6"
        >
          <Icon name="add" size={22} />
        </span>
      )}

      {open && (
        <div id={panelId} className="anim-fade flex min-h-0 flex-1 flex-col">
          <p className={`mt-3 max-w-[658px] lg:mt-[29px] ${T.bodyLg}`}>{description}</p>
          {wide && !!tile.links?.length ? (
            <ul role="list" className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:mt-auto lg:gap-[26px]">
              {tile.links.map((l) => (
                <li key={l.label}>
                  <SubCard link={l} current={current} />
                </li>
              ))}
            </ul>
          ) : tile.href !== undefined ? (
            <div className="mt-6 lg:mt-auto">
              <ExploreLink href={tile.href} label={tile.title} current={current} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function isCurrent(href: string | null | undefined, current: string | null | undefined) {
  return !!href && !!current && href === current;
}

/** "Explore now →" on an open tile: Medium 17/1.45 + arrow_forward. */
function ExploreLink({ href, label, current }: { href: string | null; label: string; current?: string | null }) {
  const here = isCurrent(href, current);
  return (
    <SmartLink
      href={href}
      aria-current={here ? "page" : undefined}
      className={`${HIT} group inline-flex items-center gap-7 text-[16px] font-medium leading-[1.45] text-ink lg:text-[17px]`}
    >
      <span className={`underline-offset-4 group-hover:underline ${here ? "underline" : ""}`}>
        Explore now<span className="sr-only">: {label}</span>
      </span>
      <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
    </SmartLink>
  );
}

/** White sub-card, content bottom-aligned: 24px icon, then Medium 17/1.45 label with arrow_forward at the right. */
function SubCard({ link, current }: { link: BentoLink; current?: string | null }) {
  const here = isCurrent(link.href, current);
  const icon = link.icon ?? SUB_ICONS[link.label];
  return (
    <SmartLink
      href={link.href}
      aria-current={here ? "page" : undefined}
      className={`group flex h-[132px] flex-col justify-end gap-4 rounded-card bg-white py-6 pl-[18px] pr-4 text-ink transition-shadow hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] md:h-[180px] lg:h-[227px] lg:gap-5 lg:py-8 ${
        here ? "ring-2 ring-inset ring-ink" : ""
      }`}
    >
      {icon && <Icon name={icon} size={24} opsz={24} />}
      <span className="flex items-end gap-3">
        <span className="flex-1 text-[16px] font-medium leading-[1.45] underline-offset-4 group-hover:underline lg:text-[17px]">{link.label}</span>
        <Icon name="arrow_forward" size={20} className="mb-0.5 transition-transform group-hover:translate-x-1" />
      </span>
    </SmartLink>
  );
}
