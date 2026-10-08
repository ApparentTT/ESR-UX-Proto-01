/**
 * Hand-simplified outline of Japan's main islands, a few expressway corridors and
 * city labels for the simulated map. Approximate and decorative only.
 * Points are [lat, lng].
 */
export type LatLng = [number, number];

export const LAND: LatLng[][] = [
  // Honshu
  [
    [33.95, 130.95], [34.35, 131.4], [34.65, 131.6], [35.05, 132.0], [35.45, 132.65], [35.55, 133.1], [35.5, 133.6], [35.55, 134.2],
    [35.65, 134.8], [35.75, 135.3], [35.5, 135.5], [35.55, 135.9], [35.75, 136.0], [36.25, 136.15], [36.75, 136.7], [37.05, 136.75],
    [37.5, 137.0], [37.4, 137.35], [37.05, 137.0], [36.85, 137.4], [37.05, 138.0], [37.45, 138.6], [37.95, 139.1], [38.4, 139.45],
    [39.1, 139.85], [39.6, 140.0], [40.0, 139.7], [40.55, 139.95], [41.2, 140.25], [41.2, 140.9], [41.45, 141.45], [40.9, 141.4],
    [40.45, 141.7], [39.6, 142.05], [39.0, 141.65], [38.4, 141.5], [38.25, 141.0], [37.8, 141.0], [37.0, 140.95], [36.4, 140.6],
    [35.95, 140.75], [35.73, 140.87], [35.6, 140.45], [35.15, 140.35], [34.9, 139.85], [35.05, 139.78], [35.35, 139.88], [35.58, 140.08],
    [35.67, 139.86], [35.63, 139.84], [35.56, 139.82], [35.5, 139.8], [35.46, 139.77], [35.42, 139.68], [35.35, 139.66], [35.28, 139.7],
    [35.2, 139.68], [35.14, 139.62], [35.24, 139.58], [35.3, 139.5], [35.25, 139.15],
    [35.05, 139.1], [34.65, 138.85], [34.6, 138.2], [34.75, 137.6], [34.65, 137.0], [34.75, 136.85], [35.05, 136.85], [34.85, 136.6],
    [34.45, 136.85], [34.2, 136.35], [33.75, 136.0], [33.45, 135.75], [33.75, 135.1], [34.2, 135.1], [34.45, 135.33], [34.62, 135.42],
    [34.7, 135.32], [34.66, 135.15], [34.65, 134.7], [34.4, 133.9], [34.45, 133.4], [34.35, 132.6], [34.0, 132.2], [33.95, 131.6],
  ],
  // Kyushu
  [
    [33.95, 130.9], [33.9, 130.45], [33.65, 130.25], [33.5, 129.85], [33.2, 129.6], [32.75, 129.75], [32.6, 130.15], [32.15, 130.15],
    [31.4, 130.2], [31.2, 130.6], [31.0, 131.05], [31.45, 131.35], [32.0, 131.5], [32.5, 131.7], [33.0, 131.9], [33.3, 131.65],
    [33.6, 131.7], [33.9, 131.15],
  ],
  // Shikoku
  [
    [34.35, 133.1], [34.3, 133.6], [34.4, 134.1], [34.2, 134.6], [33.85, 134.75], [33.5, 134.3], [33.25, 134.15], [33.45, 133.55],
    [32.75, 132.95], [33.0, 132.5], [33.45, 132.4], [33.9, 132.7], [34.1, 132.95],
  ],
  // Hokkaido
  [
    [41.4, 140.0], [41.8, 140.0], [42.3, 139.8], [42.9, 140.4], [43.3, 140.4], [43.3, 141.3], [44.0, 141.6], [45.4, 141.7],
    [44.5, 142.6], [44.0, 144.3], [43.4, 145.8], [42.9, 144.5], [42.5, 143.3], [42.0, 143.2], [42.6, 141.7], [42.3, 141.0],
    [41.8, 141.2], [41.8, 140.6],
  ],
];

/** Lakes drawn in sea grey */
export const WATER: LatLng[][] = [
  // Lake Biwa
  [[35.45, 136.05], [35.3, 136.2], [35.1, 136.05], [35.0, 135.9], [35.15, 135.95], [35.35, 136.0]],
];

/** Approximate city centres, also used to place searches for cities with no stock. */
export const PLACES = {
  tokyo: [35.68, 139.77], yokohama: [35.44, 139.64], atsugi: [35.44, 139.36], shizuoka: [34.97, 138.38], hamamatsu: [34.71, 137.73],
  nagoya: [35.17, 136.9], kyoto: [35.0, 135.76], osaka: [34.69, 135.5], kobe: [34.69, 135.19], himeji: [34.82, 134.69],
  okayama: [34.66, 133.92], hiroshima: [34.39, 132.46], yamaguchi: [34.0, 131.4], shimonoseki: [33.96, 130.94], kitakyushu: [33.88, 130.88],
  fukuoka: [33.59, 130.4], kumamoto: [32.8, 130.7], kagoshima: [31.6, 130.55], saitama: [35.86, 139.65], utsunomiya: [36.55, 139.88],
  fukushima: [37.75, 140.47], sendai: [38.27, 140.87], chiba: [35.61, 140.12], narita: [35.78, 140.32], hachioji: [35.66, 139.32],
  kofu: [35.66, 138.57], matsumoto: [36.23, 137.97], nagano: [36.65, 138.18], takasaki: [36.32, 139.0], niigata: [37.9, 139.04],
  komaki: [35.29, 136.91], gifu: [35.42, 136.76], itami: [34.78, 135.4], ibaraki: [34.82, 135.57], kawagoe: [35.92, 139.49],
  koshigaya: [35.89, 139.79], kashiwa: [35.87, 139.98], funabashi: [35.69, 139.98], kawasaki: [35.53, 139.7], sagamihara: [35.57, 139.37],
  sakai: [34.57, 135.48], wakayama: [34.23, 135.17], tsu: [34.72, 136.5], kanazawa: [36.56, 136.65], toyama: [36.7, 137.21],
  matsuyama: [33.84, 132.77], takamatsu: [34.34, 134.05], kochi: [33.56, 133.53], tokushima: [34.07, 134.55], oita: [33.24, 131.61],
  miyazaki: [31.91, 131.42], nagasaki: [32.75, 129.88], morioka: [39.7, 141.15], aomori: [40.82, 140.74], akita: [39.72, 140.1],
} satisfies Record<string, LatLng>;
const C = PLACES;

/** Expressway corridors. Major ones are drawn heavier. */
export const ROADS: { major: boolean; path: LatLng[] }[] = [
  { major: true, path: [C.tokyo, C.yokohama, C.atsugi, C.shizuoka, C.hamamatsu, C.nagoya, C.kyoto, C.osaka, C.kobe, C.himeji, C.okayama, C.hiroshima, C.yamaguchi, C.shimonoseki, C.kitakyushu, C.fukuoka, C.kumamoto, C.kagoshima] },
  { major: true, path: [C.tokyo, C.saitama, C.utsunomiya, C.fukushima, C.sendai, C.morioka, C.aomori] },
  { major: true, path: [C.tokyo, C.hachioji, C.kofu, C.matsumoto, C.nagano] },
  { major: true, path: [C.saitama, C.takasaki, C.niigata] },
  { major: false, path: [C.tokyo, C.funabashi, C.chiba, C.narita] },
  { major: false, path: [C.kawagoe, C.koshigaya, C.kashiwa, C.funabashi] },
  { major: false, path: [C.atsugi, C.sagamihara, C.hachioji, C.kawagoe] },
  { major: false, path: [C.tokyo, C.kawasaki, C.yokohama] },
  { major: false, path: [C.nagoya, C.komaki, C.gifu, C.kanazawa, C.toyama, C.niigata] },
  { major: false, path: [C.nagoya, C.tsu] },
  { major: false, path: [C.osaka, C.itami, C.ibaraki, C.kyoto] },
  { major: false, path: [C.osaka, C.sakai, C.wakayama] },
  { major: false, path: [C.takamatsu, C.tokushima] },
  { major: false, path: [C.takamatsu, C.matsuyama] },
  { major: false, path: [C.takamatsu, C.kochi] },
  { major: false, path: [C.kitakyushu, C.oita, C.miyazaki, C.kagoshima] },
  { major: false, path: [C.fukuoka, C.nagasaki] },
  { major: false, path: [C.sendai, C.akita] },
];

/** City labels. minK is the zoom (px per degree) from which the label appears. */
export const LABELS: { name: string; at: LatLng; minK: number }[] = [
  { name: "Tokyo", at: C.tokyo, minK: 0 },
  { name: "Osaka", at: C.osaka, minK: 0 },
  { name: "Nagoya", at: C.nagoya, minK: 0 },
  { name: "Fukuoka", at: C.fukuoka, minK: 0 },
  { name: "Sendai", at: C.sendai, minK: 0 },
  { name: "Hiroshima", at: C.hiroshima, minK: 60 },
  { name: "Niigata", at: C.niigata, minK: 60 },
  { name: "Kobe", at: C.kobe, minK: 160 },
  { name: "Kyoto", at: C.kyoto, minK: 160 },
  { name: "Yokohama", at: C.yokohama, minK: 160 },
  { name: "Saitama", at: C.saitama, minK: 160 },
  { name: "Chiba", at: C.chiba, minK: 160 },
  { name: "Kawasaki", at: C.kawasaki, minK: 400 },
  { name: "Kawagoe", at: C.kawagoe, minK: 400 },
  { name: "Hachioji", at: C.hachioji, minK: 400 },
  { name: "Funabashi", at: C.funabashi, minK: 400 },
  { name: "Narita", at: C.narita, minK: 400 },
  { name: "Sagamihara", at: C.sagamihara, minK: 400 },
  { name: "Itami", at: C.itami, minK: 400 },
  { name: "Sakai", at: C.sakai, minK: 400 },
  { name: "Komaki", at: C.komaki, minK: 400 },
  { name: "Kawaguchi", at: [35.81, 139.72], minK: 600 },
  { name: "Koshigaya", at: C.koshigaya, minK: 600 },
];
