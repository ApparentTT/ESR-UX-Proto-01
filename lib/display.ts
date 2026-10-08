import type { Property } from "@/data/types";
import { PREFECTURE_BY_ID } from "@/data/locations";
import { PROPERTY_TYPES } from "@/data/types";
import { SHOW_INDICATIVE_FIGURES } from "@/config/prototype";
import { fmt } from "./filters";

const AVAIL_TEXT = { now: "Available now", "6m": "Within 6 months", "12m": "Within 12 months", later: "Later" } as const;

export const locationText = (p: Property) => `${p.city}, ${PREFECTURE_BY_ID[p.prefecture].name}`;
export const typeText = (p: Property) => PROPERTY_TYPES.find((t) => t.id === p.type)!.label;

export function sizeText(p: Property) {
  if (p.gfaSqm != null) return `${fmt(p.gfaSqm)} sqm`;
  return SHOW_INDICATIVE_FIGURES ? `${fmt(p.indicative.sizeSqm)} sqm (indicative)` : "[GFA TBC]";
}

/** Short size label for map pins */
export function pinText(p: Property) {
  if (p.gfaSqm != null) return `${fmt(p.gfaSqm)} sqm`;
  return SHOW_INDICATIVE_FIGURES ? `${fmt(p.indicative.sizeSqm)} sqm` : "[GFA TBC]";
}

export function statusText(p: Property) {
  if (p.status) return p.status;
  if (SHOW_INDICATIVE_FIGURES) return p.indicative.preLease ? "Pre-lease (indicative)" : `${AVAIL_TEXT[p.indicative.availability]} (indicative)`;
  return "[Status TBC]";
}
