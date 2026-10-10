import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { Spacer } from "@/components/sections/blocks/Spacer";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { SGOV_GOVERN_CARDS, SGOV_GOVERN_HEADING } from "@/components/sections/cards/presets";
import { Accordion } from "@/components/sections/listings/Accordion";
import { DocumentList } from "@/components/sections/listings/DocumentList";
import { SGOV_PAST_DISCLOSURES, SGOV_POLICIES } from "@/data/site/documents";
import {
  SGOV_DISCLOSURE,
  SGOV_INTRO,
  SGOV_PAST_DISCLOSURES_ID,
  SGOV_SUSTAINABILITY,
} from "@/data/site/pages/sustainability";

export const metadata: Metadata = { title: "Governance and management | ESR — website prototype" };

/** /sustainability/governance (SGOV): Group_SustainabilityGovernanceAndManagement. Header active item: Sustainability. */
export default function SustainabilityGovernancePage() {
  return (
    <PageShell>
      {/* §1 */}
      <PageIntro title={SGOV_INTRO.title} body={SGOV_INTRO.body} />
      {/* §2 the empty "OverviewTitle" block, kept as space (24 / 48 / 98) */}
      <Spacer />
      {/* §3 "How we govern sustainability": inline SemiBold 24 heading + 3 static cards */}
      <MediaCardGrid variant="products3" heading={SGOV_GOVERN_HEADING} cards={SGOV_GOVERN_CARDS} />
      {/* §4 approach image (the hidden text block is not built) */}
      <FullWidthImage />
      {/* §5 "Disclosure 2026": one right chevron that scrolls to §6; "Download the report" is inert */}
      <FeatureBand
        controls="arrow-only"
        arrowTargetId={SGOV_PAST_DISCLOSURES_ID}
        arrowLabel="Go to past disclosures"
        title={SGOV_DISCLOSURE.title}
        body={SGOV_DISCLOSURE.body}
        actions={SGOV_DISCLOSURE.actions}
      />
      {/* §6 "Past disclosures by year": 2025 open, single-open, inert download links */}
      <Accordion {...SGOV_PAST_DISCLOSURES} id={SGOV_PAST_DISCLOSURES_ID} />
      {/* §7 "Policies": dotted-leader document list, inert PDFs */}
      <DocumentList variant="dottedLeader" {...SGOV_POLICIES} />
      {/* §8 "Sustainability at ESR" → /sustainability */}
      <SplitBlock title={SGOV_SUSTAINABILITY.title} body={SGOV_SUSTAINABILITY.body} cta={SGOV_SUSTAINABILITY.cta} />
    </PageShell>
  );
}
