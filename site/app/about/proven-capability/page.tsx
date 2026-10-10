import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FeaturedProperties } from "@/components/sections/cards/FeaturedProperties";
import { CAP_FEATURED_PROPERTY, CAP_PROPERTY_CARDS } from "@/components/sections/cards/presets";
import { CaseStudyListing } from "@/components/sections/listings/CaseStudyListing";
import { ContactCtaBand } from "@/components/sections/forms/ContactCtaBand";
import { CAP_LISTING } from "@/data/site/caseStudies";
import { CAP_CONTACT_CTA } from "@/data/site/offices";
import {
  CAP_FEATURED_PROPERTIES_HEADING,
  CAP_INTRO,
  CAP_INVEST,
  CAP_PROPERTIES,
} from "@/data/site/pages/about-proven-capability";

export const metadata: Metadata = { title: "Proven capability | ESR — website prototype" };

/** /about/proven-capability (CAP): Group_ProvenCapability. Header active item: About. */
export default function ProvenCapabilityPage() {
  return (
    <PageShell>
      {/* §1 default intro; ~42px below the sub text before the grey listing band */}
      <PageIntro title={CAP_INTRO.title} body={CAP_INTRO.body} pb="sm" />
      {/* §2–3 merged: "Case studies" h2, Theme / Market / Asset type + chips + Sort, results line,
          6 inert case-study cards. Loads in the designed state (Active management + Japan chips). */}
      <CaseStudyListing variant="capCaseStudies" {...CAP_LISTING} />
      {/* §4 */}
      <SectionHeading title={CAP_FEATURED_PROPERTIES_HEADING} />
      {/* §5 1 large + 2 x 2 property cards, all inert */}
      <FeaturedProperties featured={CAP_FEATURED_PROPERTY} cards={CAP_PROPERTY_CARDS} />
      {/* §6 "Properties" static grey band → /portfolio/properties */}
      <FeatureBand title={CAP_PROPERTIES.title} body={CAP_PROPERTIES.body} actions={CAP_PROPERTIES.actions} />
      {/* §7 "Invest with ESR" → /investors */}
      <SplitBlock title={CAP_INVEST.title} body={CAP_INVEST.body} cta={CAP_INVEST.cta} />
      {/* §8 "Talk to us about your next facility" → /contact */}
      <ContactCtaBand {...CAP_CONTACT_CTA} />
    </PageShell>
  );
}
