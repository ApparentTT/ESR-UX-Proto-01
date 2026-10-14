import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { FeaturedPropertyCarousel } from "@/components/sections/customers/FeaturedPropertyCarousel";
import { IndustriesWeServe } from "@/components/sections/customers/IndustriesWeServe";
import { ContactCtaBand } from "@/components/sections/forms/ContactCtaBand";
import {
  JP_CUSTOMERS_CONTACT_CTA,
  JP_CUSTOMERS_DATA_CENTRES,
  JP_CUSTOMERS_FEATURED,
  JP_CUSTOMERS_INDUSTRIES,
  JP_CUSTOMERS_INTRO,
  JP_CUSTOMERS_PORTFOLIO,
  JP_CUSTOMERS_STORIES,
  JP_CUSTOMERS_STORIES_HEADING,
  JP_CUSTOMERS_TRUSTED,
} from "@/data/site/local/our-customers";

export const metadata: Metadata = { title: "Our customers | ESR Japan — website prototype" };

/**
 * /jp/our-customers: Local_OurCustomers (Figma 1289:110887; mobile 1289:110895), section 924:20386, drawn for
 * Australia and New Zealand and shown here for Japan. "Industries we serve" hover state 1416:98770 (mobile 1463:46623).
 */
export default function JapanOurCustomersPage() {
  return (
    <LocalPageShell>
      {/* Our customers (h1) */}
      <PageIntro title={JP_CUSTOMERS_INTRO.title} body={JP_CUSTOMERS_INTRO.body} pb="lg" />
      {/* Industries we serve: interactive donut + sector list */}
      <IndustriesWeServe {...JP_CUSTOMERS_INDUSTRIES} />
      {/* Trusted by businesses across Asia Pacific (no "Explore more" button) */}
      <LogoMarquee {...JP_CUSTOMERS_TRUSTED} />
      {/* Featured customer stories (inert), grey band */}
      <SectionHeading title={JP_CUSTOMERS_STORIES_HEADING} bg="surface" />
      <MediaCardGrid variant="featured3" bg="surface" cards={JP_CUSTOMERS_STORIES} />
      {/* Featured Properties carousel + Search all properties */}
      <FeaturedPropertyCarousel {...JP_CUSTOMERS_FEATURED} />
      {/* Our portfolio → /jp/developments */}
      <FeatureBand {...JP_CUSTOMERS_PORTFOLIO} />
      {/* Data centres, image right → group data centres */}
      <SplitBlock {...JP_CUSTOMERS_DATA_CENTRES} />
      {/* Talk to us about your next facility (white band) → /contact */}
      <ContactCtaBand {...JP_CUSTOMERS_CONTACT_CTA} />
    </LocalPageShell>
  );
}
