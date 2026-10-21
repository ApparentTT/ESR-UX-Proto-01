/**
 * Regenerates data/properties.ts.
 *   node --experimental-strip-types scripts/generate-properties.ts
 *
 * Content rules: only the five real ESR Japan property names are used, repeated
 * to make 248 results. Only Higashi-Ogishima Distribution Centre 2 has published
 * figures (kept exactly). Every other record gets realistic generic figures (GFA,
 * site area, status, completion and one type-specific fact) derived from its
 * indicative values, so cards, map pins and the preview never show a placeholder.
 * About a third of the records are summary listings (top-line only, no detail page).
 * Display values are derived after the seeded run from a hash of each id, so the
 * records, filters and order are unchanged from earlier versions.
 *
 * Property types: the search offers two, "logistics" (Industrial and logistics) and "office".
 * Earlier versions drew from six; the draw is kept (as each record's "kind") so the seeded run,
 * sizes and features stay stable, and each kind maps to one of the two types below.
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
// Draw mix of the earlier six kinds; TYPE_OF maps each kind to the published type.
const kindBag = bag({ logistics: 142 - HO_REPEATS - 4, "business-park": 38, "data-centre": 12, "cold-storage": 19, office: 21, land: 16 });
const TYPE_OF: Record<string, "logistics" | "office"> = {
  logistics: "logistics", "cold-storage": "logistics", "data-centre": "logistics", land: "logistics",
  "business-park": "office", office: "office",
};
const availBag = bag({ now: 86, "6m": 34, "12m": 52, later: 76 - HO_REPEATS });

const SUS = { "4-star": 0.24, "5-star": 0.12, solar: 0.18, ev: 0.12, rainwater: 0.09 } as const;
const AMEN = { truck: 0.39, eot: 0.25, parking: 0.57, security: 0.35, rail: 0.03, hardstand: 0.14 } as const;

function size(kind: string) {
  // Log-normal-ish around 12,000 sqm, nothing indicative over 40,000.
  const base = { logistics: 13000, "business-park": 7000, "data-centre": 9000, "cold-storage": 8000, office: 4000, land: 18000 }[kind] ?? 10000;
  const n = (rand() + rand() + rand() - 1.5) * 1.3;
  const v = base * Math.exp(n);
  return Math.round(Math.min(39500, Math.max(1200, v)) / 50) * 50;
}

function features(kind: string) {
  const sustainability = Object.entries(SUS).filter(([, p]) => rand() < p).map(([k]) => k);
  if (sustainability.includes("5-star") && !sustainability.includes("4-star")) sustainability.push("4-star");
  const amenities = Object.entries(AMEN).filter(([k, p]) => rand() < (kind === "land" && k !== "truck" ? p / 3 : p)).map(([k]) => k);
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
// Repeats of the four, spread across prefectures. Avoid repeating the same name, city and kind
// combination so neighbouring cards never look like duplicates (keyed on the drawn kind so the run is unchanged).
const used = new Set<string>(rows.map((r) => `${r.name}|${r.city}|${r.type}`));
while (rows.length < TOTAL) {
  const prefecture = prefBag.pop() as PrefectureId;
  const kind = kindBag.pop()!;
  const type = TYPE_OF[kind];
  const availability = availBag.pop()!;
  let loc = pick(LOCALITIES.filter((l) => l.prefecture === prefecture));
  let name = pick(REPEAT_NAMES);
  for (let tries = 0; tries < 40 && used.has(`${name}|${loc.city}|${kind}`); tries++) {
    loc = pick(LOCALITIES.filter((l) => l.prefecture === prefecture));
    name = pick(REPEAT_NAMES);
  }
  // In its own prefecture a repeated name keeps its real city, so "Yokohama Sachiura" never shows in Kawasaki.
  const home = REAL.find((r) => r.name === name)!;
  if (home.prefecture === prefecture) loc = LOCALITIES.find((l) => l.city === home.city && (l.ward ?? "") === ("ward" in home ? home.ward : ""))!;
  used.add(`${name}|${loc.city}|${kind}`);
  rows.push({
    name, type, city: loc.city, ...(loc.ward ? { ward: loc.ward } : {}), prefecture,
    lat: jitter(loc.lat, 0.08), lng: jitter(loc.lng, 0.1),
    gfaSqm: null, siteAreaSqm: null, status: null,
    indicative: {
      sizeSqm: size(kind), availability,
      preLease: availability === "later" ? rand() < 0.6 : kind === "land" ? rand() < 0.5 : false,
      listed: listed(), ...features(kind),
    },
  });
}

// Newest first is the default order, but keep the flagship at the top as in the wireframe.
rows.sort((a, b) => String((b.indicative as Row).listed).localeCompare(String((a.indicative as Row).listed)));
const flagIdx = rows.findIndex((r) => r.name === HO && r.lat === REAL[0].lat);
const [flag] = rows.splice(flagIdx, 1);
(flag.indicative as Row).listed = "2026-10-01";
rows.unshift(flag);

// Display figures. Derived from a hash of the id (not the seeded PRNG above) so adding them never
// reshuffles the records. Sizes match the indicative size the filters use; status matches availability.
const hash = (s: string) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
};
const FEATURE: Record<string, (gfa: number) => { label: string; value: string }> = {
  logistics: (g) => ({ label: "Truck berths", value: String(Math.min(240, Math.max(6, Math.round(g / 1100)))) }),
  office: (g) => ({ label: "Car spaces", value: String(Math.min(400, Math.max(12, Math.round(g / 140)))) }),
};
const homeOf = new Map<string, string>(REAL.map((r) => [r.name, r.city]));
const withId = rows.map((r, i) => {
  const id = `p${String(i + 1).padStart(3, "0")}`;
  const ind = r.indicative as { sizeSqm: number; availability: string; preLease: boolean };
  const h = hash(id);
  const h2 = hash(`${id}:size`);
  const h3 = hash(`${id}:listing`);
  const published = r.status != null;
  const type = String(r.type);
  const status = published
    ? String(r.status)
    : ind.availability === "now"
      ? h % 4 === 0 ? "Available Q3 2026" : "Available now"
      : ind.availability === "6m"
        ? "Available Q1 2027"
        : ind.availability === "12m"
          ? "Under development"
          : ind.preLease ? "2028 onwards" : "Under development";
  const completion =
    status === "Available now" ? `Completed ${2017 + (h % 9)}`
    : status === "Available Q3 2026" ? "Completed 2026"
    : status === "Available Q1 2027" || ind.availability === "12m" ? "Completion 2027"
    : "Completion 2028";
  const gfa = published ? Number(r.gfaSqm) : ind.sizeSqm;
  const ranged = !published && ["logistics", "office"].includes(type) && h2 % 8 === 0 && gfa >= 8000;
  const sizeRangeSqm = ranged ? [Math.max(1000, Math.round((gfa * (0.12 + (h2 % 20) / 100)) / 100) * 100), gfa] : undefined;
  const siteAreaSqm = published ? Number(r.siteAreaSqm) : Math.round(gfa * (1.35 + (h2 % 90) / 100) + (h % 97));
  // The real properties at their real addresses always open a detail page; others are a third summary listings.
  const home = homeOf.get(String(r.name)) === r.city;
  const listing = !home && h3 % 3 === 0 ? "summary" : "linked";
  return {
    id, ...r, gfaSqm: gfa, ...(sizeRangeSqm ? { sizeRangeSqm } : {}), siteAreaSqm, status, listing,
    facts: [{ label: completion.split(" ")[0], value: completion.split(" ").slice(1).join(" ") }, FEATURE[type](gfa)],
  };
});

const lines = withId.map((r) => `  ${JSON.stringify(r)},`);

const out = `/**
 * Property data for the search prototype. Edit freely.
 *
 * Content rules
 * - Only the five real ESR Japan property names. Do not add new names.
 * - Only Higashi-Ogishima Distribution Centre 2 has published figures
 *   (66,155 sqm site, 306,000 sqm GFA, completion 2028 onwards, Kawasaki, Kanagawa).
 * - Every other record carries realistic generic figures (GFA or a GFA range, site area,
 *   status, completion and one type-specific fact) for the cards, pins and preview.
 *   They match the "indicative" block that drives the filters, sort and map, and are
 *   prototype values, not published figures.
 * - listing: "linked" cards open a property detail page; "summary" cards are a
 *   top-line listing only (about one in three, never the real properties at their
 *   real addresses).
 * - The four other names are repeated across prefectures to populate 248 results.
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
