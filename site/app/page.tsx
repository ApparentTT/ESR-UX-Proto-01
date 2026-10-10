import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { HomeHero } from "@/components/sections/blocks/HomeHero";
import { SplitStatement } from "@/components/sections/blocks/SplitStatement";
import { SidebarFeatureGrid } from "@/components/sections/blocks/SidebarFeatureGrid";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { StatRow } from "@/components/sections/stats/StatRow";
import { MarketCards } from "@/components/sections/cards/MarketCards";
import { NewsCardRow } from "@/components/sections/cards/NewsCardRow";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { HOME_EXPLORE_CARDS } from "@/components/sections/cards/presets";
import { HOME_STATS, HOME_FOOTNOTES } from "@/data/site/stats";
import { HOME_LATEST, LATEST_HEADINGS } from "@/data/site/latest";
import {
  HOME_HERO,
  HOME_WHO_WE_ARE,
  HOME_SCALE_HEADING,
  HOME_WHAT_WE_DO,
  HOME_INVEST,
  HOME_CASE_STUDY,
  HOME_EXPLORE_HEADING,
} from "@/data/site/pages/home";

export const metadata: Metadata = { title: "Home | ESR — website prototype" };

/** `/` HOME (specs/home.md, inventory §4). */
export default function HomePage() {
  return (
    <PageShell>
      {/* §1 */}
      <HomeHero {...HOME_HERO} />

      {/* §2 Who we are */}
      <SplitStatement {...HOME_WHO_WE_ARE} />

      {/* §3 Scale that delivers + stats */}
      <SectionHeading variant="eyebrow" {...HOME_SCALE_HEADING} />
      <StatRow variant="home" stats={HOME_STATS} footnotes={HOME_FOOTNOTES} label="Scale that delivers" />

      {/* §4 What we do */}
      <SidebarFeatureGrid {...HOME_WHAT_WE_DO} />

      {/* §5 Explore our markets */}
      <MarketCards />

      {/* §6 Invest with ESR */}
      <SplitBlock {...HOME_INVEST} />

      {/* §7 Case study carousel */}
      <FeatureBand controls="carousel-lg" {...HOME_CASE_STUDY} />

      {/* §8 The latest */}
      <SectionHeading {...LATEST_HEADINGS.home} />
      <NewsCardRow cards={HOME_LATEST} />

      {/* §9 Explore more about us */}
      <SectionHeading title={HOME_EXPLORE_HEADING} />
      <MediaCardGrid variant="explore2" cards={HOME_EXPLORE_CARDS} />
    </PageShell>
  );
}
