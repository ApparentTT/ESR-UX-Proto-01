/**
 * INV §5 "Flagship funds across the group" (inventory B29), verbatim.
 * "View fund" goes to fund pages on local market sites (external), so it is inert.
 */
import type { FundCardsProps } from "@/components/sections/infocards/FundCards";

const STATS = [
  { value: "US $XXbn", label: "Fund size" },
  { value: "XX", label: "Assets" },
];

export const INV_FLAGSHIP_FUNDS: FundCardsProps = {
  title: "Flagship funds across the group",
  sub: "Our largest vehicles, and the strategies behind them.",
  funds: [
    { name: "Flagship fund name", meta: "Core and core plus  ·  Pan Asia Pacific", stats: STATS, cta: { label: "View fund", href: null } },
    { name: "Flagship fund name", meta: "Development  ·  Japan and South Korea", stats: STATS, cta: { label: "View fund", href: null } },
    { name: "Flagship fund name", meta: "Data centre  ·  Pan Asia Pacific", stats: STATS, cta: { label: "View fund", href: null } },
  ],
};
