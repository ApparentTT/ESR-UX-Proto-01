/**
 * INV §3 "Our investment track record" (inventory B26), verbatim.
 * Bar sizes are the wireframe's placeholder pixel heights (0-210 scale); every value label is "US $XXbn".
 */
import type { TrackRecordProps } from "@/components/sections/stats/TrackRecord";

export const TRACK_RECORD: TrackRecordProps = {
  title: "Our investment track record",
  sub: "Two decades of raising, deploying and returning capital across market cycles.",
  stats: [
    { value: "$28bn", label: "AUM" },
    { value: "$XXbn", label: "Capital raised" },
    { value: "XX", label: "Development pipeline" },
    { value: "11", label: "APAC markets" },
    { value: "12/20", sideLabel: "Top global limited partners", label: "Diversified relationships" },
  ],
  chart: {
    title: "Assets under management",
    topLabel: "Investor capital",
    bottomLabel: "ESR's own capital",
    max: 210,
    bars: [
      { label: "2019", value: "US $XXbn", top: 42, bottom: 17 },
      { label: "2020", value: "US $XXbn", top: 55, bottom: 21 },
      { label: "2021", value: "US $XXbn", top: 71, bottom: 28 },
      { label: "2022", value: "US $XXbn", top: 88, bottom: 34 },
      { label: "2023", value: "US $XXbn", top: 100, bottom: 39 },
      { label: "2024", value: "US $XXbn", top: 118, bottom: 46 },
      { label: "2025", value: "US $XXbn", top: 136, bottom: 53 },
      { label: "2026", value: "US $XXbn", top: 151, bottom: 59 },
    ],
    footnote: "Figures as at [date]. Past performance is not a reliable indicator of future performance.",
  },
};
