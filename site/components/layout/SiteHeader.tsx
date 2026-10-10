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
 * Top-level nav item: a plain link as in the wireframe (no chevron). The section's pages show in a
 * dropdown on hover or keyboard focus, so the client can reach every page from the header.
 */
function NavMenu({ group, active, dim }: { group: (typeof NAV)[number]; active: boolean; dim: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
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
      onFocus={show}
      onBlur={(e) => !wrapRef.current?.contains(e.relatedTarget as Node) && hide(0)}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          wrapRef.current?.querySelector<HTMLElement>("a")?.focus();
        }
      }}
    >
      <SmartLink
        href={group.href}
        aria-current={active ? "true" : undefined}
        aria-describedby={open ? id : undefined}
        className={`inline-flex h-10 items-center rounded-btn px-1 text-[14px] leading-5 hover:text-ink hover:underline hover:underline-offset-[6px] ${
          active ? "font-bold text-body underline underline-offset-[6px]" : dim ? "font-medium text-muted" : "font-medium text-body"
        }`}
      >
        {group.label}
      </SmartLink>
      {open && (
        <div id={id} className="anim-pop absolute left-0 top-full z-50 w-64 pt-2">
          <ul aria-label={`${group.label} pages`} className="rounded-card border border-line bg-white p-2 shadow-panel">
            {group.children.map((c) => (
              <li key={c.label}>
                <SmartLink
                  href={c.href}
                  onClick={() => setOpen(false)}
                  aria-current={c.href && pathname === c.href.split("?")[0] ? "page" : undefined}
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

/** Header search: a panel under the bar; submitting goes to news search. */
function SearchPanel({ onClose }: { onClose: () => void }) {
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
            onClose();
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
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const pathname = usePathname();
  const current = activeGroup(pathname);
  const searchButton = (cls: string) => (
    <button type="button" aria-label="Search" aria-expanded={searchOpen} onClick={() => setSearchOpen((o) => !o)} className={`inline-flex items-center justify-center rounded-btn ${cls}`}>
      <Icon name={searchOpen ? "close" : "search"} />
    </button>
  );

  return (
    <header className="relative z-40 bg-white shadow-[inset_0_-1px_0_#E5E7EB]">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="ESR home" className="rounded-btn">
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex xl:gap-5">
            {NAV.map((g) => (
              <NavMenu key={g.label} group={g} active={current === g.label} dim={!!current && current !== g.label} />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex xl:gap-4">
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

        <div className="flex items-center gap-1 lg:hidden">
          {searchButton("size-11")}
          <Link href="/contact" className="mr-1 hidden h-10 items-center rounded-btn bg-body px-4 text-[15px] font-medium text-white md:inline-flex">
            Contact us
          </Link>
          <button
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

      {searchOpen && <SearchPanel onClose={closeSearch} />}
      {menuOpen && <MobileMenu current={current} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

function MobileMenu({ current, onClose }: { current: string | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
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
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="anim-fade absolute inset-0 bg-scrim" onClick={onClose} />
      <div className="anim-fade absolute inset-y-0 right-0 flex w-[min(360px,90vw)] flex-col bg-white">
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
                    <SmartLink href={c.href} onClick={onClose} className="flex min-h-11 items-center gap-2 text-[15px] text-muted hover:text-ink">
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
