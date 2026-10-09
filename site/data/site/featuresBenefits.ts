/**
 * DC §4 "Features and benefits" (inventory B22), verbatim.
 * Only the Scalability open state is designed; the wireframe reuses its description (truncated
 * mid-word at "con", kept verbatim) for the other cards' expanded state.
 */
import type { ExpandingCardItem } from "@/components/sections/infocards/ExpandingCards";

export const DC_FEATURES_HEADING = "Features and benefits";

const SCALABILITY_DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam Lorem ipsum dolor sit amet, con";

export const DC_FEATURES: ExpandingCardItem[] = [
  { title: "Scalability", description: SCALABILITY_DESCRIPTION },
  { title: "Sustainability", description: SCALABILITY_DESCRIPTION },
  { title: "Delivery capability", description: SCALABILITY_DESCRIPTION },
  { title: "Operational experience", description: SCALABILITY_DESCRIPTION },
];
