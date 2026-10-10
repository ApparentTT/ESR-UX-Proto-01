import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProcessSteps } from "@/components/sections/stats/ProcessSteps";
import { StatRow } from "@/components/sections/stats/StatRow";
import { InteractiveMap } from "@/components/sections/map/InteractiveMap";
import { OverlayCaseCards } from "@/components/sections/cards/OverlayCaseCards";
import { DEV_CASE_STUDY_CARDS } from "@/components/sections/cards/presets";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { MarketCards } from "@/components/sections/cards/MarketCards";
import { Accordion } from "@/components/sections/listings/Accordion";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { DEV_PROCESS } from "@/data/site/processSteps";
import { DEV_FOOTNOTES, DEV_MAP_STATS, DEV_STATS } from "@/data/site/stats";
import { MAP_DOTS, MAP_REGIONS } from "@/data/site/markets";
import { DEV_WHAT_WE_DEVELOP } from "@/data/site/bentoAccordion";
import { PORTFOLIO_FAQ } from "@/data/site/documents";
import { INVEST_WITH_ESR } from "@/data/site/pages/portfolio";
import { DEV_CASE_STUDIES_HEADING, DEV_INTRO, DEV_STORIES_BAND } from "@/data/site/pages/developments";

export const metadata: Metadata = { title: "Developments | ESR — website prototype" };

/** /portfolio/developments (DEV): Group_Developments. Header active item: Our portfolio. */
export default function PortfolioDevelopmentsPage() {
  return (
    <PageShell>
      {/* §1 intro + hero CTA back to Portfolio overview (~37px under the button before the process band) */}
      <PageIntro title={DEV_INTRO.title} body={DEV_INTRO.body} pb="sm">
        <Button variant="heroCta" href={DEV_INTRO.cta.href}>
          {DEV_INTRO.cta.label}
        </Button>
      </PageIntro>
      {/* §2 "End to end, in house" */}
      <ProcessSteps {...DEV_PROCESS} />
      {/* §3 stat row + footnote */}
      <StatRow variant="dev" stats={DEV_STATS} footnotes={DEV_FOOTNOTES} />
      {/* §4 "We span" stats + interactive map (panel top 61, zoom top 57, dark overlay) */}
      <InteractiveMap variant="dev" stats={DEV_MAP_STATS} regions={MAP_REGIONS} dots={MAP_DOTS} />
      {/* §5 case studies */}
      <SectionHeading title={DEV_CASE_STUDIES_HEADING} />
      <OverlayCaseCards cards={DEV_CASE_STUDY_CARDS} />
      {/* §6 "What we develop" (the Developments sub-card is the current page) */}
      <BentoAccordion {...DEV_WHAT_WE_DEVELOP} />
      {/* §7 */}
      <SplitBlock {...INVEST_WITH_ESR} />
      {/* §8 "Featured sustainability stories" text carousel */}
      <FeatureBand controls="carousel-lg" {...DEV_STORIES_BAND} />
      {/* §9 */}
      <MarketCards />
      {/* §10 */}
      <Accordion {...PORTFOLIO_FAQ} />
      {/* §11 columns top-aligned on this page */}
      <FormBlock variant="newsletter" align="start" />
    </PageShell>
  );
}
