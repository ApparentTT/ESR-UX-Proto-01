"use client";

import { Icon } from "@/components/ui/Icon";
import { ACTION_BUTTON, type ActionVariant } from "./actionStyles";

/**
 * "Save as PDF" (presentation feedback, beside Share; picture_as_pdf icon, the same outline style). Opens the
 * browser's print dialog, where the visitor can save the page as a PDF. The print stylesheet in app/globals.css
 * (the "Print" block) hides the header, footer, Prototype badge, sticky bar, menus, gallery, carousel controls
 * and enquiry form, opens the accordions and prints one readable column.
 */
export function SavePdfButton({ label, variant = "outline" }: { label: string; variant?: ActionVariant }) {
  return (
    <button type="button" onClick={() => window.print()} className={ACTION_BUTTON[variant]}>
      <Icon name="picture_as_pdf" size={variant === "icon" ? 20 : 18} />
      <span className={variant === "icon" ? "sr-only" : undefined}>{label}</span>
    </button>
  );
}
