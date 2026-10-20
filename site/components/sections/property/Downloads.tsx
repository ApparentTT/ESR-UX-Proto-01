"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import { ACTION_BUTTON } from "./actionStyles";
import { PANEL_ITEM, usePopover } from "./usePopover";

/**
 * The property's three downloads (Estate brochure, Building brochure, Building floor plan), presentation feedback:
 * they replace the Downloads menu. The files are not part of the prototype, so each is an inert link (the
 * "not part of the prototype" notice). Screen readers hear the file type and the property after each name.
 */

/** Stepped out in the CTA row after "Enquire now": outline buttons (ink border, radius 6) with a download icon; full width and stacked below 768. */
export function DownloadButtons({ files, property }: { files: string[]; property: string }) {
  return (
    <>
      {files.map((f) => (
        <Button key={f} href={null} variant="outlineDark" icon="download" iconLeading className="w-full md:w-auto md:px-5">
          {f}
          <span className="sr-only">
            {" "}
            (PDF), {property}
          </span>
        </Button>
      ))}
    </>
  );
}

/** The sticky bar's compact text-and-icon links (768+, from 1280 where they fit beside the property name). */
export function DownloadLinks({ files, property }: { files: string[]; property: string }) {
  return (
    <>
      {files.map((f) => (
        <SmartLink key={f} href={null} className={ACTION_BUTTON.compact}>
          <Icon name="download" size={18} />
          {f}
          <span className="sr-only"> (PDF), {property}</span>
        </SmartLink>
      ))}
    </>
  );
}

/**
 * "Downloads" in the sticky bar where the three do not fit side by side: an icon button below 768 (or a compact
 * text button, `compact`) that opens a small sheet above or below it, headed "Downloads", listing the three files.
 * Disclosure pattern (usePopover): opening focuses the first file; Escape, a click outside and tabbing away close
 * it, Up / Down / Home / End move between files, and choosing one closes it and returns focus to the button.
 */
export function DownloadsMenu({
  label,
  files,
  property,
  compact = false,
  panelClassName,
}: {
  label: string;
  files: string[];
  property: string;
  compact?: boolean;
  /** Panel position: above the button in the bottom bar, below it in the top bar */
  panelClassName: string;
}) {
  const { open, toggle, close, wrapRef, buttonRef, onPanelKeyDown } = usePopover();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("[data-popover-item]")?.focus();
  }, [open]);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={compact ? ACTION_BUTTON.compact : ACTION_BUTTON.icon}
      >
        <Icon name="download" size={compact ? 18 : 20} />
        <span className={compact ? undefined : "sr-only"}>{label}</span>
        {compact && <Icon name="keyboard_arrow_down" size={18} className={`text-muted transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />}
      </button>
      <div
        ref={panelRef}
        id={panelId}
        role="group"
        aria-labelledby={`${panelId}-h`}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
        className={`anim-pop absolute z-30 w-[min(300px,calc(var(--full-w)-48px))] rounded-control border border-line bg-white p-1.5 shadow-panel ${panelClassName}`}
      >
        <p id={`${panelId}-h`} className="px-3 pb-1 pt-2 text-[12px] font-medium leading-[1.5] text-muted">
          {label}
        </p>
        <ul>
          {files.map((f) => (
            <li key={f}>
              <SmartLink href={null} data-popover-item onClick={() => close(true)} className={PANEL_ITEM}>
                <span className="min-w-0 flex-1">
                  {f}
                  <span className="sr-only"> (PDF), {property}</span>
                </span>
                <span aria-hidden="true" className="text-[12px] text-muted">
                  PDF
                </span>
                <Icon name="download" size={18} />
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
