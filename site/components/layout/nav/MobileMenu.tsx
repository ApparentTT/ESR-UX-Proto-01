"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { InertLink } from "@/components/ui/InertLink";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import {
  MARKET_PANEL,
  NAV_COPY,
  NAV_MARKETS,
  NAV_SECTIONS,
  type ChipsBlock,
  type DownloadsBlock,
  type MobileBlock,
  type MobileLatestBlock,
  type MobileStripBlock,
  type NavItem,
  type NavSection,
  type NavStat,
  type PeopleBlock,
} from "@/config/nav";
import { CurrentMarket } from "./MarketMenu";
import { CurrentLink, ExploreLink, LatestCardLink, MarketCard, NavMap, isCurrentChild, marketFocusMessage } from "./parts";

type View = { level: "root" } | { level: "section"; id: string } | { level: "market"; back: View };

const ROW_TITLE = "text-[14px] font-bold leading-5 text-body";
const ROW_TEXT = "text-[14px] leading-5 text-body";
const PANEL_HEADING = "px-4 text-[11px] font-bold leading-5 text-body";

/**
 * Mobile and tablet menu (Figma Group_*_mob frames). A modal dialog with its own copy of the 72px
 * header (logo, search, close). The drawn frames are the section views; the top level (the five
 * section names) and the back rows are added so they can be reached. Opens straight into the section
 * of the page being viewed. From 768 the sheet is a 420px right panel over the black/80 overlay.
 * A pinned bar holds Contact us and Find your market.
 */
export function MobileMenu({
  current,
  onClose,
  onNavigate,
  onSearch,
  closeRef,
}: {
  current: string | null;
  onClose: () => void;
  /** A real link was followed (inert links show their notice and leave the menu open) */
  onNavigate: (a: HTMLAnchorElement) => void;
  onSearch: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [view, setView] = useState<View>(() => {
    const s = NAV_SECTIONS.find((x) => x.label === current);
    return s ? { level: "section", id: s.id } : { level: "root" };
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  /** Where focus goes after a view change: the back row, or the row that opened the view we came back to. */
  const focusNext = useRef<string | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, [closeRef]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
    const sel = focusNext.current;
    focusNext.current = null;
    if (sel) dialogRef.current?.querySelector<HTMLElement>(sel)?.focus();
  }, [view]);

  const go = (next: View, focus: string) => {
    focusNext.current = focus;
    setView(next);
  };
  const back = (from: View) => {
    if (from.level === "market") go(from.back, from.back.level === "section" ? "[data-back]" : "[data-market-button]");
    else if (from.level === "section") go({ level: "root" }, `[data-section="${from.id}"]`);
  };

  /** aria-modal: Tab and Shift+Tab wrap inside the dialog instead of reaching the page behind it. */
  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []).filter(
      (el) => el.getClientRects().length > 0,
    );
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const section = view.level === "section" ? NAV_SECTIONS.find((s) => s.id === view.id) : undefined;
  const pathname = usePathname();

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={trapTab}
      // Any real link closes the menu (inert links show the notice and leave it open).
      onClick={(e) => {
        const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]:not([href='#'])");
        if (a) onNavigate(a);
      }}
      className="fixed inset-0 z-50 flex flex-col nav:hidden"
    >
      {/* sb-pad: with a classic scrollbar hidden by the scroll lock, the logo and close stay where the page header has them */}
      <div className="sb-pad shrink-0 bg-white shadow-[inset_0_-1px_0_#E5E7EB]">
        <div className="mx-auto flex h-[72px] max-w-(--page-max) items-center justify-between px-6 md:px-10">
          <Link href="/" aria-label="ESR home" className="rounded-btn">
            <Logo />
          </Link>
          <div className="flex items-center">
            <button type="button" aria-label="Search" onClick={onSearch} className="inline-flex size-11 items-center justify-center rounded-btn">
              <Icon name="search" className="text-ink" />
            </button>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="-mr-1.5 inline-flex h-11 w-9 items-center justify-center rounded-btn">
              <Icon name="close" size={24} opsz={24} className="text-ink" />
            </button>
          </div>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <div aria-hidden="true" onClick={onClose} className="anim-fade absolute inset-0 hidden bg-black/80 md:block" />
        <div className="absolute inset-y-0 right-0 flex w-full flex-col bg-white md:w-[420px]">
          <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            {view.level === "root" && <RootList current={current} onOpen={(id) => go({ level: "section", id }, "[data-back]")} />}
            {section && (
              <>
                <BackRow label={section.label} onBack={() => back(view)} />
                <SectionView section={section} />
              </>
            )}
            {view.level === "market" && (
              <>
                <BackRow label={NAV_COPY.findMarket} onBack={() => back(view)} />
                <MarketList />
              </>
            )}
          </div>
          {view.level !== "market" && (
            <div className="flex shrink-0 gap-3 bg-white p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              <Link
                href="/contact"
                aria-current={pathname === "/contact" ? "page" : undefined}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-btn border border-body bg-body text-[16px] font-medium leading-5 text-white hover:bg-ink"
              >
                {NAV_COPY.contact}
              </Link>
              <button
                type="button"
                data-market-button
                onClick={() => go({ level: "market", back: view }, "[data-back]")}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-btn border border-body text-[14px] font-medium leading-5 text-body hover:bg-surface"
              >
                {NAV_COPY.findMarket}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Level 1 (not drawn): the five section names from the desktop header, each opening its drawn frame. */
function RootList({ current, onOpen }: { current: string | null; onOpen: (id: string) => void }) {
  return (
    <nav aria-label="Primary">
      <ul>
        {NAV_SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              data-section={s.id}
              onClick={() => onOpen(s.id)}
              aria-current={current === s.label ? "true" : undefined}
              className="focus-inset flex min-h-14 w-full items-center justify-between gap-4 border-b border-line pl-4 pr-8 text-left text-[14px] font-bold leading-5 text-body hover:bg-surface aria-[current=true]:underline aria-[current=true]:underline-offset-[3px]"
            >
              {s.label}
              <Icon name="chevron_right" className="text-ink" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Exported for the local mobile menu (components/layout/local). */
export function BackRow({ label, onBack }: { label: string; onBack: () => void }) {
  return (
    <button
      type="button"
      data-back
      onClick={onBack}
      className="focus-inset flex h-11 w-full shrink-0 items-center gap-2 border-b border-line px-4 text-left text-[14px] font-medium leading-5 text-body hover:bg-surface"
    >
      <Icon name="arrow_back" className="text-ink" />
      <span>
        <span className="sr-only">Back to menu: </span>
        {label}
      </span>
    </button>
  );
}

/** A page link row: icon (if any), Bold title over Regular text, arrow at the right. The whole row is the link. */
function LinkRow({ item, className }: { item: NavItem; className: string }) {
  const pathname = usePathname();
  const current = isCurrentChild(item.href, pathname);
  return (
    <SmartLink
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={`focus-inset group flex items-center pl-4 pr-[30px] hover:bg-surface ${className}`}
    >
      {item.icon && <Icon name={item.icon} size={24} opsz={24} className="mr-5 text-ink" />}
      <span className="mr-1 min-w-0 flex-1">
        <span className={`block ${ROW_TITLE} ${current ? "underline underline-offset-[3px]" : ""}`}>{item.title}</span>
        <span className={`block ${ROW_TEXT}`}>{item.text}</span>
      </span>
      <Icon name="arrow_forward" size={18} className="text-ink transition-transform group-hover:translate-x-1" />
    </SmartLink>
  );
}

function SectionView({ section }: { section: NavSection }) {
  const uid = useId();
  return (
    <>
      <nav aria-label={section.label}>
        {section.groups.map((g, gi) =>
          g.eyebrow ? (
            // About: text-only rows under eyebrow labels (16/8 and 8/16 padding inside a group)
            <div key={g.eyebrow}>
              <p id={`${uid}-${gi}`} className="px-4 pt-2 text-[12px] font-medium leading-5 text-body">
                {g.eyebrow}
              </p>
              <ul aria-labelledby={`${uid}-${gi}`}>
                {g.items.map((item, i) => {
                  const last = i === g.items.length - 1;
                  const pad = `${i === 0 ? "pt-4" : "pt-2"} ${last && g.items.length > 1 ? "pb-4" : "pb-2"} ${last ? "border-b border-line" : ""}`;
                  return (
                    <li key={item.title}>
                      <LinkRow item={item} className={pad} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <ul key={gi}>
              {g.items.map((item) => (
                <li key={item.title}>
                  <LinkRow item={item} className="border-b border-line py-4" />
                </li>
              ))}
            </ul>
          ),
        )}
      </nav>
      {section.mobile.map((b, i) => (
        <MobileBlockView key={i} block={b} />
      ))}
    </>
  );
}

/** Exported for the local mobile menu (components/layout/local). */
export function MobileBlockView({ block }: { block: MobileBlock }) {
  switch (block.type) {
    case "chips":
      return <ChipsPanel block={block} />;
    case "downloads":
      return <DownloadsPanel block={block} />;
    case "latest":
      return <LatestPanel block={block} />;
    case "people":
      return <PeopleView block={block} />;
    case "strip":
      return <StripView block={block} />;
  }
}

/**
 * Stats as drawn at 390 (2 columns: 147 + 57 gap; 3 columns of 114, gap 12). On narrower screens the
 * 2-column gap closes to 24 (it is 57 from a 358px content width) and the 3-column values step down to
 * 16px, so nothing runs out of its cell or makes the menu scroll sideways.
 */
function StatGrid({ stats, cols }: { stats: NavStat[]; cols: 2 | 3 }) {
  return (
    <dl
      className={`grid ${
        cols === 3
          ? "grid-cols-[repeat(3,minmax(0,114px))] gap-x-3 pl-4 pr-2"
          : "grid-cols-[minmax(0,147px)_minmax(0,1fr)] gap-x-[clamp(24px,calc(100%-301px),57px)] gap-y-[30px] px-4"
      }`}
    >
      {stats.map((s) => (
        <div key={s.label} className={`flex flex-col-reverse justify-end ${cols === 3 ? "gap-0.5" : "gap-1"}`}>
          <dt className="text-[11px] leading-5 text-body">{s.label}</dt>
          <dd className={`whitespace-nowrap font-bold text-body ${cols === 3 ? "text-[clamp(16px,5vw,18px)] leading-5" : "text-[24px] leading-6"}`}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Grey panel: heading, a scrolling row of market chips (first = current scope), stats, and the map (Our portfolio).
 * With the map, the chips are toggle buttons: a market zooms the map to it and shows its stats; choosing it
 * again, or the first chip, returns to all markets. Investor's chips stay inert links.
 */
function ChipsPanel({ block }: { block: ChipsBlock }) {
  const uid = useId();
  const [market, setMarket] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const choose = (m: string | null) => {
    setMarket(m);
    setMessage(marketFocusMessage(m));
  };
  const chip = "flex h-7 items-center whitespace-nowrap rounded-full border px-3 text-[12px] leading-[18px]";
  const chipButton = `focus-inset ${chip} border-line text-body hover:border-ink aria-pressed:border-muted-surface aria-pressed:bg-muted-surface aria-pressed:text-white`;
  const interactive = Boolean(block.map);
  return (
    <div className="flex grow flex-col bg-surface">
      <div className={`pt-[15px] ${block.map ? "pb-[21px]" : "pb-6"}`}>
        <p id={uid} className={PANEL_HEADING}>
          {block.heading}
        </p>
        <ul aria-labelledby={uid} className="no-scrollbar mt-2.5 flex scroll-px-4 gap-2 overflow-x-auto px-4">
          <li className="shrink-0">
            {interactive ? (
              <button type="button" aria-pressed={market === null} onClick={() => choose(null)} className={chipButton}>
                {block.selected}
              </button>
            ) : (
              <span aria-current="true" className={`${chip} border-muted-surface bg-muted-surface text-white`}>
                {block.selected}
              </span>
            )}
          </li>
          {NAV_MARKETS.map((m) => (
            <li key={m.name} className="shrink-0">
              {interactive ? (
                <button
                  type="button"
                  aria-pressed={market === m.name}
                  onClick={(e) => {
                    choose(market === m.name ? null : m.name);
                    e.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
                  }}
                  className={chipButton}
                >
                  {m.name}
                </button>
              ) : (
                <InertLink className={`focus-inset ${chip} border-line text-body hover:border-ink`}>{m.name}</InertLink>
              )}
            </li>
          ))}
        </ul>
        <div className={block.statCols === 3 ? "mt-[26px]" : "mt-7"}>
          <StatGrid stats={(market && block.marketStats) || block.stats} cols={block.statCols} />
        </div>
      </div>
      {/* On screens taller than the drawn frame the sea colour continues below the map */}
      {block.map && <NavMap variant="sheet" focus={market} />}
      {interactive && (
        <p role="status" className="sr-only">
          {message}
        </p>
      )}
    </div>
  );
}

function DownloadsPanel({ block }: { block: DownloadsBlock }) {
  return (
    <div className="grow bg-surface pb-8 pt-[15px]">
      <p className={PANEL_HEADING}>{block.heading}</p>
      <ul className="mt-4 flex flex-col items-start gap-[23px] px-4">
        {block.items.map((d) => (
          <li key={d.label}>
            <SmartLink href={d.href} className="flex items-center gap-[11px] text-[14px] font-medium leading-5 text-ink hover:underline">
              <Icon name="docs" size={24} opsz={24} className="text-ink" />
              {d.label}
            </SmartLink>
          </li>
        ))}
      </ul>
      <div className="mt-12 flex px-4">
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
    </div>
  );
}

/** "Latest": a snap-scrolling row of the three article cards with position dots, then the media links. */
function LatestPanel({ block }: { block: MobileLatestBlock }) {
  const uid = useId();
  const [index, setIndex] = useState(0);
  return (
    <div className="grow bg-surface pb-10 pt-[15px]">
      <p id={uid} className={PANEL_HEADING}>
        {block.heading}
      </p>
      <ul
        aria-labelledby={uid}
        onScroll={(e) => {
          // Cards are 256 apart; when the row is too wide to scroll a whole card, the end of the scroll is the last card
          const el = e.currentTarget;
          const last = block.cards.length - 1;
          setIndex(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 ? last : Math.min(last, Math.round(el.scrollLeft / 256)));
        }}
        className="no-scrollbar mt-1 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 py-3"
      >
        {block.cards.map((c) => (
          <li
            key={c.title}
            // Keyboard focus brings the card to the start of the row (the browser's own scroll is undone by the snapping)
            onFocus={(e) => (e.target as Element).matches(":focus-visible") && e.currentTarget.scrollIntoView({ block: "nearest", inline: "start" })}
            className="w-[236px] shrink-0 snap-start"
          >
            <LatestCardLink card={c} className="h-full" />
          </li>
        ))}
      </ul>
      {/* Position indicator only: the cards scroll by swipe and come into view as they take keyboard focus */}
      <div aria-hidden="true" className="mt-3 flex justify-center gap-1">
        {block.cards.map((c, i) => (
          <span key={c.title} className={`size-1 rounded-full ${i === index ? "bg-black" : "bg-[#D9D9D9]"}`} />
        ))}
      </div>
      <div className="mt-[29px] grid grid-cols-2 px-4">
        {block.links.map((l) => (
          <div key={l.label} className="flex">
            <ExploreLink href={l.href} label={l.label} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PeopleView({ block }: { block: PeopleBlock }) {
  return (
    <div className="pb-[27px] pt-[18px]">
      <div className="px-4">
        <p className={ROW_TITLE}>
          <CurrentLink href={block.heading.href} className="hover:underline">
            {block.heading.label}
          </CurrentLink>
        </p>
        <p className={`max-w-[363px] ${ROW_TEXT}`}>{block.text}</p>
      </div>
      <div className="mt-[27px]">
        <StatGrid stats={block.stats} cols={2} />
      </div>
      <div className="mt-8 flex px-4">
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
    </div>
  );
}

function StripView({ block }: { block: MobileStripBlock }) {
  return (
    <div className="flex min-h-[59px] grow items-start bg-surface px-4 pt-5">
      {block.links.map((l) => (
        <ExploreLink key={l.label} href={l.href} label={l.label} external={l.external} />
      ))}
    </div>
  );
}

/** Find your market (Figma 715:30298): intro, current market, one column of market cards. No bottom bar. */
function MarketList() {
  const uid = useId();
  return (
    <div className="px-4 pb-[33px] pt-4">
      <div className="text-[14px] leading-5 text-body">
        <h2 id={uid} className="font-bold">
          {MARKET_PANEL.title}
        </h2>
        <p>{MARKET_PANEL.body}</p>
      </div>
      <CurrentMarket className="mt-[21px]" />
      <ul aria-labelledby={uid} className="mt-5 flex flex-col gap-2">
        {NAV_MARKETS.map((m) => (
          <li key={m.name}>
            <MarketCard market={m} compact />
          </li>
        ))}
      </ul>
    </div>
  );
}
