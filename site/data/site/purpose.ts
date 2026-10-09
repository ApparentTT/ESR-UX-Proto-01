/**
 * ABOUT §4 "Our purpose" (inventory B23), verbatim.
 * Only card 3 has a built destination; cards 1 and 2 are inert.
 */
import type { OutlineTextCardItem } from "@/components/sections/infocards/OutlineTextCard";

export const ABOUT_PURPOSE_HEADING = "Our purpose";

export const ABOUT_PURPOSE: OutlineTextCardItem[] = [
  { title: "Space and investment solutions for a sustainable future", linkLabel: "Learn more", href: null },
  { title: "Growth through our harmonious values", linkLabel: "Learn more", href: null },
  { title: "Our people define and power our success", linkLabel: "Learn more", href: "/about/our-people" },
];
