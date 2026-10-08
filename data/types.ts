import type { PrefectureId } from "./locations";

export type PropertyTypeId = "logistics" | "business-park" | "data-centre" | "cold-storage" | "office" | "land";
export type AvailabilityWindow = "now" | "6m" | "12m" | "later";
export type SustainabilityId = "4-star" | "5-star" | "solar" | "ev" | "rainwater";
export type AmenityId = "truck" | "eot" | "parking" | "security" | "rail" | "hardstand";

export type Property = {
  id: string;
  /** One of the five real ESR Japan property names. Never invent new names. */
  name: string;
  type: PropertyTypeId;
  city: string;
  ward?: string;
  prefecture: PrefectureId;
  lat: number;
  lng: number;
  /** Published GFA in sqm. null renders as [GFA TBC]. */
  gfaSqm: number | null;
  /** Published site area in sqm. null renders as [Site area TBC]. */
  siteAreaSqm: number | null;
  /** Published status or completion. null renders as [Status TBC]. */
  status: string | null;
  /**
   * Indicative values that drive filtering, sorting and the size histogram so the
   * prototype behaves realistically. Not published figures and not shown on cards
   * unless SHOW_INDICATIVE_FIGURES is switched on in config/prototype.ts.
   */
  indicative: {
    sizeSqm: number;
    availability: AvailabilityWindow;
    /** Pre-lease or build to suit */
    preLease: boolean;
    /** ISO date, drives "Newest" sort */
    listed: string;
    sustainability: SustainabilityId[];
    amenities: AmenityId[];
  };
};

export const PROPERTY_TYPES: { id: PropertyTypeId; label: string; plural: string }[] = [
  { id: "logistics", label: "Logistics and industrial", plural: "Logistics and industrial" },
  { id: "business-park", label: "Business park", plural: "Business parks" },
  { id: "data-centre", label: "Data centres", plural: "Data centres" },
  { id: "cold-storage", label: "Cold storage", plural: "Cold storage" },
  { id: "office", label: "Office", plural: "Office" },
  { id: "land", label: "Land and development sites", plural: "Land and development sites" },
];

export const AVAILABILITY_OPTIONS: { id: "now" | "6m" | "12m" | "any"; label: string }[] = [
  { id: "now", label: "Available now" },
  { id: "6m", label: "Within 6 months" },
  { id: "12m", label: "Within 12 months" },
  { id: "any", label: "Any time" },
];

export const SUSTAINABILITY_OPTIONS: { id: SustainabilityId; label: string }[] = [
  { id: "4-star", label: "4 star and above" },
  { id: "5-star", label: "5 star and above" },
  { id: "solar", label: "Rooftop solar" },
  { id: "ev", label: "EV charging" },
  { id: "rainwater", label: "Rainwater capture" },
];

export const AMENITY_OPTIONS: { id: AmenityId; label: string }[] = [
  { id: "truck", label: "Truck access" },
  { id: "eot", label: "End of trip facilities" },
  { id: "parking", label: "On site parking" },
  { id: "security", label: "24/7 security" },
  { id: "rail", label: "Rail siding" },
  { id: "hardstand", label: "Hardstand" },
];
