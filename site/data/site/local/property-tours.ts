/**
 * /jp/property-tours: Local_PropertyTours (Primary wireframes 1340:77584, mobile 1340:77585), verbatim, with the
 * clicked state and annotation beside it (1258:29656, 1258:29671, 1258:29850): clicking a pin opens a card on
 * the map and highlights the matching row; the same pin again, the close icon or the map clears both; one pin at
 * a time; past tours have no pin. Sign-up goes to HubSpot (not part of the prototype, so inert).
 * Pin positions are the property locations (Higashi-Ogishima 2 and Itami from the property search data).
 */
import { JP } from "./shared";

export type Tour = {
  id: string;
  date: string;
  time: string;
  name: string;
  address: string;
  past?: boolean;
  /** Map pin (upcoming tours only): label and [lat, lng] */
  pin?: { label: string; at: [number, number] };
};

export const JP_TOURS_INTRO = {
  breadcrumb: [
    { label: "Our portfolio", href: JP.portfolio },
    { label: "Properties", href: JP.properties },
    { label: "Property tours", href: null },
  ],
  title: "Property tours",
  body: "[Overview of property tours and their benefits, to be supplied by ESR Japan. Why a visitor should come and see a facility in person before they commit.]",
};

export const JP_TOURS: Tour[] = [
  {
    id: "tour-1",
    date: "18 Nov 2026",
    time: "10:00 – 12:00",
    name: "[Event name]",
    address: "Higashi-Ogishima, Kawasaki-ku, Kawasaki, Kanagawa",
    pin: { label: "[Event]", at: [35.488, 139.752] },
  },
  {
    id: "tour-2",
    date: "26 Nov 2026",
    time: "13:30 – 15:30",
    name: "[Event name]",
    address: "Sachiura, Kanazawa-ku, Yokohama, Kanagawa",
    pin: { label: "[Event]", at: [35.33, 139.635] },
  },
  {
    id: "tour-3",
    date: "9 Dec 2026",
    time: "10:00 – 12:00",
    name: "[Event name]",
    address: "Itami, Hyogo",
    pin: { label: "[Event]", at: [34.772, 135.425] },
  },
  { id: "tour-4", date: "14 Oct 2026", time: "10:00 – 12:00", name: "[Event name]", address: "Ukishima, Kawasaki-ku, Kawasaki, Kanagawa", past: true },
  { id: "tour-5", date: "2 Sep 2026", time: "14:00 – 16:00", name: "[Event name]", address: "Yako, Kawasaki-ku, Kawasaki, Kanagawa", past: true },
];

export const JP_TOURS_COPY = {
  upcomingTitle: "Upcoming tours",
  upcomingCount: "3 upcoming",
  mapHint: "Tap a pin to jump to that tour",
  listTitle: "All tours",
  listSub: "Listed most to least recent. Past tours stay published for reference.",
  pastLabel: "Past tours",
  pastBadge: "Past event",
  selectedBadge: "Selected on map",
  signUp: "Sign-up",
  signUpClosed: "Sign-up closed",
  /** HubSpot sign-up (not part of the prototype) */
  signUpHref: null as string | null,
  close: "Close",
};

export const JP_TOURS_PROPERTIES = {
  title: "Featured properties",
  cards: [
    { region: "Kanagawa", title: "Higashi-Ogishima Distribution Centre 2" },
    { region: "Kanagawa", title: "Yokohama Sachiura Distribution Centre 3" },
    { region: "Hyogo", title: "Itami Distribution Centre" },
  ],
  cta: "View property",
  /** Property detail pages are not part of the prototype */
  href: null as string | null,
};

export const JP_TOURS_NEWSLETTER = {
  title: "Hear about the next tour",
  body: "Sign up and we will let you know when a tour is scheduled near you.",
  submitLabel: "Sign up",
};
