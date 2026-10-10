import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { DocumentList } from "@/components/sections/listings/DocumentList";
import { CGOV_DOCUMENTS } from "@/data/site/documents";
import { CGOV_INTRO, CGOV_LEADERSHIP } from "@/data/site/pages/about-corporate-governance";

export const metadata: Metadata = { title: "Corporate governance | ESR — website prototype" };

/** /about/corporate-governance (CGOV): Group_CorporateGovernance. Header active item: About. */
export default function CorporateGovernancePage() {
  return (
    <PageShell>
      {/* §1 default intro (no bottom padding; the image block supplies the space) */}
      <PageIntro title={CGOV_INTRO.title} body={CGOV_INTRO.body} />
      {/* §2 "Approach": image only (its text column is hidden in the wireframe) */}
      <FullWidthImage />
      {/* §3 "Documents": 3 groups of download rows (all inert) + footnote */}
      <DocumentList variant="downloadRows" {...CGOV_DOCUMENTS} />
      {/* §4 "Our leadership" teaser on the #F2F2F2 band (→ surface) → /about/leadership */}
      <SplitBlock bg="surface" title={CGOV_LEADERSHIP.title} body={CGOV_LEADERSHIP.body} cta={CGOV_LEADERSHIP.cta} />
    </PageShell>
  );
}
