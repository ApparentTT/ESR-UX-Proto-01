import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FeaturedProperties } from "@/components/sections/cards/FeaturedProperties";
import { CAP_FEATURED_PROPERTY, CAP_PROPERTY_CARDS } from "@/components/sections/cards/presets";
import { CaseStudyListing } from "@/components/sections/listings/CaseStudyListing";
import { ContactCtaBand } from "@/components/sections/forms/ContactCtaBand";
import { CAP_CONTACT_CTA } from "@/data/site/offices";
import { JP_CAP_FEATURED_HEADING, JP_CAP_INTRO, JP_CAP_INVEST, JP_CAP_LISTING } from "@/data/site/local/proven-capability";

export const metadata: Metadata = { title: "Proven capability | ESR Japan — website prototype" };

/** /jp/proven-capability: Local_ProvenCapability (Primary wireframes 1289:114664, mobile 1289:114665). Local nav: About. */
export default function JapanProvenCapabilityPage() {
  return (
    <LocalPageShell>
      <PageIntro title={JP_CAP_INTRO.title} body={JP_CAP_INTRO.body} pb="sm" />
      {/* "Local case studies": Theme / Asset type + chip + Sort, results line, 6 inert cards (works like the group listing) */}
      <CaseStudyListing variant="capCaseStudies" {...JP_CAP_LISTING} id="local-case-studies" />
      <SectionHeading title={JP_CAP_FEATURED_HEADING} />
      <FeaturedProperties featured={CAP_FEATURED_PROPERTY} cards={CAP_PROPERTY_CARDS} />
      <SplitBlock {...JP_CAP_INVEST} />
      <ContactCtaBand {...CAP_CONTACT_CTA} />
    </LocalPageShell>
  );
}
