/**
 * INV §4 "Investment product suite" (inventory B44 = B27 assetClass + B28 reit), verbatim.
 * Asset-class cards are static. REIT tiles go to external REIT sites, so they are inert.
 * The "Market  ·  Exchange" lines keep the wireframe's two spaces either side of the dot.
 */
import type { ProductSuiteProps } from "@/components/sections/infocards/ProductSuite";

export const INV_PRODUCT_SUITE: ProductSuiteProps = {
  title: ["Investment", "product suite"],
  intro: "How our investment framework fits together. What we invest in, and the ways you can invest alongside us.",
  assetClasses: {
    label: "What we invest in",
    items: [
      {
        title: "Industrial and logistics",
        description: "Warehouses, distribution centres and high specification industrial across our markets.",
      },
      {
        title: "Property management and development",
        description: "Stabilised assets we manage, and the development pipeline that feeds them.",
      },
      {
        title: "Data centres",
        description: "Hyperscale and colocation facilities, with the land, power and delivery capability behind them.",
      },
      { title: "Infrastructure", description: "[Description to be confirmed with ESR]" },
    ],
  },
  reits: {
    label: "Our listed REITs",
    items: [
      { name: "ESR-REIT", meta: "Singapore  ·  SGX", href: null },
      { name: "ESR C-REIT", meta: "China  ·  SSE", href: null },
      { name: "ESR Kendall Square REIT", meta: "South Korea  ·  KOSPI", href: null },
      { name: "Fortune REIT", meta: "Hong Kong  ·  HKEX", href: null },
      { name: "Prosperity REIT", meta: "Hong Kong  ·  HKEX", href: null },
      { name: "Sabana Industrial REIT", meta: "Singapore  ·  SGX", href: null },
    ],
  },
};
