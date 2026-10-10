/**
 * Page-only copy for /about/corporate-governance (CGOV), verbatim from about-corporate-governance.md.
 * The document lists (§3) are in data/site/documents.ts (CGOV_DOCUMENTS).
 */
import type { SplitBlockCta } from "@/components/sections/blocks/SplitBlock";

/** CGOV §1 (PageIntro default; the hidden button and image are not built) */
export const CGOV_INTRO = {
  title: "Corporate governance",
  body: "How ESR is governed, who is accountable for what, and the documentation behind it. Everything on this page is available to download.",
};

/** CGOV §4 "Our leadership" teaser on the #F2F2F2 band (→ surface) → /about/leadership */
export const CGOV_LEADERSHIP: { title: string; body: string; cta: SplitBlockCta } = {
  title: "Our leadership",
  body: "The board and executive team accountable for the frameworks on this page.",
  cta: { label: "Meet our leadership", href: "/about/leadership" },
};
