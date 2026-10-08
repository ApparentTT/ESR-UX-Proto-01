import { PROPERTIES } from "@/data/properties";
import { PREFECTURES, PREFECTURE_BY_ID, LOCALITIES, type PrefectureId } from "@/data/locations";
import {
  AMENITY_OPTIONS,
  AVAILABILITY_OPTIONS,
  PROPERTY_TYPES,
  SUSTAINABILITY_OPTIONS,
  type AmenityId,
  type Property,
  type PropertyTypeId,
  type SustainabilityId,
} from "@/data/types";
import { MARKET } from "@/config/market";

export type AvailFilter = "now" | "6m" | "12m";
export type SortId = "newest" | "size" | "availability";
export type Bbox = [south: number, west: number, north: number, east: number];

export type Filters = {
  q: string;
  pref: PrefectureId[];
  type: PropertyTypeId[];
  min: number | null;
  max: number | null;
  avail: AvailFilter | null;
  /** Include pre-lease and build to suit on top of the availability window. Default false. */
  pre: boolean;
  sus: SustainabilityId[];
  amen: AmenityId[];
  bbox: Bbox | null;
};

export const EMPTY_FILTERS: Filters = {
  q: "",
  pref: [],
  type: [],
  min: null,
  max: null,
  avail: null,
  pre: false,
  sus: [],
  amen: [],
  bbox: null,
};

/* ---------- Size scale ---------- */

export const SIZE_MIN = 0;
export const SIZE_MAX = 48000; // slider top; max at the top means "no upper limit"
export const SIZE_STEP = 500;
export const HISTOGRAM_BINS = 16;

export const SIZE_PRESETS: { id: string; label: string; min: number | null; max: number | null }[] = [
  { id: "under-5k", label: "Under 5,000", min: null, max: 5000 },
  { id: "5k-20k", label: "5,000 to 20,000", min: 5000, max: 20000 },
  { id: "20k-plus", label: "20,000+", min: 20000, max: null },
  { id: "any", label: "Any", min: null, max: null },
];

export const fmt = (n: number) => n.toLocaleString("en-US");

export function sizeLabel(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min == null) return `Under ${fmt(max!)} sqm`;
  if (max == null) return `${fmt(min)}+ sqm`;
  return `${fmt(min)} to ${fmt(max)} sqm`;
}

/* ---------- URL <-> filters ---------- */

const PREF_IDS = new Set(PREFECTURES.map((p) => p.id));
const TYPE_IDS = new Set(PROPERTY_TYPES.map((t) => t.id));
const SUS_IDS = new Set(SUSTAINABILITY_OPTIONS.map((t) => t.id));
const AMEN_IDS = new Set(AMENITY_OPTIONS.map((t) => t.id));
const list = (v: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
const num = (v: string | null) => {
  if (!v) return null;
  const n = Number(v.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

type ParamsLike = { get(key: string): string | null };

export function parseFilters(sp: ParamsLike): Filters {
  const avail = sp.get("avail");
  const bboxParts = list(sp.get("bbox")).map(Number);
  return {
    q: (sp.get("q") ?? "").trim(),
    pref: list(sp.get("pref")).filter((p): p is PrefectureId => PREF_IDS.has(p as PrefectureId)),
    type: list(sp.get("type")).filter((t): t is PropertyTypeId => TYPE_IDS.has(t as PropertyTypeId)),
    min: num(sp.get("min")),
    max: num(sp.get("max")),
    avail: avail === "now" || avail === "6m" || avail === "12m" ? avail : null,
    pre: sp.get("pre") === "1",
    sus: list(sp.get("sus")).filter((t): t is SustainabilityId => SUS_IDS.has(t as SustainabilityId)),
    amen: list(sp.get("amen")).filter((t): t is AmenityId => AMEN_IDS.has(t as AmenityId)),
    bbox: bboxParts.length === 4 && bboxParts.every(Number.isFinite) ? (bboxParts as Bbox) : null,
  };
}

export function parseSort(sp: ParamsLike): SortId {
  const s = sp.get("sort");
  return s === "size" || s === "availability" ? s : "newest";
}

/** Writes filters in a stable, readable order: q, pref, type, min, max, avail, ... */
export function filtersToParams(f: Filters, extra: Record<string, string | null | undefined> = {}): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q.toLowerCase());
  if (f.pref.length) p.set("pref", f.pref.join(","));
  if (f.type.length) p.set("type", f.type.join(","));
  if (f.min != null) p.set("min", String(f.min));
  if (f.max != null) p.set("max", String(f.max));
  if (f.avail) p.set("avail", f.avail);
  if (f.pre) p.set("pre", "1");
  if (f.sus.length) p.set("sus", f.sus.join(","));
  if (f.amen.length) p.set("amen", f.amen.join(","));
  if (f.bbox) p.set("bbox", f.bbox.map((n) => n.toFixed(3)).join(","));
  for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
  return p;
}

export function searchHref(f: Filters, extra: Record<string, string | null | undefined> = {}) {
  // Commas are legal in a query string; keep them literal so shared links stay readable.
  const qs = filtersToParams(f, extra).toString().replace(/%2C/gi, ",");
  return `/properties/search${qs ? `?${qs}` : ""}`;
}

/* ---------- Matching ---------- */

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();

const haystack = new Map<string, string>(
  PROPERTIES.map((p) => [p.id, norm([p.name, p.city, p.ward ?? "", PREFECTURE_BY_ID[p.prefecture].name].join(" "))]),
);

const AVAIL_RANK = { now: 0, "6m": 1, "12m": 2, later: 3 } as const;

/** A query that names a known place or estate matches that field exactly; anything else is free text. */
type ResolvedQuery =
  | { kind: "prefecture"; id: PrefectureId }
  | { kind: "city"; city: string }
  | { kind: "ward"; ward: string; city: string }
  | { kind: "estate"; name: string }
  | { kind: "text"; tokens: string[] };

const resolved = new Map<string, ResolvedQuery>();
function resolveQuery(q: string): ResolvedQuery {
  const n = norm(q);
  const hit = resolved.get(n);
  if (hit) return hit;
  let r: ResolvedQuery;
  const pref = PREFECTURES.find((p) => norm(p.name) === n);
  const city = LOCALITIES.find((l) => norm(l.city) === n);
  const ward = LOCALITIES.find((l) => l.ward && (norm(`${l.ward} ${l.city}`) === n || norm(l.ward) === n));
  const estate = PROPERTIES.find((p) => norm(p.name) === n);
  if (pref) r = { kind: "prefecture", id: pref.id };
  else if (city) r = { kind: "city", city: city.city };
  else if (ward) r = { kind: "ward", ward: ward.ward!, city: ward.city };
  else if (estate) r = { kind: "estate", name: estate.name };
  else r = { kind: "text", tokens: n.split(" ") };
  resolved.set(n, r);
  return r;
}

/** True when q names a known prefecture, city, ward or estate exactly. */
export const isKnownPlace = (q: string) => !!norm(q) && resolveQuery(q).kind !== "text";

export function matchesQuery(p: Property, q: string) {
  if (!norm(q)) return true;
  const r = resolveQuery(q);
  switch (r.kind) {
    case "prefecture":
      return p.prefecture === r.id;
    case "city":
      return p.city === r.city;
    case "ward":
      return p.city === r.city && p.ward === r.ward;
    case "estate":
      return p.name === r.name;
    case "text": {
      const h = haystack.get(p.id)!;
      return r.tokens.every((tok) => h.includes(tok));
    }
  }
}

function matchesAvail(p: Property, avail: AvailFilter | null, pre: boolean) {
  if (!avail) return true;
  if (p.indicative.preLease && pre) return true;
  return AVAIL_RANK[p.indicative.availability] <= AVAIL_RANK[avail];
}

export type FacetKey = "location" | "type" | "size" | "avail" | "sus" | "amen" | "bbox";

/** Every filter except the facet named in `skip`, so a facet's own options can be counted. */
export function matches(p: Property, f: Filters, skip?: FacetKey) {
  if (skip !== "location") {
    if (!matchesQuery(p, f.q)) return false;
    if (f.pref.length && !f.pref.includes(p.prefecture)) return false;
  }
  if (skip !== "type" && f.type.length && !f.type.includes(p.type)) return false;
  if (skip !== "size") {
    const s = p.indicative.sizeSqm;
    if (f.min != null && s < f.min) return false;
    if (f.max != null && s > f.max) return false;
  }
  if (skip !== "avail" && !matchesAvail(p, f.avail, f.pre)) return false;
  if (skip !== "sus" && f.sus.length && !f.sus.every((s) => p.indicative.sustainability.includes(s))) return false;
  if (skip !== "amen" && f.amen.length && !f.amen.every((s) => p.indicative.amenities.includes(s))) return false;
  if (skip !== "bbox" && f.bbox) {
    const [s, w, n, e] = f.bbox;
    if (p.lat < s || p.lat > n || p.lng < w || p.lng > e) return false;
  }
  return true;
}

export function filterProperties(f: Filters, source: Property[] = PROPERTIES) {
  return source.filter((p) => matches(p, f));
}

export function countMatching(f: Filters) {
  let n = 0;
  for (const p of PROPERTIES) if (matches(p, f)) n++;
  return n;
}

export function sortProperties(list: Property[], sort: SortId) {
  const out = [...list];
  if (sort === "size") out.sort((a, b) => b.indicative.sizeSqm - a.indicative.sizeSqm);
  else if (sort === "availability")
    out.sort(
      (a, b) =>
        Number(a.indicative.preLease) - Number(b.indicative.preLease) ||
        AVAIL_RANK[a.indicative.availability] - AVAIL_RANK[b.indicative.availability],
    );
  else out.sort((a, b) => b.indicative.listed.localeCompare(a.indicative.listed));
  return out;
}

/* ---------- Facet counts (live, against a draft) ---------- */

export function facetBase(f: Filters, facet: FacetKey) {
  return PROPERTIES.filter((p) => matches(p, f, facet));
}

export function prefectureCounts(f: Filters) {
  const base = PROPERTIES.filter((p) => matches(p, { ...f, pref: [] }));
  const out = Object.fromEntries(PREFECTURES.map((p) => [p.id, 0])) as Record<PrefectureId, number>;
  for (const p of base) out[p.prefecture]++;
  return out;
}

export function typeCounts(f: Filters) {
  const out = Object.fromEntries(PROPERTY_TYPES.map((t) => [t.id, 0])) as Record<PropertyTypeId, number>;
  for (const p of facetBase(f, "type")) out[p.type]++;
  return out;
}

export function availabilityCounts(f: Filters) {
  const base = facetBase(f, "avail");
  return Object.fromEntries(
    AVAILABILITY_OPTIONS.map((o) => [o.id, base.filter((p) => matchesAvail(p, o.id === "any" ? null : o.id, f.pre)).length]),
  ) as Record<"now" | "6m" | "12m" | "any", number>;
}

export function sustainabilityCounts(f: Filters) {
  const base = facetBase(f, "sus");
  return Object.fromEntries(
    SUSTAINABILITY_OPTIONS.map((o) => [o.id, base.filter((p) => [...f.sus, o.id].every((s) => p.indicative.sustainability.includes(s))).length]),
  ) as Record<SustainabilityId, number>;
}

export function amenityCounts(f: Filters) {
  const base = facetBase(f, "amen");
  return Object.fromEntries(
    AMENITY_OPTIONS.map((o) => [o.id, base.filter((p) => [...f.amen, o.id].every((s) => p.indicative.amenities.includes(s))).length]),
  ) as Record<AmenityId, number>;
}

/** Histogram of indicative sizes for everything matching the other filters. Last bin collects SIZE_MAX and over. */
export function sizeHistogram(f: Filters) {
  const bins = Array(HISTOGRAM_BINS).fill(0) as number[];
  const width = (SIZE_MAX - SIZE_MIN) / HISTOGRAM_BINS;
  for (const p of facetBase(f, "size")) {
    const i = Math.min(HISTOGRAM_BINS - 1, Math.floor((p.indicative.sizeSqm - SIZE_MIN) / width));
    bins[i]++;
  }
  return { bins, width };
}

/* ---------- Location typeahead ---------- */

export type Suggestion = {
  kind: "city" | "ward" | "estate" | "prefecture";
  label: string;
  sub: string;
  /** Value written to q */
  value: string;
  count: number;
};

export function locationSuggestions(text: string, f: Filters, limit = 6): Suggestion[] {
  const n = norm(text);
  if (n.length < 2) return [];
  const base = PROPERTIES.filter((p) => matches(p, { ...f, q: "", pref: [] }, undefined));
  const out: Suggestion[] = [];
  const seen = new Set<string>();
  const push = (s: Omit<Suggestion, "count">) => {
    const key = `${s.kind}:${s.value}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ ...s, count: base.filter((p) => matchesQuery(p, s.value)).length });
  };
  for (const pref of PREFECTURES) if (norm(pref.name).startsWith(n)) push({ kind: "prefecture", label: pref.name, sub: MARKET.regionLabel, value: pref.name });
  for (const l of LOCALITIES) {
    const pref = PREFECTURE_BY_ID[l.prefecture].name;
    if (norm(l.city).includes(n)) push({ kind: "city", label: `${l.city}, ${pref}`, sub: "city", value: l.city });
  }
  for (const l of LOCALITIES) {
    if (l.ward && norm(l.ward).includes(n)) push({ kind: "ward", label: `${l.ward}, ${l.city}`, sub: "ward", value: `${l.ward} ${l.city}` });
  }
  for (const name of new Set(PROPERTIES.map((p) => p.name))) {
    if (norm(name).includes(n)) push({ kind: "estate", label: name, sub: "estate", value: name });
  }
  return out.sort((a, b) => Number(b.label.toLowerCase().startsWith(n)) - Number(a.label.toLowerCase().startsWith(n))).slice(0, limit);
}

/** Readable label for a q value: "kawasaki" -> "Kawasaki" */
export function displayQuery(q: string) {
  if (!q) return "";
  const n = norm(q);
  const pref = PREFECTURES.find((p) => norm(p.name) === n);
  if (pref) return pref.name;
  const city = LOCALITIES.find((l) => norm(l.city) === n);
  if (city) return city.city;
  const ward = LOCALITIES.find((l) => l.ward && norm(`${l.ward} ${l.city}`) === n);
  if (ward) return `${ward.ward}, ${ward.city}`;
  const estate = PROPERTIES.find((p) => norm(p.name) === n);
  if (estate) return estate.name;
  return q.charAt(0).toUpperCase() + q.slice(1);
}

/* ---------- Applied chips and counts ---------- */

export type Chip = { key: string; label: string; remove: (f: Filters) => Filters };

export function appliedChips(f: Filters): Chip[] {
  const chips: Chip[] = [];
  if (f.q) chips.push({ key: "q", label: displayQuery(f.q), remove: (x) => ({ ...x, q: "" }) });
  for (const id of f.pref)
    chips.push({ key: `pref:${id}`, label: PREFECTURE_BY_ID[id].name, remove: (x) => ({ ...x, pref: x.pref.filter((p) => p !== id) }) });
  for (const id of f.type)
    chips.push({ key: `type:${id}`, label: PROPERTY_TYPES.find((t) => t.id === id)!.label, remove: (x) => ({ ...x, type: x.type.filter((t) => t !== id) }) });
  const sl = sizeLabel(f.min, f.max);
  if (sl) chips.push({ key: "size", label: sl, remove: (x) => ({ ...x, min: null, max: null }) });
  if (f.avail)
    chips.push({ key: "avail", label: AVAILABILITY_OPTIONS.find((a) => a.id === f.avail)!.label, remove: (x) => ({ ...x, avail: null }) });
  if (f.pre) chips.push({ key: "pre", label: "Incl. pre-lease and build to suit", remove: (x) => ({ ...x, pre: false }) });
  for (const id of f.sus)
    chips.push({ key: `sus:${id}`, label: SUSTAINABILITY_OPTIONS.find((t) => t.id === id)!.label, remove: (x) => ({ ...x, sus: x.sus.filter((t) => t !== id) }) });
  for (const id of f.amen)
    chips.push({ key: `amen:${id}`, label: AMENITY_OPTIONS.find((t) => t.id === id)!.label, remove: (x) => ({ ...x, amen: x.amen.filter((t) => t !== id) }) });
  if (f.bbox) chips.push({ key: "bbox", label: "Map area", remove: (x) => ({ ...x, bbox: null }) });
  return chips;
}

export const groupCounts = (f: Filters) => ({
  location: f.pref.length + (f.q ? 1 : 0),
  type: f.type.length,
  size: f.min != null || f.max != null ? 1 : 0,
  avail: (f.avail ? 1 : 0) + (f.pre ? 1 : 0),
  more: f.sus.length + f.amen.length,
});

/** Number of active filter groups, shown on the Filters button. */
export function activeGroupCount(f: Filters) {
  const g = groupCounts(f);
  return [g.location, g.type, g.size, g.avail, f.sus.length, f.amen.length, f.bbox ? 1 : 0].filter(Boolean).length;
}

export const hasAnyFilter = (f: Filters) => activeGroupCount(f) > 0;

/** "in Kanagawa", "in Kanagawa and Tokyo", "in 3 prefectures", "in Japan" */
export function scopeLabel(f: Filters) {
  if (f.pref.length === 1) return `in ${PREFECTURE_BY_ID[f.pref[0]].name}`;
  if (f.pref.length === 2) return `in ${PREFECTURE_BY_ID[f.pref[0]].name} and ${PREFECTURE_BY_ID[f.pref[1]].name}`;
  if (f.pref.length > 2) return `in ${f.pref.length} ${MARKET.regionLabelPlural}`;
  if (f.q) return `in ${displayQuery(f.q)}`;
  return `in ${MARKET.name}`;
}

/** Plain summary for the empty state: "Aomori, cold storage, over 20,000 sqm" */
export function filterSummary(f: Filters) {
  const parts: string[] = [];
  if (f.q) parts.push(displayQuery(f.q));
  for (const id of f.pref) parts.push(PREFECTURE_BY_ID[id].name);
  for (const id of f.type) parts.push(PROPERTY_TYPES.find((t) => t.id === id)!.label.toLowerCase());
  if (f.min != null && f.max == null) parts.push(`over ${fmt(f.min)} sqm`);
  else if (f.min == null && f.max != null) parts.push(`under ${fmt(f.max)} sqm`);
  else if (f.min != null && f.max != null) parts.push(`${fmt(f.min)} to ${fmt(f.max)} sqm`);
  if (f.avail) parts.push(AVAILABILITY_OPTIONS.find((a) => a.id === f.avail)!.label.toLowerCase());
  for (const id of f.sus) parts.push(SUSTAINABILITY_OPTIONS.find((t) => t.id === id)!.label.toLowerCase());
  for (const id of f.amen) parts.push(AMENITY_OPTIONS.find((t) => t.id === id)!.label.toLowerCase());
  if (f.bbox) parts.push("this map area");
  return parts.join(", ");
}

/** Nearest properties to the current search, for the empty state. Widens by dropping filters until something shows. */
export function nearbyProperties(f: Filters, limit = 4): Property[] {
  const attempts: Filters[] = [
    { ...f, min: null, max: null },
    { ...f, min: null, max: null, avail: null, sus: [], amen: [] },
    { ...f, type: [], min: null, max: null, avail: null, sus: [], amen: [], bbox: null },
    { ...EMPTY_FILTERS, pref: f.pref },
    EMPTY_FILTERS,
  ];
  for (const a of attempts) {
    const r = filterProperties(a);
    if (r.length) return r.slice(0, limit);
  }
  return [];
}
