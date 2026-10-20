/**
 * DC §3 "Our group pipeline" (inventory B21), group level only: headline figures (placeholders) and the
 * markets where ESR has a data centre presence, shown as dots on the Asia Pacific map (no market figures).
 */
import type { PowerPipelineProps } from "@/components/sections/stats/PowerPipeline";

export const POWER_PIPELINE: PowerPipelineProps = {
  title: "Our group pipeline",
  sub: "A growing data centre platform across Asia Pacific, with the land, power and delivery capability to scale with our customers.",
  stats: [
    { value: "XXX MW", label: "Total pipeline" },
    { value: "XXX MW", label: "In operation" },
    { value: "XX", label: "Data centres" },
    { value: "X", label: "Markets" },
  ],
  markets: ["Japan", "South Korea", "Hong Kong SAR", "India", "Singapore", "Australia"],
  locations: [
    { market: "Japan", lon: 139.7, lat: 35.7 },
    { market: "Japan", lon: 135.5, lat: 34.7 },
    { market: "South Korea", lon: 127.0, lat: 37.6 },
    { market: "Hong Kong SAR", lon: 114.2, lat: 22.3 },
    { market: "India", lon: 72.9, lat: 19.1 },
    { market: "Singapore", lon: 103.8, lat: 1.35 },
    { market: "Australia", lon: 151.2, lat: -33.9 },
  ],
  legend: "Markets with an ESR data centre presence",
  footnote:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
};
