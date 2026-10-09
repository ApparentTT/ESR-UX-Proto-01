/**
 * Market configuration. The region label is market driven: swap ACTIVE_MARKET
 * (or edit a market below) to change how the location filter talks about regions.
 */
export type MarketConfig = {
  id: string;
  name: string;
  /** Singular region label, lower case: "prefecture", "state", "province", "district" */
  regionLabel: string;
  regionLabelPlural: string;
  /** Used in "Prefectures in Japan" style sub headings */
  regionHeading: string;
};

export const MARKETS = {
  japan: { id: "jp", name: "Japan", regionLabel: "prefecture", regionLabelPlural: "prefectures", regionHeading: "Prefectures in Japan" },
  australia: { id: "au", name: "Australia", regionLabel: "state", regionLabelPlural: "states", regionHeading: "States in Australia" },
  korea: { id: "kr", name: "South Korea", regionLabel: "province", regionLabelPlural: "provinces", regionHeading: "Provinces in South Korea" },
  china: { id: "cn", name: "China", regionLabel: "province", regionLabelPlural: "provinces", regionHeading: "Provinces in China" },
  hongKong: { id: "hk", name: "Hong Kong", regionLabel: "district", regionLabelPlural: "districts", regionHeading: "Districts in Hong Kong" },
  singapore: { id: "sg", name: "Singapore", regionLabel: "district", regionLabelPlural: "districts", regionHeading: "Districts in Singapore" },
} satisfies Record<string, MarketConfig>;

export const MARKET: MarketConfig = MARKETS.japan;

/** "Prefecture" */
export const regionLabelTitle = MARKET.regionLabel.charAt(0).toUpperCase() + MARKET.regionLabel.slice(1);
