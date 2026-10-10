import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { CaseStudyListing } from "@/components/sections/listings/CaseStudyListing";
import { SCS_LISTING } from "@/data/site/caseStudies";
import { SCS_GOVERNANCE, SCS_INTRO } from "@/data/site/pages/sustainability";

export const metadata: Metadata = { title: "Sustainability case studies | ESR — website prototype" };

/** /sustainability/case-studies (SCS): Group_SustainabilityCaseStudies. Header active item: Sustainability. */
export default function SustainabilityCaseStudiesPage() {
  return (
    <PageShell>
      {/* §1 (this hero keeps its 72px bottom padding, unlike the other sustainability heroes) */}
      <PageIntro title={SCS_INTRO.title} body={SCS_INTRO.body} pb="lg" />
      {/* §2 Country filter + count, 6 case-study cards (inert), "Load more case studies".
          No visible section heading, so the card titles are h2s under the page h1. */}
      <CaseStudyListing variant="caseStudies" {...SCS_LISTING} />
      {/* §3 "Governance" → /sustainability/governance */}
      <SplitBlock title={SCS_GOVERNANCE.title} body={SCS_GOVERNANCE.body} cta={SCS_GOVERNANCE.cta} />
    </PageShell>
  );
}
