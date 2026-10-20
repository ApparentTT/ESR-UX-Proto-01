import type { Property } from "@/data/types";

/**
 * Where a search result goes. This standalone search prototype has no property detail or contact pages, so every
 * link is inert (null): linked cards still look and behave clickable, but do not navigate. The full-site copy
 * (site/lib/propertyLinks.ts) returns the Japan property detail pages.
 */
export function propertyHref(p: Property): string | null {
  void p;
  return null;
}

export function enquireHref(p: Property): string | null {
  void p;
  return null;
}
