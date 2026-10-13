"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { SearchPanel } from "@/components/layout/nav/SearchPanel";
import { DESKTOP_QUERY, isCurrentChild, isSamePageLink, useIsDesktop, useScrollLock } from "@/components/layout/nav/parts";
import { NAV_COPY } from "@/config/nav";
import { LOCAL_SECTIONS, LOCAL_SITE, LOCAL_UTILITY, localActiveSection } from "@/config/local-nav";
import { LocalMarketMenu } from "./LocalMarketMenu";
import { LocalMegaMenu } from "./LocalMegaMenu";
import { LocalMobileMenu } from "./LocalMobileMenu";

/** One header layer open at a time: a section mega menu, the market selector, search, or the mobile menu. */
type Open = { kind: "mega"; id: string } | { kind: "market" } | { kind: "search" } | { kind: "menu" } | null;
const keyOf = (o: NonNullable<Open>) => (o.kind === "mega" ? `mega:${o.id}` : o.kind);

/** Opens another mega menu when the pointer rests on its item while one is already open. */
const HOVER_SWITCH_MS = 120;

/**
 * Local market header (Figma "Local Navigation" 672:25982; Japan: 1110:53283).
 * Desktop (from 1180): a 40px utility bar (the market name, then Find properties, Tenant portal login and
 * Find jobs) over the 72px bar: logo (to the local home), the five local section items, the market button
 * ("Japan", opening the market panel), search and Contact us. Section items open the local mega menus.
 * Below 1180: the group mobile header (logo, search, menu), with the local menu.
 *
 * Behaves as the group header (SiteHeader): Escape closes the open layer and returns focus to its trigger;
 * clicking the overlay, a link, another trigger, a route change, or tabbing away from the trigger and its panel
 * also close it; a resize across 1180 moves focus to the trigger's counterpart. Search is the group search.
 */
export function LocalHeader() {
  const pathname = usePathname();
  const routeId = localActiveSection(pathname);
  const [open, setOpenState] = useState<Open>(null);
  /** Panels animate in only when opening from closed, so switching menus does not flash. */
  const [animate, setAnimate] = useState(true);
  const openRef = useRef<Open>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuCloseRef = useRef<HTMLButtonElement | null>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  /** true after a pointer press, false after a key press: tells a click on another trigger from tabbing away. */
  const pointerRef = useRef(false);

  const setOpen = useCallback((next: Open) => {
    setAnimate(openRef.current === null);
    openRef.current = next;
    setOpenState(next);
  }, []);
  const close = useCallback(
    (focusTrigger = false) => {
      const cur = openRef.current;
      if (!cur) return;
      setOpen(null);
      if (focusTrigger) requestAnimationFrame(() => triggers.current[keyOf(cur)]?.focus({ preventScroll: true }));
    },
    [setOpen],
  );
  const toggle = (next: NonNullable<Open>) => {
    window.clearTimeout(hoverTimer.current);
    const cur = openRef.current;
    setOpen(cur && keyOf(cur) === keyOf(next) ? null : next);
  };

  // A route change closes everything.
  useEffect(() => {
    openRef.current = null;
    setOpenState(null);
  }, [pathname]);

  useEffect(() => {
    const down = () => (pointerRef.current = true);
    const key = () => (pointerRef.current = false);
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("keydown", key, true);
      window.clearTimeout(hoverTimer.current);
    };
  }, []);

  const megaId = open?.kind === "mega" ? open.id : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    // The desktop and mobile layers never survive a resize across the breakpoint. If focus was in the
    // layer, it moves to the trigger's counterpart at the new size (a section item or the menu button).
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onBreakpoint = () => {
      const cur = openRef.current;
      close();
      requestAnimationFrame(() => {
        if (document.activeElement && document.activeElement !== document.body) return;
        const t = triggers.current;
        const fallback = mq.matches ? t[`mega:${routeId ?? LOCAL_SECTIONS[0].id}`] : t.menu;
        const target = [cur && t[keyOf(cur)], fallback].find((el) => el && el.getClientRects().length > 0);
        target?.focus({ preventScroll: true });
      });
    };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreakpoint);
    };
  }, [open, close, routeId]);

  useScrollLock(open !== null);

  // Below 1180 search is a full-screen sheet: the page under it leaves the tab order and the accessibility tree.
  const desktop = useIsDesktop();
  const searchSheet = open?.kind === "search" && !desktop;
  useEffect(() => {
    if (!searchSheet) return;
    const hidden = [document.getElementById("main"), document.querySelector("body > footer, #main ~ footer"), document.querySelector("[data-prototype-badge]")].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && !el.inert,
    );
    hidden.forEach((el) => (el.inert = true));
    return () => hidden.forEach((el) => (el.inert = false));
  }, [searchSheet]);

  /** Focus leaving a trigger and its panel (by keyboard, or by clicking something that is not another trigger) closes it. */
  const onGroupBlur = (e: React.FocusEvent<HTMLElement>) => {
    const to = e.relatedTarget as HTMLElement | null;
    if (!to || e.currentTarget.contains(to)) return;
    if (pointerRef.current && to.closest("[data-nav-trigger]")) return;
    close();
  };
  /** Following a real link closes the layer (inert links show their notice and leave it open). */
  const onPanelClick = (e: React.MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a[href]:not([href='#'])");
    if (a) close(isSamePageLink(a));
  };
  const onTriggerEnter = (id: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const cur = openRef.current;
    if (cur?.kind !== "mega" || cur.id === id) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => openRef.current?.kind === "mega" && setOpen({ kind: "mega", id }), HOVER_SWITCH_MS);
  };
  const onTriggerLeave = () => window.clearTimeout(hoverTimer.current);

  /**
   * The open menu's item, or with no menu open the current section's item, is Bold and underlined and the
   * others dim (as drawn on the open menus). On pages outside a section all five are Medium #374151.
   */
  const activeId = megaId ?? routeId;
  const itemClass = (id: string) =>
    activeId
      ? activeId === id
        ? "font-bold text-body underline"
        : "font-medium text-muted hover:text-ink"
      : "font-medium text-body hover:text-ink";
  const searchOpen = open?.kind === "search";
  const marketOpen = open?.kind === "market";
  const desktopLayer = open?.kind === "mega" || marketOpen || searchOpen;

  return (
    // While a layer is open the header sits above the fixed Prototype badge (z-40), under the inert-link notice (z-60).
    <header className={`relative ${open ? "z-[55]" : "z-40"}`}>
      {desktopLayer && <div aria-hidden="true" onClick={() => close()} className="anim-fade fixed inset-0 hidden bg-black/80 nav:block" />}

      {/* Utility bar (desktop): the market name at the left, three links at the right (Medium 14/20, 24 apart) */}
      <div className="sb-bleed relative z-[2] hidden bg-white shadow-[inset_0_-1px_0_#E5E7EB] nav:block">
        <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-6 px-[67px] text-[14px] font-medium leading-5 text-body">
          <p>{LOCAL_SITE.market}</p>
          <nav aria-label="Quick links">
            <ul className="flex items-center gap-6">
              {LOCAL_UTILITY.map((l) => (
                <li key={l.label}>
                  <SmartLink
                    href={l.href}
                    aria-current={isCurrentChild(l.href, pathname) ? "page" : undefined}
                    className="inline-flex h-10 items-center whitespace-nowrap rounded-btn decoration-1 underline-offset-[3px] hover:text-ink hover:underline"
                  >
                    {l.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className={`sb-bleed relative z-[2] bg-white ${searchOpen ? "shadow-[inset_0_-1px_0_#E5E7EB] nav:shadow-none" : "shadow-[inset_0_-1px_0_#E5E7EB]"}`}>
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-6 md:px-10 nav:px-[67px]">
          <div className="flex items-center gap-5">
            {/* 71.78 wide as drawn, so the section items sit on the Figma x positions */}
            <Link href={LOCAL_SITE.home} aria-label={LOCAL_SITE.homeLabel} className="inline-flex rounded-btn nav:w-[71.78px]">
              <Logo />
            </Link>
            <nav aria-label="Primary" className="hidden nav:block">
              <ul className="flex items-center gap-4">
                {LOCAL_SECTIONS.map((s) => {
                  const isOpen = megaId === s.id;
                  const panelId = `local-panel-${s.id}`;
                  const triggerId = `local-trigger-${s.id}`;
                  return (
                    <li key={s.id} onBlur={onGroupBlur} onClick={onPanelClick}>
                      <button
                        ref={(el) => {
                          triggers.current[`mega:${s.id}`] = el;
                        }}
                        id={triggerId}
                        type="button"
                        data-nav-trigger
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? panelId : undefined}
                        aria-current={routeId === s.id ? "true" : undefined}
                        onClick={() => toggle({ kind: "mega", id: s.id })}
                        onPointerEnter={onTriggerEnter(s.id)}
                        onPointerLeave={onTriggerLeave}
                        // The label's Figma text box width (+ 2 x 4px padding), so the items sit on the drawn x positions
                        style={{ minWidth: s.labelWidth[isOpen ? 1 : 0] + 8 }}
                        className={`inline-flex h-10 items-center whitespace-nowrap rounded-btn px-1 text-[14px] leading-5 decoration-1 underline-offset-[3px] hover:underline ${itemClass(s.id)}`}
                      >
                        {s.label}
                      </button>
                      {isOpen && <LocalMegaMenu section={s} id={panelId} labelledBy={triggerId} animate={animate} onSubmitted={() => close()} />}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Market and search 16 apart, Contact us 32 further on */}
          <div className="flex items-center nav:gap-4">
            <div className="hidden nav:block" onBlur={onGroupBlur} onClick={onPanelClick}>
              <button
                ref={(el) => {
                  triggers.current.market = el;
                }}
                id="local-trigger-market"
                type="button"
                data-nav-trigger
                aria-expanded={marketOpen}
                aria-controls={marketOpen ? "local-panel-market" : undefined}
                onClick={() => toggle({ kind: "market" })}
                className="inline-flex h-10 items-center gap-2.5 whitespace-nowrap rounded-btn px-4 text-[14px] font-medium leading-5 text-body hover:text-ink"
              >
                <span className="sr-only">{NAV_COPY.findMarket}: </span>
                {LOCAL_SITE.market}
                <Icon name="keyboard_arrow_down" className="text-ink" />
              </button>
              {marketOpen && <LocalMarketMenu id="local-panel-market" labelledBy="local-trigger-market" animate={animate} />}
            </div>

            <div onBlur={onGroupBlur} onClick={onPanelClick}>
              <button
                ref={(el) => {
                  triggers.current.search = el;
                }}
                type="button"
                data-nav-trigger
                aria-label="Search"
                aria-expanded={searchOpen}
                aria-controls={searchOpen ? "local-panel-search" : undefined}
                onClick={() => toggle({ kind: "search" })}
                className="relative inline-flex size-11 items-center justify-center rounded-btn nav:h-10 nav:w-[52px]"
              >
                {searchOpen && <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-[33px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9D9D9] nav:hidden" />}
                <Icon name="search" className="relative text-ink" />
              </button>
              {searchOpen && <SearchPanel id="local-panel-search" animate={animate} onClose={() => close(true)} onSubmitted={() => close()} />}
            </div>

            <Link
              href="/contact"
              className="hidden h-10 items-center whitespace-nowrap rounded-btn border border-body bg-body px-4 text-[16px] font-medium leading-5 text-white hover:bg-ink nav:ml-4 nav:inline-flex"
            >
              {NAV_COPY.contact}
            </Link>

            <button
              ref={(el) => {
                triggers.current.menu = el;
              }}
              type="button"
              data-nav-trigger
              aria-label="Open menu"
              aria-expanded={open?.kind === "menu"}
              onClick={() => toggle({ kind: "menu" })}
              className="-mr-1.5 inline-flex h-11 w-9 items-center justify-center rounded-btn nav:hidden"
            >
              <Icon name="dehaze" size={24} opsz={24} className="text-ink" />
            </button>
          </div>
        </div>
      </div>

      {open?.kind === "menu" && (
        <LocalMobileMenu
          current={routeId}
          closeRef={menuCloseRef}
          onClose={() => close(true)}
          onNavigate={(a) => close(isSamePageLink(a))}
          onSearch={() => setOpen({ kind: "search" })}
          onSubmitted={() => close()}
        />
      )}
    </header>
  );
}
