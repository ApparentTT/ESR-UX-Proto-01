/**
 * Regenerates data/properties.ts.
 *   node --experimental-strip-types scripts/generate-properties.ts
 *
 * Content rules: only the five real ESR Japan property names are used, repeated
 * to make 248 results. Only Higashi-Ogishima Distribution Centre 2 has published
 * figures; every other record keeps null (rendered as a bracketed TBC placeholder).
 * Sizes, availability and features on repeats are indicative and drive filters only.
 */
import { writeFileSync } from "node:fs";
import { LOCALITIES, type PrefectureId } from "../data/locations.ts";

const TOTAL = 248;

// Seeded PRNG so the file is stable between runs.
let seed = 20261008;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const shuffle = <T,>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
const bag = (counts: Record<string, number>) => shuffle(Object.entries(counts).flatMap(([k, n]) => Array(n).fill(k) as string[]));

// The five real properties.
const HO = "Higashi-Ogishima Distribution Centre 2";
const REAL = [
  { name: HO, city: "Kawasaki", ward: "Kawasaki-ku", prefecture: "kanagawa", lat: 35.488, lng: 139.752 },
  { name: "Yokohama Sachiura Distribution Centre 3", city: "Yokohama", ward: "Kanazawa-ku", prefecture: "kanagawa", lat: 35.333, lng: 139.637 },
  { name: "Itami Distribution Centre", city: "Itami", prefecture: "hyogo", lat: 34.786, lng: 135.402 },
  { name: "Kawasaki Ukishima Distribution Centre", city: "Kawasaki", ward: "Kawasaki-ku", prefecture: "kanagawa", lat: 35.512, lng: 139.778 },
  { name: "Kawasaki Yako Distribution Centre", city: "Kawasaki", ward: "Kawasaki-ku", prefecture: "kanagawa", lat: 35.531, lng: 139.716 },
] as const;
const REPEAT_NAMES = REAL.slice(1).map((r) => r.name);

// Target mix across all 248 records.
const HO_REPEATS = 6; // flagship always keeps its real location and published figures
const prefBag = bag({ kanagawa: 66 - HO_REPEATS - 3, tokyo: 52, osaka: 41, hyogo: 25 - 1, chiba: 16, saitama: 33, aichi: 10, fukuoka: 5 });
const typeBag = bag({ logistics: 142 - HO_REPEATS - 4, "business-park": 38, "data-centre": 12, "cold-storage": 19, office: 21, land: 16 });
const availBag = bag({ now: 86, "6m": 34, "12m": 52, later: 76 - HO_REPEATS });

const SUS = { "4-star": 0.24, "5-star": 0.12, solar: 0.18, ev: 0.12, rainwater: 0.09 } as const;
const AMEN = { truck: 0.39, eot: 0.25, parking: 0.57, security: 0.35, rail: 0.03, hardstand: 0.14 } as const;

function size(type: string) {
  // Log-normal-ish around 12,000 sqm, nothing indicative over 40,000.
  const base = { logistics: 13000, "business-park": 7000, "data-centre": 9000, "cold-storage": 8000, office: 4000, land: 18000 }[type] ?? 10000;
  const n = (rand() + rand() + rand() - 1.5) * 1.3;
  const v = base * Math.exp(n);
  return Math.round(Math.min(39500, Math.max(1200, v)) / 50) * 50;
}

function features(type: string) {
  const sustainability = Object.entries(SUS).filter(([, p]) => rand() < p).map(([k]) => k);
  if (sustainability.includes("5-star") && !sustainability.includes("4-star")) sustainability.push("4-star");
  const amenities = Object.entries(AMEN).filter(([k, p]) => rand() < (type === "land" && k !== "truck" ? p / 3 : p)).map(([k]) => k);
  return { sustainability, amenities };
}

function listed() {
  const d = new Date(Date.UTC(2025, 0, 1) + Math.floor(rand() * 640) * 86400000);
  return d.toISOString().slice(0, 10);
}

const jitter = (v: number, amt: number) => Math.round((v + (rand() - 0.5) * amt) * 10000) / 10000;

type Row = Record<string, unknown>;
const rows: Row[] = [];

// Higashi-Ogishima DC2: real published figures, always Kawasaki, Kanagawa.
for (let i = 0; i < HO_REPEATS; i++) {
  rows.push({
    name: HO, type: "logistics", city: "Kawasaki", ward: "Kawasaki-ku", prefecture: "kanagawa",
    lat: i === 0 ? REAL[0].lat : jitter(REAL[0].lat, 0.03), lng: i === 0 ? REAL[0].lng : jitter(REAL[0].lng, 0.03),
    gfaSqm: 306000, siteAreaSqm: 66155, status: "2028 onwards",
    indicative: { sizeSqm: 306000, availability: "later", preLease: true, listed: listed(), ...features("logistics") },
  });
}
// The other four at their real locations once each.
for (const r of REAL.slice(1)) {
  rows.push({
    ...r, type: "logistics", gfaSqm: null, siteAreaSqm: null, status: null,
    indicative: { sizeSqm: size("logistics"), availability: availBag.pop(), preLease: false, listed: listed(), ...features("logistics") },
  });
}
// Repeats of the four, spread across prefectures.
while (rows.length < TOTAL) {
  const prefecture = prefBag.pop() as PrefectureId;
  const loc = pick(LOCALITIES.filter((l) => l.prefecture === prefecture));
  const type = typeBag.pop()!;
  const availability = availBag.pop()!;
  rows.push({
    name: pick(REPEAT_NAMES), type, city: loc.city, ...(loc.ward ? { ward: loc.ward } : {}), prefecture,
    lat: jitter(loc.lat, 0.08), lng: jitter(loc.lng, 0.1),
    gfaSqm: null, siteAreaSqm: null, status: null,
    indicative: {
      sizeSqm: size(type), availability,
      preLease: availability === "later" ? rand() < 0.6 : type === "land" ? rand() < 0.5 : false,
      listed: listed(), ...features(type),
    },
  });
}

// Newest first is the default order, but keep the flagship at the top as in the wireframe.
rows.sort((a, b) => String((b.indicative as Row).listed).localeCompare(String((a.indicative as Row).listed)));
const flagIdx = rows.findIndex((r) => r.name === HO && r.lat === REAL[0].lat);
const [flag] = rows.splice(flagIdx, 1);
(flag.indicative as Row).listed = "2026-10-01";
rows.unshift(flag);

const lines = rows.map((r, i) => `  ${JSON.stringify({ id: `p${String(i + 1).padStart(3, "0")}`, ...r })},`);

const out = `/**
 * Property data for the search prototype. Edit freely.
 *
 * Content rules
 * - Only the five real ESR Japan property names. Do not add new names.
 * - Only Higashi-Ogishima Distribution Centre 2 has published figures
 *   (66,155 sqm site, 306,000 sqm GFA, completion 2028 onwards, Kawasaki, Kanagawa).
 * - Every other record keeps gfaSqm, siteAreaSqm and status as null, which render as
 *   [GFA TBC], [Site area TBC] and [Status TBC]. Keep the brackets visible.
 * - The four other names are repeated across prefectures to populate 248 results.
 *   Their type, location and "indicative" block are prototype values that drive the
 *   filters, sort and map. They are not published figures.
 *
 * Generated by scripts/generate-properties.ts. Hand edits are fine; regenerating overwrites them.
 */
import type { Property } from "./types";

export const PROPERTIES: Property[] = [
${lines.join("\n")}
];
`;
writeFileSync(new URL("../data/properties.ts", import.meta.url), out);
console.log(`Wrote ${rows.length} properties`);
