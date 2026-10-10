/**
 * Document lists and disclosure accordions, verbatim.
 * - CGOV §3 "Documents" (`about-corporate-governance.md`, B36 downloadRows): 4 + 6 + 4 rows.
 * - SGOV §7 "Policies" (`sustainability-governance.md`, B36 dottedLeader): 3 + 3 rows.
 * - SGOV §6 "Past disclosures by year" (B17 Accordion).
 * - PROP §10 / DEV §10 "Frequently asked questions" (B17 Accordion), the same placeholder content on both pages.
 * No PDFs exist in the prototype, so every document link is inert (href null).
 */
import type { DocumentListProps } from "@/components/sections/listings/DocumentList";
import type { AccordionProps } from "@/components/sections/listings/Accordion";

/** CGOV §3: "Documents". */
export const CGOV_DOCUMENTS: Omit<DocumentListProps, "variant"> = {
  title: "Documents",
  sub: "Our governance documentation, organised by type. All available as PDF.",
  format: "PDF",
  groups: [
    {
      label: "Board and committees",
      documents: [
        { name: "Board charter", href: null },
        { name: "Audit committee charter", href: null },
        { name: "Remuneration committee charter", href: null },
        { name: "Nomination committee charter", href: null },
      ],
    },
    {
      label: "Policies",
      documents: [
        { name: "Code of conduct", href: null },
        { name: "Anti-bribery and corruption policy", href: null },
        { name: "Whistleblower policy", href: null },
        { name: "Diversity and inclusion policy", href: null },
        { name: "Continuous disclosure policy", href: null },
        { name: "Securities trading policy", href: null },
      ],
    },
    {
      label: "Reporting and constitution",
      documents: [
        { name: "Corporate governance statement", href: null },
        { name: "Annual report", href: null },
        { name: "Constitution", href: null },
        { name: "Modern slavery statement", href: null },
      ],
    },
  ],
  footnote: "Documents are reviewed annually. Last updated [date].",
};

/** SGOV §7: "Policies" (pure black text, as drawn). */
export const SGOV_POLICIES: Omit<DocumentListProps, "variant"> = {
  title: "Policies",
  sub: "Our published ESG policies, available to download.",
  format: "PDF",
  groups: [
    {
      label: "Environment",
      documents: [
        { name: "Environmental policy", href: null },
        { name: "Climate change policy", href: null },
        { name: "Biodiversity policy", href: null },
      ],
    },
    {
      label: "Social and governance",
      documents: [
        { name: "Modern slavery statement", href: null },
        { name: "Supplier code of conduct", href: null },
        { name: "Whistleblower policy", href: null },
      ],
    },
  ],
};

/**
 * SGOV §6 panel line: "Sustainability report, ESG data pack, TCFD disclosure, assurance statement",
 * split into four inert links with identical visible text. 2024 and 2023 are not designed and reuse it.
 */
const DISCLOSURE_LINKS = [
  { label: "Sustainability report", href: null },
  { label: "ESG data pack", href: null },
  { label: "TCFD disclosure", href: null },
  { label: "assurance statement", href: null },
];

/** SGOV §6: 2025 open by default. */
export const SGOV_PAST_DISCLOSURES: AccordionProps = {
  title: "Past disclosures by year",
  items: [
    { label: "2025", links: DISCLOSURE_LINKS },
    { label: "2024", links: DISCLOSURE_LINKS },
    { label: "2023", links: DISCLOSURE_LINKS },
  ],
  defaultOpen: 0,
};

/** PROP §10 and DEV §10. "accordian" is the wireframe's spelling, kept verbatim. Item 1 open by default. */
const FAQ_ANSWER = "This is some subtext which appears after expanding the accordian.";

export const PORTFOLIO_FAQ: AccordionProps = {
  title: "Frequently asked questions",
  items: [
    { label: "Label", content: FAQ_ANSWER },
    { label: "Label", content: FAQ_ANSWER },
    { label: "Label", content: FAQ_ANSWER },
  ],
  defaultOpen: 0,
};
