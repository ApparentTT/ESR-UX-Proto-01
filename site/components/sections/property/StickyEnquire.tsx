"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { goToEnquiry } from "./enquire";
import { ENQUIRE_BUTTON_ID } from "./EnquireButton";
import { DownloadLinks, DownloadsMenu } from "./Downloads";
import { SavePdfButton } from "./SavePdfButton";
import { ShareMenu, type ShareCopy } from "./ShareMenu";

export type StickyBarCopy = { cta: string; savePdf: string; downloads: { label: string; files: string[] }; share: ShareCopy };

const ENQUIRE = "inline-flex shrink-0 items-center justify-center gap-2 rounded-btn bg-ink px-6 text-[15px] font-medium leading-[1.45] text-white transition-colors hover:bg-black";

/**
 * Sticky property bar (not drawn, added at the client's request; actions per the presentation feedback). It
 * appears once the drawn "Enquire now" button has scrolled up out of view and then stays all the way down the
 * page, over the map, the enquiry form, related properties and the footer.
 * - 768+: a slim white bar fixed to the top of the window (the header is not sticky): the property name, then
 *   Share, Save as PDF, the three downloads (from 1280; a compact "Downloads" menu below that, where they would
 *   crowd the name) and a dark "Enquire now".
 * - Below 768: a white bar fixed to the bottom, padded for the safe-area insets: "Enquire now" and icon buttons for
 *   Share, Save as PDF and Downloads (a small sheet with the three files).
 * While it shows, html[data-sticky-bar] (styles in app/globals.css) sets scroll-padding so focused content stays
 * clear of it, pads the page end below 768 so the footer can scroll clear, and lifts the Prototype badge above it.
 * z-[41]: above the Prototype badge (z-40), so the bar's menus open over it; under the nav layers and notices.
 * "Enquire now" scrolls to the form and focuses its first field. The bar's controls sit in the normal tab order.
 */
export function StickyEnquire({ name, shareText, copy }: { name: string; shareText: string; copy: StickyBarCopy }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const btn = document.getElementById(ENQUIRE_BUTTON_ID);
        if (btn) setShow(btn.getBoundingClientRect().bottom < 0);
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

  useEffect(() => {
    const root = document.documentElement;
    if (show) root.dataset.stickyBar = "";
    else delete root.dataset.stickyBar;
    return () => {
      delete root.dataset.stickyBar;
    };
  }, [show]);

  const shareTitle = `${name} | ESR Japan`;
  const enquire = (className: string) => (
    <button type="button" onClick={() => goToEnquiry()} className={`${ENQUIRE} ${className}`}>
      <Icon name="mail" size={18} />
      {copy.cta}
      <span className="sr-only">: {name}</span>
    </button>
  );

  return (
    <div
      hidden={!show}
      data-print="hide"
      className="anim-fade fixed inset-x-0 bottom-0 z-[41] border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgb(17_24_38/0.08)] md:bottom-auto md:top-0 md:border-b md:border-t-0 md:pb-0 md:shadow-[0_4px_16px_rgb(17_24_38/0.08)]"
    >
      {/* Below 768 */}
      <div
        role="group"
        aria-label={name}
        className="flex h-[72px] items-center gap-2 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] md:hidden"
      >
        {enquire("h-12 min-w-0 flex-1")}
        <ShareMenu title={shareTitle} text={shareText} copy={copy.share} variant="icon" panelClassName="bottom-full right-0 mb-3" />
        <SavePdfButton label={copy.savePdf} variant="icon" />
        <DownloadsMenu label={copy.downloads.label} files={copy.downloads.files} property={name} panelClassName="bottom-full right-0 mb-3" />
      </div>

      {/* 768+ */}
      <div className="mx-auto hidden h-16 max-w-(--page-max) items-center gap-1 px-10 md:flex lg:px-20">
        <p className="mr-3 min-w-0 flex-1 truncate text-[16px] font-medium tracking-[-0.02em] text-ink">{name}</p>
        <ShareMenu title={shareTitle} text={shareText} copy={copy.share} variant="compact" panelClassName="right-0" />
        <SavePdfButton label={copy.savePdf} variant="compact" />
        <div className="xl:hidden">
          <DownloadsMenu label={copy.downloads.label} files={copy.downloads.files} property={name} compact panelClassName="right-0 mt-2" />
        </div>
        <div className="hidden items-center gap-1 xl:flex">
          <DownloadLinks files={copy.downloads.files} property={name} />
        </div>
        {enquire("ml-2 h-10")}
      </div>
    </div>
  );
}
