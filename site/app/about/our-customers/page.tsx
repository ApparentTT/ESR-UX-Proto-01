import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { IndustriesWeServe } from "@/components/sections/customers/IndustriesWeServe";
import { ContactCtaBand } from "@/components/sections/forms/ContactCtaBand";
import {
  CUSTOMERS_CONTACT_CTA,
  CUSTOMERS_DATA_CENTRES,
  CUSTOMERS_INDUSTRIES,
  CUSTOMERS_INTRO,
  CUSTOMERS_PORTFOLIO,
  CUSTOMERS_STORIES,
  CUSTOMERS_STORIES_HEADING,
  CUSTOMERS_TRUSTED,
} from "@/data/site/pages/our-customers";

export const metadata: Metadata = { title: "Our customers | ESR — website prototype" };

/**
 * /about/our-customers: Group_OurCustomers (Figma 1289:110877; mobile 1289:110885), section 924:20386.
 * "Industries we serve" hover state 1416:98770 (mobile 1463:46623). Header active item: About.
 */
export default function OurCustomersPage() {
  return (
    <PageShell>
      {/* Our customers (h1) */}
      <PageIntro title={CUSTOMERS_INTRO.title} body={CUSTOMERS_INTRO.body} pb="md" />
      {/* Industries we serve: interactive donut + sector list */}
      <IndustriesWeServe {...CUSTOMERS_INDUSTRIES} />
      {/* Trusted by businesses across Asia Pacific (no "Explore more" button) */}
      <LogoMarquee {...CUSTOMERS_TRUSTED} />
      {/* Featured customer stories (inert) */}
      <SectionHeading title={CUSTOMERS_STORIES_HEADING} />
      <MediaCardGrid variant="featured3" cards={CUSTOMERS_STORIES} />
      {/* Our portfolio → /portfolio */}
      <FeatureBand {...CUSTOMERS_PORTFOLIO} />
      {/* Data centres, image left → /portfolio/data-centres */}
      <SplitBlock imageSide="left" leftLayout="equal" {...CUSTOMERS_DATA_CENTRES} />
      {/* Talk to us about your next facility → /contact */}
      <ContactCtaBand {...CUSTOMERS_CONTACT_CTA} />
    </PageShell>
  );
}
