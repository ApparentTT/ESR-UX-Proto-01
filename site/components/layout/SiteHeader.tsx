"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Container } from "./Container";
import { Icon } from "@/components/ui/Icon";
import { InertLink } from "@/components/ui/InertLink";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { MARKETS, NAV, activeGroup } from "@/config/site";

/** Disclosure menu: click to open, Escape or focus leaving closes it. */
function useDisclosure() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !wrapRef.current?.contains(e.target as Node) && setOpen(false);
    const onFocus = (e: FocusEvent) => !wrapRef.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, wrapRef, buttonRef };
}

/**
 * Whether a nav child is the page being viewed. Links with a query (the News type filters) also need
 * that param to match, so a free-text search does not mark every type; "Property search" covers its results.
 * Only called from menus that render after an interaction, so reading window.location is hydration-safe.
 */
function isCurrentChild(href: string | null, pathname: string) {
  if (!href) return false;
  const [path, query] = href.split("?");
  if (!query) return pathname === path || (path === "/properties" && pathname.startsWith("/properties/"));
  if (pathname !== path || typeof window === "undefined") return false;
  const have = new URLSearchParams(window.location.search);
  return [...new URLSearchParams(query)].every(([k, v]) => have.get(k) === v);
}

/**
 * Top-level nav item: a plain link as in the wireframe (no chevron). The section's pages show in a
 * dropdown on hover or keyboard focus, so the client can reach every page from the header.
 * Escape closes the dropdown and returns focus to the top link without reopening it.
 */
function NavMenu({ group, active, dim }: { group: (typeof NAV)[number]; active: boolean; dim: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Set while Escape hands focus back to the top link, so that focus does not reopen the menu. */
  const suppressFocusOpen = useRef(false);
  const pathname = usePathname();
  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = (delay = 120) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), delay);
  };
  useEffect(() => () => void (closeTimer.current && clearTimeout(closeTimer.current)), []);
  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={() => hide()}
      onFocus={() => {
        if (suppressFocusOpen.current) suppressFocusOpen.current = false;
        else show();
      }}
      onBlur={(e) => !wrapRef.current?.contains(e.relatedTarget as Node) && hide(0)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          if (closeTimer.current) clearTimeout(closeTimer.current);
          setOpen(false);
          const top = wrapRef.current?.querySelector<HTMLElement>("a");
          if (top && document.activeElement !== top) {
            suppressFocusOpen.current = true;
            top.focus();
          }
        }
      }}
    >
      <SmartLink
        href={group.href}
        aria-current={active ? "true" : undefined}
        className={`inline-flex h-10 items-center rounded-btn px-1 text-[14px] leading-5 hover:text-ink hover:underline hover:underline-offset-[6px] ${
          active ? "font-bold text-body underline underline-offset-[6px]" : dim ? "font-medium text-muted" : "font-medium text-body"
        }`}
      >
        {group.label}
      </SmartLink>
      {open && (
        <div className="anim-pop absolute left-0 top-full z-50 w-64 pt-2">
          <ul aria-label={`${group.label} pages`} className="rounded-card border border-line bg-white p-2 shadow-panel">
            {group.children.map((c) => (
              <li key={c.label}>
                <SmartLink
                  href={c.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrentChild(c.href, pathname) ? "page" : undefined}
                  className="focus-inset flex min-h-10 items-center justify-between gap-2 rounded-btn px-3 text-sm hover:bg-surface aria-[current=page]:font-medium"
                >
                  {c.label}
                  {c.external && <Icon name="open_in_new" size={16} className="text-muted" />}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Header search: a panel under the bar; submitting goes to news search.
 * onClose (Escape, the X) hands focus back to the toggle; onSubmitted only closes, as the page changes.
 */
function SearchPanel({ onClose, onSubmitted }: { onClose: () => void; onSubmitted: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="anim-pop absolute inset-x-0 top-full z-40 border-b border-line bg-white shadow-panel">
      <Container className="py-4">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            // An empty search keeps the panel open rather than landing on the wireframe's sample results.
            if (!q.trim()) return inputRef.current?.focus();
            onSubmitted();
            router.push(`/news/search?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center gap-3"
        >
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          <div className="relative flex-1">
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="field h-12 w-full rounded-btn border border-line pl-11 pr-3 text-[15px] placeholder:text-muted focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
            />
          </div>
          <button type="submit" className="inline-flex h-12 items-center rounded-btn bg-ink px-5 text-sm font-medium text-white hover:bg-black">
            Search
          </button>
          <button type="button" onClick={onClose} aria-label="Close search" className="inline-flex size-11 items-center justify-center rounded-btn">
            <Icon name="close" />
          </button>
        </form>
      </Container>
    </div>
  );
}

function MarketMenu() {
  const { open, setOpen, wrapRef, buttonRef } = useDisclosure();
  const id = useId();
  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-1 rounded-btn px-3 text-sm"
      >
        Find your market
        <Icon name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"} />
      </button>
      {open && (
        <div id={id} className="anim-pop absolute right-0 top-full z-50 mt-2 w-60 rounded-card border border-line bg-white p-2 shadow-panel">
          <p className="px-3 pb-1 pt-2 text-xs text-muted">Market sites are not part of this prototype</p>
          <ul>
            {MARKETS.map((m) => (
              <li key={m}>
                <InertLink className="focus-inset flex min-h-10 items-center rounded-btn px-3 text-sm hover:bg-surface">{m}</InertLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // The search toggle that opened the panel (one per breakpoint) and the menu button get focus back on close.
  const searchToggleRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    requestAnimationFrame(() => searchToggleRef.current?.focus());
  }, []);
  const dismissSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);
  const pathname = usePathname();
  const current = activeGroup(pathname);
  const searchButton = (cls: string) => (
    <button
      type="button"
      aria-label="Search"
      aria-expanded={searchOpen}
      onClick={(e) => {
        searchToggleRef.current = e.currentTarget;
        setSearchOpen((o) => !o);
      }}
      className={`inline-flex items-center justify-center rounded-btn ${cls}`}
    >
      <Icon name={searchOpen ? "close" : "search"} />
    </button>
  );

  return (
    // While the menu is open the header (and so its drawer) sits above the fixed Prototype badge (z-40),
    // and still under the inert-link notice (z-60).
    <header className={`relative bg-white shadow-[inset_0_-1px_0_#E5E7EB] ${menuOpen ? "z-[55]" : "z-40"}`}>
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="ESR home" className="rounded-btn">
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-4 whitespace-nowrap min-[1180px]:flex xl:gap-5">
            {NAV.map((g) => (
              <NavMenu key={g.label} group={g} active={current === g.label} dim={!!current && current !== g.label} />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 whitespace-nowrap min-[1180px]:flex xl:gap-4">
          <MarketMenu />
          {searchButton("h-10 w-[52px]")}
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className="inline-flex h-10 items-center rounded-btn border border-body bg-body px-4 text-[16px] font-medium leading-5 text-white hover:bg-ink"
          >
            Contact us
          </Link>
        </div>

        <div className="flex items-center gap-1 min-[1180px]:hidden">
          {searchButton("size-11")}
          <Link href="/contact" className="mr-1 hidden h-10 items-center rounded-btn bg-body px-4 text-[15px] font-medium text-white md:inline-flex">
            Contact us
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-btn"
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </Container>

      {searchOpen && <SearchPanel onClose={closeSearch} onSubmitted={dismissSearch} />}
      {menuOpen && <MobileMenu current={current} pathname={pathname} onClose={closeMenu} />}
    </header>
  );
}

function MobileMenu({ current, pathname, onClose }: { current: string | null; pathname: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** aria-modal: Tab and Shift+Tab wrap inside the drawer instead of reaching the page behind the scrim. */
  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), summary, [tabindex]:not([tabindex='-1'])") ?? [],
    ).filter((el) => el.getClientRects().length > 0);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !panelRef.current?.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 min-[1180px]:hidden" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trapTab}>
      <div className="anim-fade absolute inset-0 bg-scrim" onClick={onClose} />
      <div ref={panelRef} className="anim-fade absolute inset-y-0 right-0 flex w-[min(360px,90vw)] flex-col bg-white">
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-6">
          <span className="font-semibold">Menu</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="inline-flex size-11 items-center justify-center rounded-btn">
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-2">
          {NAV.map((g) => (
            <details key={g.label} className="group border-b border-line" open={current === g.label}>
              <summary className="focus-inset flex min-h-14 cursor-pointer list-none items-center justify-between text-base font-medium [&::-webkit-details-marker]:hidden">
                {g.label}
                <Icon name="keyboard_arrow_down" size={24} className="transition-transform group-open:rotate-180" />
              </summary>
              <ul className="pb-3">
                {g.children.map((c) => (
                  <li key={c.label}>
                    <SmartLink
                      href={c.href}
                      onClick={onClose}
                      aria-current={isCurrentChild(c.href, pathname) ? "page" : undefined}
                      className="flex min-h-11 items-center gap-2 text-[15px] text-muted hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
                    >
                      {c.label}
                      {c.external && <Icon name="open_in_new" size={16} />}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <details className="group border-b border-line">
            <summary className="focus-inset flex min-h-14 cursor-pointer list-none items-center justify-between text-base font-medium [&::-webkit-details-marker]:hidden">
              Find your market
              <Icon name="keyboard_arrow_down" size={24} className="transition-transform group-open:rotate-180" />
            </summary>
            <ul className="pb-3">
              {MARKETS.map((m) => (
                <li key={m}>
                  <InertLink className="flex min-h-11 items-center text-[15px] text-muted">{m}</InertLink>
                </li>
              ))}
            </ul>
          </details>
          <Link href="/contact" onClick={onClose} className="mt-6 flex h-12 items-center justify-center rounded-btn bg-ink text-sm font-medium text-white">
            Contact us
          </Link>
        </nav>
      </div>
    </div>
  );
}
