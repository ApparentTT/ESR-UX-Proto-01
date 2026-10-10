/**
 * InteractiveMap content (inventory B15; PORT §2b, DEV §4b), verbatim from the wireframes.
 * 11 map markets in 3 regions (Asia ×9, Oceania ×1, Middle East ×1), in the drawn order.
 * Names follow the map nav ("Greater China", "Australia & New Zealand").
 * The "We span" stats live in data/site/stats.ts (PORT_MAP_STATS, DEV_MAP_STATS).
 */
import type { MapDot, MapRegion } from "@/components/sections/map/types";

export const MAP_REGIONS: MapRegion[] = [
  {
    id: "asia",
    name: "Asia",
    markets: [
      { id: "greater-china", name: "Greater China" },
      { id: "india", name: "India" },
      { id: "indonesia", name: "Indonesia" },
      { id: "japan", name: "Japan" },
      { id: "malaysia", name: "Malaysia" },
      { id: "singapore", name: "Singapore" },
      { id: "south-korea", name: "South Korea" },
      { id: "thailand", name: "Thailand" },
      { id: "vietnam", name: "Vietnam" },
    ],
  },
  {
    id: "oceania",
    name: "Oceania",
    markets: [{ id: "australia-new-zealand", name: "Australia & New Zealand" }],
  },
  {
    id: "middle-east",
    name: "Middle East",
    markets: [{ id: "saudi-arabia", name: "Saudi Arabia" }],
  },
];

/** Asia is open by default. */
export const MAP_DEFAULT_REGION = "asia";

/**
 * The 8 visible market dots: centres as % of the 1306 x 635 frame (Figma geometry, identical on
 * PORT and DEV). Indonesia, Australia & New Zealand and Saudi Arabia have no dot as drawn.
 */
export const MAP_DOTS: MapDot[] = [
  { marketId: "greater-china", x: 44.7, y: 18.8 },
  { marketId: "south-korea", x: 67.9, y: 32.1 },
  { marketId: "japan", x: 75.7, y: 32.1 },
  { marketId: "india", x: 35.2, y: 60.1 },
  { marketId: "thailand", x: 52.8, y: 68.7 },
  { marketId: "vietnam", x: 58.8, y: 73.7 },
  { marketId: "malaysia", x: 54.6, y: 87.8 },
  { marketId: "singapore", x: 56.6, y: 92.9 },
];
