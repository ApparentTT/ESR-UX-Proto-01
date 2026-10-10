import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { PowerPipeline } from "@/components/sections/stats/PowerPipeline";
import { ExpandingCards } from "@/components/sections/infocards/ExpandingCards";
import { StatRow } from "@/components/sections/stats/StatRow";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { DC_STORY_CARDS } from "@/components/sections/cards/presets";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { ContactPersonBand } from "@/components/sections/forms/ContactPersonBand";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { POWER_PIPELINE } from "@/data/site/powerPipeline";
import { DC_FEATURES, DC_FEATURES_HEADING } from "@/data/site/featuresBenefits";
import { DC_FOOTNOTES, DC_STATS } from "@/data/site/stats";
import { DC_EXPLORE_PORTFOLIO } from "@/data/site/bentoAccordion";
import { DC_CONTACT_PERSON } from "@/data/site/offices";
import { DC_INTRO, DC_LEADERSHIP, DC_STORIES_HEADING, DC_SUSTAINABLE_APPROACH } from "@/data/site/pages/data-centres";

export const metadata: Metadata = { title: "Data centres | ESR — website prototype" };

/** /portfolio/data-centres (DC): Group_DataCentres. Header active item: Our portfolio. */
export default function PortfolioDataCentresPage() {
  return (
    <PageShell>
      {/* §1 text-only intro */}
      <PageIntro title={DC_INTRO.title} body={DC_INTRO.body} />
      {/* §2 overview image 1306 x 500 */}
      <FullWidthImage />
      {/* §3 "Our global pipeline" */}
      <PowerPipeline {...POWER_PIPELINE} />
      {/* §4 "Features and benefits" heading + expanding cards (the h2 names the cards region) */}
      <SectionHeading title={<span id="features-heading">{DC_FEATURES_HEADING}</span>} />
      <ExpandingCards items={DC_FEATURES} labelledBy="features-heading" />
      {/* §5 track-record stat row (no top padding: follows the cards) */}
      <StatRow variant="dc" stats={DC_STATS} footnotes={DC_FOOTNOTES} />
      {/* §6 static band */}
      <FeatureBand {...DC_SUSTAINABLE_APPROACH} />
      {/* §7 stories */}
      <SectionHeading title={DC_STORIES_HEADING} />
      <MediaCardGrid variant="story3" cards={DC_STORY_CARDS} />
      {/* §8 "Explore the portfolio" (the Data centres tile is the current page) */}
      <BentoAccordion {...DC_EXPLORE_PORTFOLIO} />
      {/* §9 */}
      <SplitBlock {...DC_LEADERSHIP} />
      {/* §10 */}
      <ContactPersonBand {...DC_CONTACT_PERSON} />
      {/* §11 */}
      <FormBlock variant="dcEnquiry" />
    </PageShell>
  );
}
