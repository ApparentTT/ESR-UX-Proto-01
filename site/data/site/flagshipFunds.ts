/**
 * INV §5 "Flagship funds across the group" (inventory B29), verbatim.
 * "View fund" (and the whole card) opens the placeholder fund detail page (see data/site/funds.ts).
 */
import type { FundCardsProps } from "@/components/sections/infocards/FundCards";
import { FLAGSHIP_FUNDS, FLAGSHIP_FUNDS_HEAD } from "@/data/site/funds";

export const INV_FLAGSHIP_FUNDS: FundCardsProps = {
  ...FLAGSHIP_FUNDS_HEAD,
  funds: FLAGSHIP_FUNDS,
};
