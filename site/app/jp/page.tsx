import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { SplitStatement } from "@/components/sections/blocks/SplitStatement";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { NewsCardRow } from "@/components/sections/cards/NewsCardRow";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { LocalHomeHero } from "@/components/sections/local/LocalHomeHero";
import { PropertySearchEntry } from "@/components/sections/local/PropertySearchEntry";
import { LocalKeyStats } from "@/components/sections/local/LocalKeyStats";
import { LocalPropertyCards } from "@/components/sections/local/LocalPropertyCards";
import { JP_INVEST, JP_SEARCH_ENTRY, jpFeaturedProperties } from "@/data/site/local/shared";
import {
  JP_HOME_EXPLORE_CARDS,
  JP_HOME_EXPLORE_HEADING,
  JP_HOME_FEATURED_HEADING,
  JP_HOME_HERO,
  JP_HOME_LATEST,
  JP_HOME_LATEST_HEADING,
  JP_HOME_STATS,
  JP_HOME_WHO_WE_ARE,
} from "@/data/site/local/home";
import { JP_PORT_OUR_ASSETS } from "@/data/site/local/portfolio";

export const metadata: Metadata = { title: "Home | ESR Japan — website prototype" };

/** /jp: Japan local homepage (Key wireframes R2_Local_homepage_>10Properties 1347:52640; mobile 1347:52641). */
export default function JapanHomePage() {
  return (
    <LocalPageShell>
      {/* Hero (h1) */}
      <LocalHomeHero {...JP_HOME_HERO} />
      {/* Find space for your business: into the ESR Japan property search */}
      <PropertySearchEntry {...JP_SEARCH_ENTRY} />
      {/* Who we are */}
      <SplitStatement {...JP_HOME_WHO_WE_ARE} />
      {/* Scale that delivers: Group / Local toggle */}
      <LocalKeyStats {...JP_HOME_STATS} />
      {/* Featured properties */}
      <SectionHeading title={JP_HOME_FEATURED_HEADING} />
      <LocalPropertyCards cards={jpFeaturedProperties(" sqm")} />
      {/* What we do: the local Portfolio "Our assets" bento, headed "What we do" */}
      <BentoAccordion {...JP_PORT_OUR_ASSETS} heading="What we do" currentHref="/jp" />
      {/* Invest with ESR */}
      <SplitBlock {...JP_INVEST} />
      {/* The latest from Japan */}
      <SectionHeading {...JP_HOME_LATEST_HEADING} />
      <NewsCardRow cards={JP_HOME_LATEST} />
      {/* Explore more about us */}
      <SectionHeading title={JP_HOME_EXPLORE_HEADING} />
      <MediaCardGrid variant="explore2" cards={JP_HOME_EXPLORE_CARDS} />
    </LocalPageShell>
  );
}
