import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { QuoteCarousel } from "@/components/sections/carousels/QuoteCarousel";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { ContactCtaBand } from "@/components/sections/forms/ContactCtaBand";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { Accordion } from "@/components/sections/listings/Accordion";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { ServiceSteps } from "@/components/sections/local/ServiceSteps";
import { FeaturedPropertiesBlock } from "@/components/sections/local/FeaturedPropertiesBlock";
import { PropertySearchEntry } from "@/components/sections/local/PropertySearchEntry";
import { PROP_CUSTOMERS } from "@/data/site/logoMarquees";
import { PORTFOLIO_FAQ } from "@/data/site/documents";
import { JP_INVEST, JP_NEWSLETTER, JP_SEARCH_ENTRY } from "@/data/site/local/shared";
import {
  JP_PROP_FEATURED,
  JP_PROP_INTRO,
  JP_PROP_OUR_ASSETS,
  JP_PROP_QUOTES,
  JP_PROP_SERVICES,
  JP_PROP_TOURS,
} from "@/data/site/local/properties";

export const metadata: Metadata = { title: "Properties | ESR Japan — website prototype" };

/** /jp/properties: Japan properties (Key wireframes R2Local_Properties 1347:69176; mobile 1347:69177). */
export default function JapanPropertiesPage() {
  return (
    <LocalPageShell>
      {/* Properties (h1) */}
      <PageIntro title={JP_PROP_INTRO.title} body={JP_PROP_INTRO.body} />
      {/* Let us take care of the property management */}
      <ServiceSteps {...JP_PROP_SERVICES} />
      {/* Featured properties + View all properties */}
      <FeaturedPropertiesBlock {...JP_PROP_FEATURED} />
      {/* Find space for your business */}
      <PropertySearchEntry {...JP_SEARCH_ENTRY} />
      {/* Customer quotes */}
      <QuoteCarousel {...JP_PROP_QUOTES} />
      {/* Our customers */}
      <LogoMarquee {...PROP_CUSTOMERS} />
      {/* Property tours */}
      <ContactCtaBand {...JP_PROP_TOURS} />
      {/* Our asset classes (without this page's own Properties sub-card) */}
      <BentoAccordion {...JP_PROP_OUR_ASSETS} />
      {/* Invest with ESR */}
      <SplitBlock {...JP_INVEST} />
      {/* FAQ */}
      <Accordion {...PORTFOLIO_FAQ} />
      {/* Newsletter */}
      <FormBlock variant="newsletter" {...JP_NEWSLETTER} />
    </LocalPageShell>
  );
}
