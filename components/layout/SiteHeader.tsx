"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "./Container";
import { Icon } from "@/components/ui/Icon";
import { InertLink } from "@/components/ui/InertLink";
import { Logo } from "@/components/ui/Logo";
import { MARKET } from "@/config/market";

const UTILITY_LINKS = ["Tenant portal login", "Find jobs"];
const PRIMARY_LINKS = ["Investors", "Sustainability", "News and insights", "About"];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-line bg-white">
      {/* Utility bar — desktop only */}
      <div className="hidden border-b border-line lg:block">
        <Container className="flex h-10 items-center justify-between text-[13px]">
          <span>{MARKET.name}</span>
          <nav aria-label="Utility" className="flex items-center gap-6">
            <Link href="/properties" className="hover:underline">
              Find properties
            </Link>
            {UTILITY_LINKS.map((l) => (
              <InertLink key={l} className="hover:underline">
                {l}
              </InertLink>
            ))}
          </nav>
        </Container>
      </div>

      <Container className="flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <InertLink aria-label="ESR home" className="rounded-btn">
            <Logo />
          </InertLink>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm lg:flex">
            <Link href="/properties" aria-current="page" className="font-medium underline underline-offset-4">
              Our portfolio
            </Link>
            {PRIMARY_LINKS.map((l) => (
              <InertLink key={l} className="text-muted hover:text-ink">
                {l}
              </InertLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <InertLink className="inline-flex h-10 items-center gap-2 rounded-btn px-3 text-sm" aria-label={`Market: ${MARKET.name}`}>
            {MARKET.name}
            <Icon name="keyboard_arrow_down" />
          </InertLink>
          <InertLink aria-label="Search the site" className="inline-flex size-10 items-center justify-center rounded-btn">
            <Icon name="search" />
          </InertLink>
          <InertLink className="inline-flex h-10 items-center rounded-btn bg-ink px-4 text-sm font-medium text-white">
            Contact us
          </InertLink>
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

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
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
      <div className="anim-fade absolute inset-y-0 right-0 flex w-[min(320px,85vw)] flex-col bg-white">
        <div className="flex h-[72px] items-center justify-between border-b border-line px-6">
          <span className="font-semibold">Menu</span>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="inline-flex size-11 items-center justify-center rounded-btn">
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex flex-col px-6 py-4 text-base">
          <Link href="/properties" onClick={onClose} className="border-b border-line py-4 font-medium">
            Our portfolio
          </Link>
          {PRIMARY_LINKS.map((l) => (
            <InertLink key={l} className="border-b border-line py-4 text-muted">
              {l}
            </InertLink>
          ))}
          {UTILITY_LINKS.map((l) => (
            <InertLink key={l} className="py-3 text-sm text-muted">
              {l}
            </InertLink>
          ))}
          <InertLink className="mt-4 inline-flex h-11 items-center justify-center rounded-btn bg-ink px-4 text-sm font-medium text-white">
            Contact us
          </InertLink>
        </nav>
      </div>
    </div>
  );
}
