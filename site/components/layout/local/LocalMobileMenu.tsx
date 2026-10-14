"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { BackRow, MobileBlockView } from "@/components/layout/nav/MobileMenu";
import { ExploreLink, LatestCardLink, isCurrentChild } from "@/components/layout/nav/parts";
import { NAV_COPY } from "@/config/nav";
import {
  GROUP_SITE_SUFFIX,
  LOCAL_SECTIONS,
  LOCAL_SITE,
  LOCAL_UTILITY,
  type FundsBlock,
  type LocalMobileBlock,
  type LocalNavItem,
  type LocalSection,
} from "@/config/local-nav";
import { LocalMarketList } from "./LocalMarketMenu";
import { PropertySearchForm } from "./parts";

type View = { level: "root" } | { level: "section"; id: string } | { level: "market"; back: View };

const ROW_TITLE = "text-[14px] font-bold leading-5 text-body";
const ROW_TEXT = "text-[14px] leading-5 text-body";
const PANEL_HEADING = "px-4 text-[11px] font-bold leading-5 text-body";

/**
 * Local mobile and tablet menu (Figma Local_Our portfolio_mob 718:853, Local_News_mob 719:1328 and the
 * Investors / ESG / About / market frames beside them). The group mobile menu's pattern: a modal dialog with
 * its own copy of the 72px header (logo, search, close); the drawn frames are the section views, the top level
 * (the five section names, then the utility links from the desktop bar) and the back rows are added so they
 * can be reached. Opens straight into the section of the page being viewed. From 768 the sheet is a 420px
 * right panel over the black/80 overlay. A pinned bar holds Contact us and Find your market.
 */
export function LocalMobileMenu({
  current,
  onClose,
  onNavigate,
  onSearch,
  onSubmitted,
  closeRef,
}: {
  /** Section id of the page being viewed */
  current: string | null;
  onClose: () => void;
  /** A real link was followed (inert links show their notice and leave the menu open) */
  onNavigate: (a: HTMLAnchorElement) => void;
  onSearch: () => void;
  /** The property search was submitted */
  onSubmitted: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [view, setView] = useState<View>(() => (LOCAL_SECTIONS.some((s) => s.id === current) && current ? { level: "section", id: current } : { level: "root" }));
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  /** Where focus goes after a view change: the back row, or the row that opened the view we came back to. */
  const focusNext = useRef<string | null>(null);
  const pathname = usePathname();

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
    const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []).filter(
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

  const section = view.level === "section" ? LOCAL_SECTIONS.find((s) => s.id === view.id) : undefined;

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
      <div className="sb-pad shrink-0 bg-white shadow-[inset_0_-1px_0_#E5E7EB]">
        <div className="mx-auto flex h-[72px] max-w-(--page-max) items-center justify-between px-6 md:px-10">
          <Link href={LOCAL_SITE.home} aria-label={LOCAL_SITE.homeLabel} className="rounded-btn">
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
                <SectionView section={section} onSubmitted={onSubmitted} />
              </>
            )}
            {view.level === "market" && (
              <>
                <BackRow label={NAV_COPY.findMarket} onBack={() => back(view)} />
                <LocalMarketList />
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

/**
 * Level 1 (not drawn): the five section names from the desktop header, each opening its drawn frame, then
 * the desktop utility bar's links (the mobile header has no utility bar).
 */
function RootList({ current, onOpen }: { current: string | null; onOpen: (id: string) => void }) {
  const pathname = usePathname();
  return (
    <>
      <nav aria-label="Primary">
        <ul>
          {LOCAL_SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                data-section={s.id}
                onClick={() => onOpen(s.id)}
                aria-current={current === s.id ? "true" : undefined}
                className="focus-inset flex min-h-14 w-full items-center justify-between gap-4 border-b border-line pl-4 pr-8 text-left text-[14px] font-bold leading-5 text-body hover:bg-surface aria-[current=true]:underline aria-[current=true]:underline-offset-[3px]"
              >
                {s.label}
                <Icon name="chevron_right" className="text-ink" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="Quick links" className="grow bg-surface pb-6 pt-2">
        <ul>
          {LOCAL_UTILITY.map((l) => (
            <li key={l.label}>
              <SmartLink
                href={l.href}
                aria-current={isCurrentChild(l.href, pathname) ? "page" : undefined}
                className="focus-inset flex min-h-12 items-center px-4 text-[14px] font-medium leading-5 text-body hover:text-ink hover:underline"
              >
                {l.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/** A page link row: icon (if any), Bold title over Regular text, arrow at the right. The whole row is the link. */
function LinkRow({ item, className }: { item: LocalNavItem; className: string }) {
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
        {item.external && <span className="sr-only"> {GROUP_SITE_SUFFIX}</span>}
      </span>
      <Icon name="arrow_forward" size={18} className="text-ink transition-transform group-hover:translate-x-1" />
    </SmartLink>
  );
}

function SectionView({ section, onSubmitted }: { section: LocalSection; onSubmitted: () => void }) {
  const uid = useId();
  return (
    <>
      {section.mobileTop?.map((b, i) => (
        <LocalMobileBlockView key={i} block={b} onSubmitted={onSubmitted} />
      ))}
      <nav aria-label={section.label} className={section.mobileTop ? "border-t border-line" : undefined}>
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
        <LocalMobileBlockView key={i} block={b} onSubmitted={onSubmitted} />
      ))}
    </>
  );
}

function LocalMobileBlockView({ block, onSubmitted }: { block: LocalMobileBlock; onSubmitted: () => void }) {
  switch (block.type) {
    case "propertySearch":
      // 718:853: 25 from the header, 19 / 32 side insets (339 wide at 390), the rows 41 below
      return <PropertySearchForm block={block} onSubmitted={onSubmitted} className="pb-[41px] pl-[19px] pr-8 pt-[25px]" />;
    case "funds":
      return <FundsPanel block={block} />;
    default:
      return <MobileBlockView block={block} />;
  }
}

/** "Explore key funds" (718:936): a snap-scrolling row of the fund cards, then "Explore All funds". */
function FundsPanel({ block }: { block: FundsBlock }) {
  const uid = useId();
  return (
    <div className="grow bg-surface pb-10 pt-[15px]">
      <p id={uid} className={PANEL_HEADING}>
        {block.heading}
      </p>
      <ul aria-labelledby={uid} className="no-scrollbar mt-1 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 py-3">
        {block.cards.map((c, i) => (
          <li
            key={i}
            // Keyboard focus brings the card to the start of the row (the browser's own scroll is undone by the snapping)
            onFocus={(e) => (e.target as Element).matches(":focus-visible") && e.currentTarget.scrollIntoView({ block: "nearest", inline: "start" })}
            className="w-[236px] shrink-0 snap-start"
          >
            <LatestCardLink card={c} className="h-full" />
          </li>
        ))}
      </ul>
      <div className="mt-[31px] flex px-4">
        <ExploreLink href={block.link.href} label={block.link.label} />
      </div>
    </div>
  );
}
