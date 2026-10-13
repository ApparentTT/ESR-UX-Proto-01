"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { NAV_COPY, NAV_SECTIONS } from "@/config/nav";
import { activeGroup } from "@/config/site";
import { MarketMenu } from "./MarketMenu";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchPanel } from "./SearchPanel";
import { DESKTOP_QUERY, useScrollLock } from "./parts";

/** One header layer open at a time: a section mega menu, the market selector, search, or the mobile menu. */
type Open = { kind: "mega"; id: string } | { kind: "market" } | { kind: "search" } | { kind: "menu" } | null;
const keyOf = (o: NonNullable<Open>) => (o.kind === "mega" ? `mega:${o.id}` : o.kind);

/** Opens another mega menu when the pointer rests on its item while one is already open. */
const HOVER_SWITCH_MS = 120;

/**
 * Global navigation (Figma "Global Navigation" 672:25100).
 * Desktop (from 1180): logo, the five section items, Find your market, search and Contact us in a
 * 72px bar. Each section item is a disclosure button that opens its full-width mega menu over a
 * black/80 overlay; Find your market and search open their own panels the same way.
 * Below 1180: logo, search and menu; search is a full-screen sheet, the menu a modal dialog.
 *
 * Escape closes the open layer and returns focus to its trigger. Clicking the overlay, a link, another
 * trigger, a route change, or tabbing away from the trigger and its panel also close it.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const current = activeGroup(pathname);
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
      if (focusTrigger) requestAnimationFrame(() => triggers.current[keyOf(cur)]?.focus());
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    // The desktop and mobile layers never survive a resize across the breakpoint.
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onBreakpoint = () => close();
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  useScrollLock(open !== null);

  /** Focus leaving a trigger and its panel (by keyboard, or by clicking something that is not another trigger) closes it. */
  const onGroupBlur = (e: React.FocusEvent<HTMLElement>) => {
    const to = e.relatedTarget as HTMLElement | null;
    if (!to || e.currentTarget.contains(to)) return;
    if (pointerRef.current && to.closest("[data-nav-trigger]")) return;
    close();
  };
  /** Following a real link closes the layer (inert links show their notice and leave it open). */
  const onPanelClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest("a[href]:not([href='#'])")) close();
  };
  const onTriggerEnter = (id: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const cur = openRef.current;
    if (cur?.kind !== "mega" || cur.id === id) return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => openRef.current?.kind === "mega" && setOpen({ kind: "mega", id }), HOVER_SWITCH_MS);
  };
  const onTriggerLeave = () => window.clearTimeout(hoverTimer.current);

  const megaId = open?.kind === "mega" ? open.id : null;
  const routeId = NAV_SECTIONS.find((s) => s.label === current)?.id ?? null;
  /** The open menu's item, else the current section's item, is Bold and underlined; the others dim. */
  const highlight = megaId ?? routeId;
  const searchOpen = open?.kind === "search";
  const desktopLayer = open?.kind === "mega" || open?.kind === "market" || searchOpen;

  return (
    // While a layer is open the header sits above the fixed Prototype badge (z-40), under the inert-link notice (z-60).
    <header className={`relative ${open ? "z-[55]" : "z-40"}`}>
      {desktopLayer && <div aria-hidden="true" onClick={() => close()} className="anim-fade fixed inset-0 hidden bg-black/80 nav:block" />}

      <div className={`relative z-[2] bg-white ${searchOpen ? "shadow-[inset_0_-1px_0_#E5E7EB] nav:shadow-none" : "shadow-[inset_0_-1px_0_#E5E7EB]"}`}>
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-6 md:px-10 nav:px-[67px]">
          <div className="flex items-center gap-5">
            <Link href="/" aria-label="ESR home" className="rounded-btn">
              <Logo />
            </Link>
            <nav aria-label="Primary" className="hidden nav:block">
              <ul className="flex items-center gap-4">
                {NAV_SECTIONS.map((s) => {
                  const isOpen = megaId === s.id;
                  const panelId = `nav-panel-${s.id}`;
                  return (
                    <li key={s.id} onBlur={onGroupBlur} onClick={onPanelClick}>
                      <button
                        ref={(el) => {
                          triggers.current[`mega:${s.id}`] = el;
                        }}
                        type="button"
                        data-nav-trigger
                        aria-expanded={isOpen}
                        aria-controls={isOpen ? panelId : undefined}
                        aria-current={routeId === s.id ? "true" : undefined}
                        onClick={() => toggle({ kind: "mega", id: s.id })}
                        onPointerEnter={onTriggerEnter(s.id)}
                        onPointerLeave={onTriggerLeave}
                        className={`inline-flex h-10 items-center whitespace-nowrap rounded-btn px-1 text-[14px] leading-5 decoration-1 underline-offset-[3px] hover:underline ${
                          highlight === s.id ? "font-bold text-body underline" : highlight ? "font-medium text-muted hover:text-ink" : "font-medium text-body hover:text-ink"
                        }`}
                      >
                        {s.label}
                      </button>
                      {isOpen && <MegaMenu section={s} id={panelId} animate={animate} />}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center nav:gap-4">
            <div className="hidden nav:block" onBlur={onGroupBlur} onClick={onPanelClick}>
              <button
                ref={(el) => {
                  triggers.current.market = el;
                }}
                type="button"
                data-nav-trigger
                aria-expanded={open?.kind === "market"}
                aria-controls={open?.kind === "market" ? "nav-panel-market" : undefined}
                onClick={() => toggle({ kind: "market" })}
                className="inline-flex h-10 items-center gap-2.5 whitespace-nowrap rounded-btn px-4 text-[14px] font-medium leading-5 text-body hover:text-ink"
              >
                {NAV_COPY.findMarket}
                <Icon name="keyboard_arrow_down" className="text-ink" />
              </button>
              {open?.kind === "market" && <MarketMenu id="nav-panel-market" animate={animate} />}
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
                aria-controls={searchOpen ? "nav-panel-search" : undefined}
                onClick={() => toggle({ kind: "search" })}
                className="relative inline-flex size-11 items-center justify-center rounded-btn nav:h-10 nav:w-[52px]"
              >
                {searchOpen && <span aria-hidden="true" className="absolute left-1/2 top-1/2 size-[33px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9D9D9] nav:hidden" />}
                <Icon name="search" className="relative text-ink" />
              </button>
              {searchOpen && <SearchPanel id="nav-panel-search" animate={animate} onClose={() => close(true)} onSubmitted={() => close()} />}
            </div>

            <Link
              href="/contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              className="hidden h-10 items-center whitespace-nowrap rounded-btn border border-body bg-body px-4 text-[16px] font-medium leading-5 text-white hover:bg-ink nav:inline-flex"
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
              <Icon name="menu" size={24} className="text-ink" />
            </button>
          </div>
        </div>
      </div>

      {open?.kind === "menu" && <MobileMenu current={current} closeRef={menuCloseRef} onClose={() => close(true)} onNavigate={() => close()} onSearch={() => setOpen({ kind: "search" })} />}
    </header>
  );
}
