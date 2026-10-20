import type { Property } from "@/data/types";
import { PREFECTURE_BY_ID } from "@/data/locations";
import { PROPERTY_TYPES } from "@/data/types";
import { fmt } from "./filters";

export const locationText = (p: Property) => `${p.city}, ${PREFECTURE_BY_ID[p.prefecture].name}`;
export const typeText = (p: Property) => PROPERTY_TYPES.find((t) => t.id === p.type)!.label;

/** Card size: "12,750 sqm", or "4,000 – 31,000 sqm" for multi-unit listings */
export function sizeText(p: Property) {
  return p.sizeRangeSqm ? `${fmt(p.sizeRangeSqm[0])} – ${fmt(p.sizeRangeSqm[1])} sqm` : `${fmt(p.gfaSqm)} sqm`;
}

/** Short size label for map pins */
export function pinText(p: Property) {
  return sizeText(p);
}

export function statusText(p: Property) {
  return p.status;
}

/** Facts on the expanded (pin-selected) card: site area, then the property's own facts */
export function factList(p: Property) {
  return [{ label: "Site area", value: `${fmt(p.siteAreaSqm)} sqm` }, ...p.facts];
}

export const isSummary = (p: Property) => p.listing === "summary";
