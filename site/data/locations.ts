/**
 * Geography used by the prototype. Real Japanese place names and approximate
 * coordinates only; nothing here describes a property.
 */

export type PrefectureId = "kanagawa" | "tokyo" | "osaka" | "hyogo" | "chiba" | "saitama" | "aichi" | "fukuoka";

export type Prefecture = { id: PrefectureId; name: string };

/** Order matches the wireframe's browse tiles. */
export const PREFECTURES: Prefecture[] = [
  { id: "kanagawa", name: "Kanagawa" },
  { id: "tokyo", name: "Tokyo" },
  { id: "osaka", name: "Osaka" },
  { id: "hyogo", name: "Hyogo" },
  { id: "chiba", name: "Chiba" },
  { id: "saitama", name: "Saitama" },
  { id: "aichi", name: "Aichi" },
  { id: "fukuoka", name: "Fukuoka" },
];

export const PREFECTURE_BY_ID = Object.fromEntries(PREFECTURES.map((p) => [p.id, p])) as Record<PrefectureId, Prefecture>;

export type Locality = {
  /** City (or Tokyo special ward), as shown on cards: "Kawasaki, Kanagawa" */
  city: string;
  /** Ward within the city, used by the typeahead */
  ward?: string;
  prefecture: PrefectureId;
  lat: number;
  lng: number;
};

export const LOCALITIES: Locality[] = [
  { city: "Kawasaki", ward: "Kawasaki-ku", prefecture: "kanagawa", lat: 35.515, lng: 139.735 },
  { city: "Yokohama", ward: "Kanazawa-ku", prefecture: "kanagawa", lat: 35.335, lng: 139.635 },
  { city: "Yokohama", ward: "Tsurumi-ku", prefecture: "kanagawa", lat: 35.5, lng: 139.68 },
  { city: "Sagamihara", prefecture: "kanagawa", lat: 35.57, lng: 139.37 },
  { city: "Atsugi", prefecture: "kanagawa", lat: 35.44, lng: 139.36 },
  { city: "Ota", prefecture: "tokyo", lat: 35.56, lng: 139.72 },
  { city: "Koto", prefecture: "tokyo", lat: 35.65, lng: 139.82 },
  { city: "Edogawa", prefecture: "tokyo", lat: 35.69, lng: 139.87 },
  { city: "Hachioji", prefecture: "tokyo", lat: 35.66, lng: 139.32 },
  { city: "Osaka", ward: "Suminoe-ku", prefecture: "osaka", lat: 34.61, lng: 135.46 },
  { city: "Osaka", ward: "Konohana-ku", prefecture: "osaka", lat: 34.68, lng: 135.43 },
  { city: "Sakai", prefecture: "osaka", lat: 34.57, lng: 135.48 },
  { city: "Ibaraki", prefecture: "osaka", lat: 34.82, lng: 135.57 },
  { city: "Itami", prefecture: "hyogo", lat: 34.785, lng: 135.405 },
  { city: "Amagasaki", prefecture: "hyogo", lat: 34.73, lng: 135.41 },
  { city: "Kobe", ward: "Higashinada-ku", prefecture: "hyogo", lat: 34.715, lng: 135.27 },
  { city: "Funabashi", prefecture: "chiba", lat: 35.69, lng: 139.98 },
  { city: "Ichikawa", prefecture: "chiba", lat: 35.72, lng: 139.93 },
  { city: "Narita", prefecture: "chiba", lat: 35.78, lng: 140.32 },
  { city: "Kawaguchi", prefecture: "saitama", lat: 35.81, lng: 139.72 },
  { city: "Kawagoe", prefecture: "saitama", lat: 35.92, lng: 139.49 },
  { city: "Koshigaya", prefecture: "saitama", lat: 35.89, lng: 139.79 },
  { city: "Nagoya", ward: "Minato-ku", prefecture: "aichi", lat: 35.11, lng: 136.88 },
  { city: "Komaki", prefecture: "aichi", lat: 35.29, lng: 136.91 },
  { city: "Fukuoka", ward: "Higashi-ku", prefecture: "fukuoka", lat: 33.62, lng: 130.42 },
];
