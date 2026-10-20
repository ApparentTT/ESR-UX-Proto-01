/**
 * Configs of the shared Figma "Form" block (inventory B18), verbatim from the page specs.
 * Plain module (no "use client") so server pages can read the presets.
 */

export type FormBlockVariant = "newsletter" | "dcEnquiry" | "investorEnquiry" | "mediaEnquiry" | "careers";

/** Field keys in drawn order. "name" is the First name + Last name row. */
export type FormFieldKey = "name" | "email" | "country" | "message" | "consent";
/** Keys that can be required ("name" expands to firstName + lastName). */
export type FormRequiredKey = "firstName" | "lastName" | "email" | "country" | "message" | "consent";

/** Success card copy (Figma "Enquiry form — states", success 1265:33904). */
export type EnquirySuccessCopy = {
  title: string;
  body: string;
  /** Reference chip, e.g. "[XXXXXX]" (omitted for the newsletter) */
  reference?: string;
  /** Dark primary action (drawn on the investor enquiry only) */
  primary?: { label: string; href: string | null };
  /** Outline secondary: brings the empty form back */
  resetLabel: string;
};

/**
 * The drawn investor success copy, verbatim; the other enquiry forms keep the same heading and wording with
 * their own team (from each form's intro). Only the investor forms carry the drawn "Explore our funds" action.
 */
const enquirySuccess = (team: string, primary?: EnquirySuccessCopy["primary"]): EnquirySuccessCopy => ({
  title: "Thanks, your enquiry is with us",
  body: `A member of ${team} will be in touch within two business days. We have sent a copy to the email address you gave us.`,
  reference: "[XXXXXX]",
  primary,
  resetLabel: "Send another enquiry",
});

export const INVESTOR_ENQUIRY_SUCCESS = enquirySuccess("our capital partnerships team", { label: "Explore our funds", href: "/investors#flagship-funds" });
export const CONTACT_ENQUIRY_SUCCESS = enquirySuccess("our team");

/** Field error for a malformed email (drawn, 1265:33813) */
export const EMAIL_INVALID = "Enter a valid email address so we can reply";

export type FormBlockConfig = {
  title: string;
  body: string;
  fields: FormFieldKey[];
  required: FormRequiredKey[];
  submitLabel: string;
  /** Success card shown in place of the form row after the loading state */
  success: EnquirySuccessCopy;
  /** Copy column alignment at desktop: every instance is top-aligned (client feedback) */
  align: "start" | "center";
  bg: "grey" | "white";
};

/** "Select country" options are not drawn: the 11 markets from the map nav (portfolio.md §9). */
export const COUNTRY_OPTIONS = [
  "Greater China",
  "India",
  "Indonesia",
  "Japan",
  "Malaysia",
  "Singapore",
  "South Korea",
  "Thailand",
  "Vietnam",
  "Australia & New Zealand",
  "Saudi Arabia",
];

/** Consent copy on every Form instance (verbatim). */
export const CONSENT_COPY =
  "By checking this box, I agree to receive marketing communications, property updates, and market insights from ESR. You can unsubscribe at any time.";

/** Field labels and placeholders (verbatim, including the capital M in "Enter your Message"). */
export const FORM_FIELD_COPY = {
  firstName: { label: "First name", placeholder: "Enter your first name" },
  lastName: { label: "Last name", placeholder: "Enter your last name" },
  email: { label: "Email", placeholder: "Enter your email address" },
  country: { label: "Country of interest", placeholder: "Select country" },
  message: { label: "Message", placeholder: "Enter your Message" },
} as const;

export const MESSAGE_MAX = 250;

export const FORM_PRESETS: Record<FormBlockVariant, FormBlockConfig> = {
  /** PORT §9 (center), PROP §11 (center), DEV §11 (start) */
  newsletter: {
    title: "Stay up to date",
    body: "Sign up to our newsletter",
    fields: ["name", "email", "country", "consent"],
    required: ["firstName", "lastName", "email", "consent"],
    submitLabel: "Submit",
    success: {
      title: "Thanks, you're subscribed",
      body: "We have sent a confirmation to the email address you gave us.",
      resetLabel: "Sign up another email address",
    },
    align: "start",
    bg: "grey",
  },
  /** DC §11 */
  dcEnquiry: {
    title: "Enquire about a data centre",
    body: "Tell us what capacity you need and our data centre team will come back to you.",
    fields: ["name", "email", "message", "consent"],
    required: ["firstName", "lastName", "email", "message"],
    submitLabel: "Send enquiry",
    success: enquirySuccess("our data centre team"),
    align: "start",
    bg: "grey",
  },
  /** INV §9 */
  investorEnquiry: {
    title: "Enquire about investing with ESR",
    body: "Tell us what you're looking for and our capital partnerships team will come back to you.",
    fields: ["name", "email", "message", "consent"],
    required: ["firstName", "lastName", "email", "message"],
    submitLabel: "Submit",
    success: INVESTOR_ENQUIRY_SUCCESS,
    align: "start",
    bg: "grey",
  },
  /** NEWS §6 and NSR */
  mediaEnquiry: {
    title: "Media enquiries",
    body: "For interviews, comment or assets, tell us what you need and our communications team will come back to you.",
    fields: ["name", "email", "country", "message", "consent"],
    required: ["firstName", "lastName", "email", "message"],
    submitLabel: "Submit",
    success: enquirySuccess("our communications team"),
    align: "start",
    bg: "grey",
  },
  /** PEOPLE §7 (white band) */
  careers: {
    title: "Careers enquiry",
    body: "Tell us what you are looking for and the ESR people team will come back to you.",
    fields: ["name", "email", "message", "consent"],
    required: ["firstName", "lastName", "email", "message"],
    submitLabel: "Submit",
    success: enquirySuccess("the ESR people team"),
    align: "start",
    bg: "white",
  },
};
