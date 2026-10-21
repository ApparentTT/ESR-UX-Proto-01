import type { PrefectureId } from "./locations";

export type PropertyTypeId = "logistics" | "office";
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
  /** GFA in sqm shown on cards and pins (published for Higashi-Ogishima DC 2, realistic generic values elsewhere). */
  gfaSqm: number;
  /** Shown instead of gfaSqm as "min – max sqm" on the few multi-unit listings. max equals gfaSqm. */
  sizeRangeSqm?: [number, number];
  /** Site area in sqm */
  siteAreaSqm: number;
  /** Status chip: "Available now", "Available Q3 2026", "Available Q1 2027", "Under development" or "2028 onwards" */
  status: string;
  /** "linked": the card opens the property detail page. "summary": a top-line listing only, not clickable. */
  listing: "linked" | "summary";
  /** Extra facts on the expanded (pin-selected) card, after site area. E.g. Completion 2028, Truck berths 48. */
  facts: { label: string; value: string }[];
  /**
   * Indicative values that drive filtering, sorting and the size histogram so the
   * prototype behaves realistically. sizeSqm equals gfaSqm and availability matches status.
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
  { id: "logistics", label: "Industrial and logistics", plural: "Industrial and logistics" },
  { id: "office", label: "Office", plural: "Office" },
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
