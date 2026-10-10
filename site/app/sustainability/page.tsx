import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { NewsCardRow } from "@/components/sections/cards/NewsCardRow";
import { SUS_PILLAR_CARDS } from "@/components/sections/cards/presets";
import { TargetProgressCards } from "@/components/sections/stats/TargetProgressCards";
import { StatRow } from "@/components/sections/stats/StatRow";
import { SUS_TARGETS } from "@/data/site/targets";
import { SUS_FOOTNOTES, SUS_STATS } from "@/data/site/stats";
import { LATEST_HEADINGS, SUS_LATEST } from "@/data/site/latest";
import {
  SUS_INTRO,
  SUS_PILLARS_HEADING,
  SUS_PROOF_POINTS_HEADING,
  SUS_REPORTS,
  SUS_STORIES,
} from "@/data/site/pages/sustainability";

export const metadata: Metadata = { title: "Sustainability | ESR — website prototype" };

/** /sustainability (SUS): Group_SustainabilityOverview. Header active item: Sustainability. */
export default function SustainabilityPage() {
  return (
    <PageShell>
      {/* §1 */}
      <PageIntro title={SUS_INTRO.title} body={SUS_INTRO.body} />
      {/* §2 overview image (the hidden text block is not built) */}
      <FullWidthImage />
      {/* §3a–b "Strategic pillars": 3 static cards */}
      <SectionHeading title={SUS_PILLARS_HEADING} />
      <MediaCardGrid variant="products3" cards={SUS_PILLAR_CARDS} />
      {/* §4 "Our targets" progress cards */}
      <TargetProgressCards {...SUS_TARGETS} />
      {/* §5a–b "Proof points": 4 stats + footnote */}
      <SectionHeading variant="bold" title={SUS_PROOF_POINTS_HEADING.title} sub={SUS_PROOF_POINTS_HEADING.sub} />
      <StatRow variant="sus" stats={SUS_STATS} footnotes={SUS_FOOTNOTES} label="Proof points" />
      {/* §6 "Reports and policies" → /sustainability/governance */}
      <SplitBlock title={SUS_REPORTS.title} body={SUS_REPORTS.body} cta={SUS_REPORTS.cta} />
      {/* §7 "Featured sustainability stories" carousel (40px chevrons, 3 slides repeating slide 1) */}
      <FeatureBand controls="carousel-sm" title={SUS_STORIES.title} body={SUS_STORIES.body} actions={SUS_STORIES.actions} />
      {/* §8a–b "News": 4 inert cards, "Explore the latest" → /news */}
      <SectionHeading {...LATEST_HEADINGS.sustainability} />
      <NewsCardRow cards={SUS_LATEST} label="Sustainability news" />
    </PageShell>
  );
}
