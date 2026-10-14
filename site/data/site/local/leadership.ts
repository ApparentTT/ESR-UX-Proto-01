/**
 * /jp/leadership: Local_OurLeadership (Primary wireframes 1340:75216, mobile 1340:75217), verbatim.
 * The frame is drawn for Australia and New Zealand: as in the local navigation (config/local-nav.ts), the
 * market name reads "Japan". "Our REITs" is word for word the group block (data/site/reitInfo.ts).
 */
import type { Leader } from "@/data/site/leaders";

export const JP_LEAD_INTRO = {
  title: "Our leadership",
  body: "The team running ESR in Japan, and the group executive behind them.",
};

const GROUP = "Japan leadership";
const BIO =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export const JP_LEADERS: Leader[] = [
  { group: GROUP, name: "Leader name", title: "Chief Executive Officer, Japan", bio: BIO, hasAreaButton: false },
  { group: GROUP, name: "Leader name", title: "Chairman, Japan", bio: BIO, hasAreaButton: false },
  { group: GROUP, name: "Leader name", title: "Chief Financial Officer, Japan", bio: BIO, hasAreaButton: false },
  { group: GROUP, name: "Leader name", title: "Head of Development, Japan", bio: `${BIO} ${BIO}`, hasAreaButton: false },
];

/** "Group leadership" promo: the group Our leadership page */
export const JP_LEAD_GROUP_PROMO = {
  title: "Group leadership",
  sub: "The executive committee and co-founders leading ESR across Asia Pacific.",
  cta: { label: "Meet the group team", href: "/about/leadership" },
};
