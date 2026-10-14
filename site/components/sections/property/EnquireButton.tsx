"use client";

import { goToEnquiry } from "./enquire";

/** Id of the drawn "Enquire about this property" button: the sticky "Enquire now" bar shows once it scrolls away */
export const ENQUIRE_BUTTON_ID = "property-enquire-button";

/**
 * The drawn grey "Enquire about this property" button (1138:10699): #D4D4D4, radius 6, 58px tall, 264px wide
 * (full width at 390), Medium 14 black. The drawn annotation asks whether it opens a drawer or anchors to the form:
 * it anchors to the enquiry form at the bottom of the page and focuses its first field.
 */
export function EnquireButton({ label }: { label: string }) {
  return (
    <button
      id={ENQUIRE_BUTTON_ID}
      type="button"
      onClick={() => goToEnquiry()}
      data-print-hide
      className="inline-flex h-[58px] w-full items-center justify-center rounded-btn bg-[#d4d4d4] px-5 py-3 text-[14px] font-medium leading-[1.45] text-black transition-colors hover:bg-[#c4c4c4] md:w-[264px]"
    >
      {label}
    </button>
  );
}
