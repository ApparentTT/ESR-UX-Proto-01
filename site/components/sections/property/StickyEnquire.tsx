"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ENQUIRY_ID, goToEnquiry } from "./enquire";
import { ENQUIRE_BUTTON_ID } from "./EnquireButton";

const BAR_H = 64;

/**
 * Sticky "Enquire now" (not drawn, added at the client's request). Shown only while the drawn "Enquire about this
 * property" button has scrolled up out of view and the enquiry form is still below the viewport, so it never sits
 * over the form or the end of the page (the footer). 768+: a slim white bar fixed to the top of the window (the
 * header is not sticky) with the property name and a dark "Enquire now" button; while it shows, the page's
 * scroll-padding-top keeps focused content clear of it. 390: a white bar fixed to the bottom with the button on the
 * left, clear of the Prototype badge on the right, padded for the safe-area inset. The button scrolls to the form
 * and focuses its first field. It is a normal control in the tab order (after the hero); nothing is trapped.
 */
export function StickyEnquire({ name, label }: { name: string; label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const btn = document.getElementById(ENQUIRE_BUTTON_ID);
        const form = document.getElementById(ENQUIRY_ID);
        if (!btn || !form) return;
        const passed = btn.getBoundingClientRect().bottom < 0;
        const formBelow = form.getBoundingClientRect().top > window.innerHeight - 24;
        setShow(passed && formBelow);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Keep keyboard-focused content clear of the top bar (768+) while it shows
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => (root.style.scrollPaddingTop = show && mq.matches ? `${BAR_H + 16}px` : "");
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      root.style.scrollPaddingTop = "";
    };
  }, [show]);

  return (
    <div
      hidden={!show}
      data-print-hide
      className="anim-fade fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgb(17_24_38/0.08)] md:bottom-auto md:top-0 md:border-b md:border-t-0 md:pb-0 md:shadow-[0_4px_16px_rgb(17_24_38/0.08)]"
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[148px] md:h-16 md:px-10 lg:px-20">
        <p className="hidden min-w-0 flex-1 truncate text-[16px] font-medium tracking-[-0.02em] text-ink md:block">{name}</p>
        <button
          type="button"
          onClick={() => goToEnquiry()}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-btn bg-ink px-6 text-[15px] font-medium leading-[1.45] text-white transition-colors hover:bg-black md:h-10 md:flex-none"
        >
          <Icon name="mail" size={18} />
          {label}
          <span className="sr-only">: {name}</span>
        </button>
      </div>
    </div>
  );
}
