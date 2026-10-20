import type { Property } from "@/data/types";
import { JP_DRAWN_PROPERTY, JP_PROPERTIES } from "@/data/site/local/property-detail";
import { ENQUIRY_ID } from "@/components/sections/property/enquire";

const PROPERTIES_PAGE = "/jp/properties";

/**
 * Where a search result goes. Linked listings open their Japan property detail page (every repeated name has
 * one; anything else falls back to the drawn page). Summary listings have no detail page: Enquire goes to Contact.
 * null means "not part of the prototype" (the standalone search app at the repository root has no detail pages).
 */
export function propertyHref(p: Property): string | null {
  if (p.listing !== "linked") return null;
  const jp = JP_PROPERTIES.find((x) => x.name === p.name) ?? JP_DRAWN_PROPERTY;
  return `${PROPERTIES_PAGE}/${jp.slug}`;
}

export function enquireHref(p: Property): string | null {
  const href = propertyHref(p);
  return href ? `${href}#${ENQUIRY_ID}` : "/contact";
}
