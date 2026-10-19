/**
 * Page-only copy for /about/careers/job-alerts ("Stay up to date on vacancies", from the group and local
 * Our portfolio menus). Not wireframed: added from review feedback, with the copy as supplied.
 */
import { NAV_MARKETS } from "@/config/nav";
import type { EnquirySuccessCopy } from "@/components/sections/forms/formPresets";

export const JOB_ALERTS_INTRO = {
  title: "Stay up to date on vacancies",
  body: "Tell us where and what you'd like to work on, and we'll email you when a matching role opens at ESR.",
};

export const JOB_ALERTS_FORM = {
  market: { label: "Market", placeholder: "Select markets", options: NAV_MARKETS.map((m) => m.name) },
  area: {
    label: "Area of interest",
    placeholder: "Select an area",
    options: ["Investment management", "Development", "Leasing and asset management", "Data centres", "Corporate functions"],
  },
  frequency: { label: "Frequency", options: ["Instantly", "Weekly digest"], defaultValue: "Instantly" },
  consent: "By checking this box, I agree to receive job alerts and recruitment updates from ESR. You can unsubscribe at any time.",
  submitLabel: "Sign up for alerts",
  success: {
    title: "You're signed up",
    body: "We'll email you when a matching role opens.",
    resetLabel: "Sign up another email address",
  } satisfies EnquirySuccessCopy,
};

/** The band under the form: the external jobs board (inert, as "See all open roles" on Our people) */
export const JOB_ALERTS_OPEN_ROLES = {
  title: "Looking for open roles now?",
  cta: { label: "See all open roles", href: null },
};
