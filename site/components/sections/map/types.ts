/** Shared types for the InteractiveMap family (inventory B15). */

/** One market link in the region nav panel. Markets are inert: they select and highlight only. */
export type MapMarket = {
  /** Stable key, also used to pair a market with its dot */
  id: string;
  /** Label as drawn, e.g. "Greater China", "Australia & New Zealand" */
  name: string;
};

/** A region heading in the nav panel ("Asia", "Oceania", "Middle East") and its markets. */
export type MapRegion = {
  id: string;
  name: string;
  markets: MapMarket[];
};

/** A market dot on the map. x / y are the dot centre as % of the 1306 x 635 map frame. */
export type MapDot = {
  /** The MapMarket.id this dot belongs to */
  marketId: string;
  x: number;
  y: number;
};

/** Map stat item (same shape as StatRow's StatItem). */
export type MapStat = { value: string; label: string };
