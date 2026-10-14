"use client";

import { Icon } from "@/components/ui/Icon";
import { ShareMenu } from "./ShareMenu";
import { OUTLINE_BTN } from "./usePopover";

type ShareCopy = { share: string; copy: string; copied: string; email: string; linkedin: string; x: string; line: string };

/**
 * Page actions under the title (not drawn, added at the client's request): Share (ShareMenu) and "Export page as
 * PDF", which opens the browser's print dialog (save as PDF there); the print stylesheet in app/globals.css
 * ("Property detail print") lays the page out for paper. Both hidden in print.
 */
export function PropertyActions({ name, address, share, exportLabel }: { name: string; address: string; share: ShareCopy; exportLabel: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3" data-print-hide>
      <ShareMenu title={`${name} | ESR Japan`} text={`${name}, ${address}`} copy={share} />
      <button type="button" onClick={() => window.print()} className={`${OUTLINE_BTN} min-h-10 px-4 py-2`}>
        <Icon name="picture_as_pdf" size={18} />
        {exportLabel}
      </button>
    </div>
  );
}
