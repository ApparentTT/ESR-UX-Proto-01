/**
 * DC §3 "Our global pipeline" (inventory B21), verbatim.
 * Bar widths and dot geometry are the wireframe's placeholder values.
 */
import type { PowerPipelineProps } from "@/components/sections/stats/PowerPipeline";

export const POWER_PIPELINE: PowerPipelineProps = {
  title: "Our global pipeline",
  sub: "Power secured, under development and in advanced procurement across Asia Pacific. Select a market to see its position.",
  stats: [
    { value: "XXX MW", label: "Total power bank" },
    { value: "XXX MW", label: "Secured power" },
    { value: "XXX MW", label: "Future pipeline" },
    { value: "XX", label: "Sites in the pipeline" },
  ],
  listHead: { market: "Market", secured: "Secured", total: "Total" },
  markets: [
    { name: "Japan", secured: "XX MW", total: "XXX MW", securedPct: 71.5, developmentPct: 15.2 },
    { name: "South Korea", secured: "XX MW", total: "XXX MW", securedPct: 54.6, developmentPct: 24.6 },
    { name: "Greater China", secured: "XX MW", total: "XXX MW", securedPct: 39.7, developmentPct: 32.8 },
    { name: "India", secured: "XX MW", total: "XXX MW", securedPct: 61.5, developmentPct: 20.7 },
    { name: "South East Asia", secured: "XX MW", total: "XXX MW", securedPct: 29.8, developmentPct: 38.3 },
    { name: "Australia and NZ", secured: "XX MW", total: "XXX MW", securedPct: 47.7, developmentPct: 28.4 },
  ],
  legend: { secured: "Secured", development: "Under development", future: "Future pipeline" },
  // Dot 5 (southern China / northern Vietnam) is ambiguous in the spec; it is mapped to Greater China.
  dots: [
    { left: 54.5, top: 18.4, size: 26, status: "secured", market: "South Korea" },
    { left: 61.9, top: 20.7, size: 26, status: "secured", market: "Japan" },
    { left: 47.7, top: 20.7, size: 16, status: "development", market: "Greater China" },
    { left: 47.1, top: 29.4, size: 16, status: "development", market: "Greater China" },
    { left: 39.9, top: 32.9, size: 16, status: "development", market: "Greater China" },
    { left: 20.9, top: 38.0, size: 26, status: "secured", market: "India" },
    { left: 52.3, top: 41.7, size: 16, status: "development", market: "South East Asia" },
    { left: 44.6, top: 53.9, size: 16, status: "development", market: "South East Asia" },
    { left: 69.3, top: 75.8, size: 14, status: "secured", market: "Australia and NZ" },
    { left: 85.8, top: 86.2, size: 16, status: "development", market: "Australia and NZ" },
  ],
  footnote:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
};
