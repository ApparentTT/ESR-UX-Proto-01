import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { JapanMap } from "@/components/sections/local/JapanMap";
import { LocalKeyStats } from "@/components/sections/local/LocalKeyStats";
import { LocalPropertyCards } from "@/components/sections/local/LocalPropertyCards";
import { PORT_CUSTOMERS } from "@/data/site/logoMarquees";
import { JP_INVEST, JP_NEWSLETTER, jpFeaturedProperties } from "@/data/site/local/shared";
import {
  JP_PORT_CASE_STUDY_BAND,
  JP_PORT_FEATURED_HEADING,
  JP_PORT_INTRO,
  JP_PORT_MAP_REGIONS,
  JP_PORT_MAP_STATS,
  JP_PORT_OUR_ASSETS,
  JP_PORT_STATS,
} from "@/data/site/local/portfolio";

export const metadata: Metadata = { title: "Our portfolio | ESR Japan — website prototype" };

/** /jp/portfolio: Japan portfolio overview (Key wireframes R2_local_PortfolioOverview-Japan 1347:60557; mobile 1347:60556). */
export default function JapanPortfolioPage() {
  return (
    <LocalPageShell>
      {/* Portfolio overview (h1) */}
      <PageIntro title={JP_PORT_INTRO.title} body={JP_PORT_INTRO.body} />
      {/* We span + Japan map */}
      <JapanMap stats={JP_PORT_MAP_STATS} regions={JP_PORT_MAP_REGIONS} />
      {/* Our assets */}
      <BentoAccordion {...JP_PORT_OUR_ASSETS} />
      {/* Scale that delivers */}
      <LocalKeyStats {...JP_PORT_STATS} />
      {/* Featured properties and developments */}
      <SectionHeading {...JP_PORT_FEATURED_HEADING} />
      <LocalPropertyCards cards={jpFeaturedProperties("sqm")} />
      {/* Case study carousel */}
      <FeatureBand controls="carousel-lg" {...JP_PORT_CASE_STUDY_BAND} />
      {/* Our customers */}
      <LogoMarquee {...PORT_CUSTOMERS} />
      {/* Invest with ESR */}
      <SplitBlock {...JP_INVEST} />
      {/* Newsletter */}
      <FormBlock variant="newsletter" {...JP_NEWSLETTER} />
    </LocalPageShell>
  );
}
