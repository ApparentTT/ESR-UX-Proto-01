"use client";

import { useEffect, useId, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import type { DownloadFile } from "@/data/site/local/property-detail";
import { OUTLINE_BTN, PANEL, PANEL_ITEM, usePopover } from "./usePopover";

/**
 * Downloads (replaces the drawn "Download brochure" and "Download floorplan" buttons, 1138:10706): one outline
 * button in the drawn style opening a disclosure list of the brochure and several floor plan types, each with its
 * format and indicative size. The files are not part of the prototype: each is an inert link (the "not part of the
 * prototype" notice), and choosing one closes the list and returns focus to the button. Full width at 390.
 */
export function DownloadsMenu({ label, files, property }: { label: string; files: DownloadFile[]; property: string }) {
  const { open, toggle, close, wrapRef, buttonRef, onPanelKeyDown } = usePopover();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("[data-popover-item]")?.focus();
  }, [open]);

  return (
    <div ref={wrapRef} className="relative w-full md:w-auto" data-print-hide>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={`${OUTLINE_BTN} w-full md:w-auto`}
      >
        <Icon name="download" size={18} />
        {label}
        <span className="sr-only">: brochure and floor plans</span>
        <Icon name="keyboard_arrow_down" size={18} className={`text-muted transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
      </button>
      <div ref={panelRef} id={panelId} hidden={!open} onKeyDown={onPanelKeyDown} className={`${PANEL} left-0 right-0 w-auto md:right-auto md:w-[340px]`}>
        <ul aria-label={`${label} for ${property}`}>
          {files.map((f) => (
            <li key={f.label}>
              <SmartLink
                href={null}
                data-popover-item
                aria-label={`${f.label}, ${f.format}, ${f.size}`}
                onClick={() => close(true)}
                className={PANEL_ITEM}
              >
                <Icon name={f.icon} size={20} className="text-muted" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-medium">{f.label}</span>
                  <span className="text-[13px] leading-[1.45] text-muted">
                    {f.format} · {f.size}
                  </span>
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
