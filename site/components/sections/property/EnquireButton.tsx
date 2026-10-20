"use client";

import { Button } from "@/components/ui/Button";
import { goToEnquiry } from "./enquire";

/** Id of the drawn "Enquire now" button: the sticky bar shows once it scrolls away */
export const ENQUIRE_BUTTON_ID = "property-enquire-button";

/**
 * "Enquire now" (1507:52149), first in the CTA row before the three downloads: the dark button (ink, radius 6,
 * Medium 15, full width at 390). The
 * canvas arrow takes it to the enquiry module: it scrolls there and focuses the first field.
 */
export function EnquireButton({ label }: { label: string }) {
  return (
    <Button id={ENQUIRE_BUTTON_ID} variant="dark" onClick={() => goToEnquiry()} className="w-full md:w-auto md:px-[26px]">
      {label}
    </Button>
  );
}
