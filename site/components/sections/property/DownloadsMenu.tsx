"use client";

import { useEffect, useId, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import type { DownloadGroup } from "@/data/site/local/property-detail";
import { usePopover } from "./usePopover";

const ROW = "focus-inset flex w-full items-center gap-3 px-[18px] text-left text-ink hover:bg-surface";

/**
 * Downloads (button 1507:52145, menu 1507:59421): the outline button (ink border, radius 6, Medium 15, download
 * icon and a muted arrow; full width at 390) opens a 400px menu (white, line border, radius 10, soft shadow):
 * "Brochures" and "Floor plans" groups (Medium 12 muted labels) of files (Regular 15 name over "PDF · [X] MB"
 * in muted 12, download icon right), a rule between groups and "Download all as a zip" (Medium 14, folder_zip)
 * at the bottom. The files are not part of the prototype: each is an inert link (the "not part of the prototype"
 * notice). Choosing one closes the menu and returns focus to the button; Escape, a click outside and tabbing
 * away close it; Up / Down / Home / End move between items.
 */
export function DownloadsMenu({ label, groups, all, property }: { label: string; groups: DownloadGroup[]; all: string; property: string }) {
  const { open, toggle, close, wrapRef, buttonRef, onPanelKeyDown } = usePopover();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("[data-popover-item]")?.focus();
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full md:w-auto">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-btn border border-ink bg-white py-3.5 pl-[22px] pr-[18px] text-[15px] font-medium leading-[1.5] text-ink transition-colors hover:bg-surface md:w-auto md:pl-[26px] md:pr-5"
      >
        <Icon name="download" size={18} />
        {label}
        <span className="sr-only">: brochures and floor plans</span>
        <Icon name="keyboard_arrow_down" size={18} className={`text-muted transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
        className="anim-pop absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-[10px] border border-line bg-white py-2 shadow-[0_8px_24px_rgb(0_0_0/0.14)] md:right-auto md:w-[400px]"
      >
        {groups.map((g, gi) => (
          <div key={g.label} className={gi > 0 ? "border-t border-line" : ""}>
            <p id={`${panelId}-g${gi}`} className="px-[18px] pb-1.5 pt-3 text-[12px] font-medium leading-[1.5] text-muted">
              {g.label}
            </p>
            <ul aria-labelledby={`${panelId}-g${gi}`}>
              {g.files.map((f) => (
                <li key={f.label}>
                  <SmartLink
                    href={null}
                    data-popover-item
                    aria-label={`${f.label}, ${f.meta.replace(" · ", ", ")}, ${property}`}
                    onClick={() => close(true)}
                    className={`${ROW} py-[11px]`}
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[1.5]">
                      <span className="text-[15px]">{f.label}</span>
                      <span className="text-[12px] text-muted">{f.meta}</span>
                    </span>
                    <Icon name="download" size={18} />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="border-t border-line">
          <SmartLink href={null} data-popover-item onClick={() => close(true)} className={`${ROW} gap-2.5 pb-2.5 pt-3`}>
            <span className="min-w-0 flex-1 text-[14px] font-medium leading-[1.5]">{all}</span>
            <Icon name="folder_zip" size={18} />
          </SmartLink>
        </div>
      </div>
    </div>
  );
}
