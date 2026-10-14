/**
 * DC §3 "Our group pipeline" (inventory B21), verbatim.
 * Bar widths are the wireframe's placeholder values; dots are placed on their real markets.
 */
import type { PowerPipelineProps } from "@/components/sections/stats/PowerPipeline";

export const POWER_PIPELINE: PowerPipelineProps = {
  title: "Our group pipeline",
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
  // Dots sit on their markets (longitude / latitude) on the Asia Pacific map; sizes and statuses as drawn.
  // The wireframe's placeholder spots are read as Seoul, Tokyo, Beijing, Shanghai, Hong Kong, Mumbai,
  // Ho Chi Minh City, Singapore, Sydney and Auckland.
  dots: [
    { lon: 127.0, lat: 37.6, size: 26, status: "secured", market: "South Korea" },
    { lon: 139.7, lat: 35.7, size: 26, status: "secured", market: "Japan" },
    { lon: 116.4, lat: 39.9, size: 16, status: "development", market: "Greater China" },
    { lon: 121.5, lat: 31.2, size: 16, status: "development", market: "Greater China" },
    { lon: 114.2, lat: 22.3, size: 16, status: "development", market: "Greater China" },
    { lon: 72.9, lat: 19.1, size: 26, status: "secured", market: "India" },
    { lon: 106.7, lat: 10.8, size: 16, status: "development", market: "South East Asia" },
    { lon: 103.8, lat: 1.35, size: 16, status: "development", market: "South East Asia" },
    { lon: 151.2, lat: -33.9, size: 14, status: "secured", market: "Australia and NZ" },
    { lon: 174.8, lat: -36.85, size: 16, status: "development", market: "Australia and NZ" },
  ],
  footnote:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
};
