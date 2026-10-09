/**
 * Stat rows (inventory B6), verbatim from the page specs.
 * Placeholders ("XX", "US $XXbn", lorem ipsum) are kept as drawn.
 */
import type { StatItem } from "@/components/sections/stats/StatRow";

const LOREM_FOOTNOTE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";

/** HOME §3b and ABOUT §3 (same four stats, same two footnotes). */
export const GROUP_STATS: StatItem[] = [
  { value: "US $77.3B", label: "Total assets under management", sup: 1 },
  { value: "US $74.9B", label: "3rd Party AUM", sup: 2 },
  { value: "1,900+", label: "People" },
  { value: "13", label: "Countries" },
];

export const GROUP_FOOTNOTES: string[] = [
  "Total AUM is comprised of Third-Party AUM plus Balance Sheet Real Estate. Data as at 31 December 2025.",
  "Third-party AUM excludes AUM from Associates, balance sheet investment properties and levered uncalled capital.",
];

/** HOME §3b: `<StatRow variant="home" stats={HOME_STATS} footnotes={HOME_FOOTNOTES} />` */
export const HOME_STATS = GROUP_STATS;
export const HOME_FOOTNOTES = GROUP_FOOTNOTES;

/** ABOUT §3: row 2 is an exact duplicate of row 1, as drawn. `<StatRow variant="about" rows={ABOUT_STAT_ROWS} footnotes={ABOUT_FOOTNOTES} />` */
export const ABOUT_STAT_ROWS: StatItem[][] = [GROUP_STATS, GROUP_STATS];
export const ABOUT_FOOTNOTES = GROUP_FOOTNOTES;

/** DEV §3: `<StatRow variant="dev" stats={DEV_STATS} footnotes={DEV_FOOTNOTES} />` */
export const DEV_STATS: StatItem[] = [
  { value: "US $XXbn", label: "Development pipeline value" },
  { value: "X.X m sqm", label: "Gross floor area under development" },
  { value: "XXX+", label: "Projects delivered" },
  { value: "11", label: "Markets with active development" },
];
export const DEV_FOOTNOTES: string[] = [LOREM_FOOTNOTE];

/** DC §5: `<StatRow variant="dc" stats={DC_STATS} footnotes={DC_FOOTNOTES} />` */
export const DC_STATS: StatItem[] = [
  { value: "XXX MW", label: "Capacity delivered" },
  { value: "XX", label: "Operational facilities" },
  { value: "XX", label: "Locations" },
  { value: "X", label: "Countries" },
];
export const DC_FOOTNOTES: string[] = [LOREM_FOOTNOTE];

/** SUS §5b: `<StatRow variant="sus" stats={SUS_STATS} footnotes={SUS_FOOTNOTES} />` */
export const SUS_STATS: StatItem[] = [
  { value: "XX%", label: "Green certified by floor area" },
  { value: "XXX MW", label: "Rooftop solar installed" },
  { value: "XX%", label: "Reduction in operational emissions" },
  { value: "XX", label: "Assets with a 5 star rating or above" },
];
export const SUS_FOOTNOTES: string[] = [LOREM_FOOTNOTE];

/** PEOPLE §3: `<StatRow variant="people" stats={PEOPLE_STATS} />` (divider, no footnotes) */
export const PEOPLE_STATS: StatItem[] = [
  { value: "1,900+", label: "People across the group" },
  { value: "XX", label: "Nationalities" },
  { value: "XX%", label: "Roles filled internally" },
  { value: "13", label: "Countries" },
];

/** PORT §2a "We span": `<StatRow variant="map" stats={PORT_MAP_STATS} />` */
export const PORT_MAP_STATS: StatItem[] = [
  { value: "12", label: "Regions" },
  { value: "13", label: "Markets" },
  { value: "1234", label: "Properties under management" },
  { value: "5678", label: "Total assets" },
];

/** DEV §4a "We span": `<StatRow variant="map" stats={DEV_MAP_STATS} />` */
export const DEV_MAP_STATS: StatItem[] = [
  { value: "12", label: "Regions" },
  { value: "13", label: "Markets" },
  { value: "1234", label: "Projects in delivery" },
  { value: "5678", label: "Pipeline GFA (sqm)" },
];
