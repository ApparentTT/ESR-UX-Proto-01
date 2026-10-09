"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
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

function NavMenu({ group, active }: { group: (typeof NAV)[number]; active: boolean }) {
  const { open, setOpen, wrapRef, buttonRef } = useDisclosure();
  const id = useId();
  const pathname = usePathname();
  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-10 items-center gap-0.5 rounded-btn px-1 text-sm ${active ? "font-medium text-ink underline underline-offset-[6px]" : "text-muted hover:text-ink"}`}
      >
        {group.label}
        <Icon name={open ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={18} />
      </button>
      {open && (
        <div id={id} className="anim-pop absolute left-0 top-full z-50 mt-2 w-64 rounded-card border border-line bg-white p-2 shadow-panel">
          <ul>
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
  const pathname = usePathname();
  const current = activeGroup(pathname);

  return (
    <header className="relative z-40 border-b border-line bg-white">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-7">
          <Link href="/" aria-label="ESR home" className="rounded-btn">
            <Logo />
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex">
            {NAV.map((g) => (
              <NavMenu key={g.label} group={g} active={current === g.label} />
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <MarketMenu />
          <InertLink aria-label="Search the site" className="inline-flex size-10 items-center justify-center rounded-btn">
            <Icon name="search" />
          </InertLink>
          <Link href="/contact" className="inline-flex h-10 items-center rounded-btn bg-ink px-4 text-sm font-medium text-white hover:bg-black">
            Contact us
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <InertLink aria-label="Search the site" className="inline-flex size-11 items-center justify-center rounded-btn">
            <Icon name="search" />
          </InertLink>
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
