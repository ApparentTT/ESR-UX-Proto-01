/**
 * CONTACT page content (inventory B40, B41, B42; contact.md §2–4), verbatim from the wireframes.
 * Also holds the two small contact bands used elsewhere: DC §10 (B24) and CAP §8 (B39).
 *
 * Links: the route emails, jobs.esr.com, office phones and "Get directions" are external
 * destinations that are not wireframed, so every href here is null (inert).
 */
import type { EnquiryRoute } from "@/components/sections/forms/EnquiryRoutes";
import type { Office, OfficeRegionId } from "@/components/sections/forms/OfficeLocations";
import type { ContactEnquiryFormProps } from "@/components/sections/forms/ContactEnquiryForm";
import type { ContactPersonBandProps } from "@/components/sections/forms/ContactPersonBand";
import type { ContactCtaBandProps } from "@/components/sections/forms/ContactCtaBand";

/* ------------------------------------------------------------------ §2 Enquiry routes */

export const ENQUIRY_ROUTES: EnquiryRoute[] = [
  {
    icon: "help",
    title: "General enquiry",
    description: "Anything that does not fit the categories below.",
    link: { label: "esrgroup@esr.com", icon: "mail", href: null },
  },
  {
    icon: "warehouse",
    title: "Leasing",
    description: "Space to lease, build to suit and pre-lease enquiries.",
    link: { label: "leasing@esr.com", icon: "mail", href: null },
  },
  {
    icon: "trending_up",
    title: "Investor relations",
    description: "Fund, capital partnership and investor enquiries.",
    link: { label: "ir@esr.com", icon: "mail", href: null },
  },
  {
    icon: "campaign",
    title: "Media",
    description: "Interviews, comment and media assets.",
    link: { label: "media@esr.com", icon: "mail", href: null },
  },
  {
    icon: "work",
    title: "Careers",
    description: "Open roles across every market.",
    link: { label: "jobs.esr.com", icon: "open_in_new", href: null },
  },
];

/* ------------------------------------------------------------------ §3 Enquiry form */

export const CONTACT_ENQUIRY_FORM: ContactEnquiryFormProps = {
  title: "Send us a message",
  body: "Pick the type of enquiry and we will send it to the right team. We aim to come back to you within two business days.",
  // Options are not drawn: they mirror the five route titles (contact.md open question 2).
  enquiryTypes: ["General enquiry", "Leasing", "Investor relations", "Media", "Careers"],
  optIn: "Keep me updated on ESR news and property availability",
  submitLabel: "Submit",
  // No success state is designed (contact.md open question 3).
  successMessage: "[Thank you message to be confirmed]",
};

/* ------------------------------------------------------------------ §4 Office locations */

export const OFFICE_REGIONS: { id: OfficeRegionId; label: string }[] = [
  { id: "all", label: "All regions" },
  { id: "asia", label: "Asia" },
  { id: "greater-china", label: "Greater China" },
  { id: "oceania", label: "Oceania" },
  { id: "southeast-asia", label: "Southeast Asia" },
];

/**
 * The six drawn offices, in reading order. The region mapping is proposed in contact.md §4b
 * (not specified in Figma): Asia = Tokyo, Osaka, Seoul, Mumbai; Greater China = Hong Kong;
 * Southeast Asia = Singapore; Oceania = none.
 */
export const OFFICES: Office[] = [
  {
    country: "Japan",
    city: "Tokyo",
    address: "Level 13, TriSeven Roppongi, 7-7-7, Roppongi, Minato-ku, Tokyo",
    phone: "+81 3 4578 7121",
    region: "asia",
  },
  {
    country: "Japan",
    city: "Osaka",
    address: "Ujiden Bldg. 6th Floor, 4-8-17, Nishitemma, Kita-ku, Osaka City, Osaka 530-0047",
    phone: "+81 6 4560 4960",
    region: "asia",
  },
  {
    country: "Singapore",
    city: "Singapore",
    address: "5 Temasek Boulevard, #12-01 Suntec Tower 5, Singapore 038985",
    phone: "+65 6835 9232",
    region: "southeast-asia",
  },
  {
    country: "Hong Kong",
    city: "Hong Kong",
    address: "Suites 2905-2906, Two Exchange Square, 8 Connaught Place, Central, Hong Kong",
    phone: "+852 2376 9600",
    region: "greater-china",
  },
  {
    country: "South Korea",
    city: "Seoul",
    address: "35F Three IFC, 10 Gukjegeumyung-ro, Yeongdeungpo-gu, Seoul",
    phone: "+82 2 6331 0757",
    region: "asia",
  },
  {
    country: "India",
    city: "Mumbai",
    address:
      "Parinee Crescenzo, Office No 803, 8th Floor, B wing, Plot No. C38 & 39, G Block Bandra Kurla Complex, Bandra (East), Mumbai 400051",
    // Copied exactly as drawn.
    phone: "+91 2 6280 0000",
    region: "asia",
  },
];

export const OFFICE_LOCATIONS = {
  title: "Office locations",
  sub: "More than 20 offices across Asia Pacific.",
  regions: OFFICE_REGIONS,
  offices: OFFICES,
  directionsLabel: "Get directions",
  showAllLabel: "Show all offices",
  // No copy is designed for an empty region (Oceania): proposed in the inventory, flagged.
  emptyMessage: "No offices to show for this region.",
};

/* ------------------------------------------------------------------ DC §10 and CAP §8 bands */

export const DC_CONTACT_PERSON: ContactPersonBandProps = {
  title: "Talk to our data centre team",
  sub: "For capacity, land or partnership enquiries, speak to the person who runs it.",
  contact: {
    name: "Contact name",
    role: "Head of Data Centres, Asia Pacific",
    // Two spaces either side of the "·", as drawn.
    details: "Email address  ·  Phone number",
  },
};

export const CAP_CONTACT_CTA: ContactCtaBandProps = {
  title: "Talk to us about your next facility",
  body: "Tell us what you need and we'll put you in touch with the right team in your market.",
  cta: { label: "Contact us", href: "/contact" },
};
