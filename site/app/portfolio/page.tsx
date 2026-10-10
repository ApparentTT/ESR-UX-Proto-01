import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { InteractiveMap } from "@/components/sections/map/InteractiveMap";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { MarketCards } from "@/components/sections/cards/MarketCards";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { PORT_MAP_STATS } from "@/data/site/stats";
import { MAP_DOTS, MAP_REGIONS } from "@/data/site/markets";
import { PORT_OUR_ASSETS } from "@/data/site/bentoAccordion";
import { PORT_CUSTOMERS } from "@/data/site/logoMarquees";
import { INVEST_WITH_ESR, PORT_CASE_STUDY_BAND, PORT_INTRO } from "@/data/site/pages/portfolio";

export const metadata: Metadata = { title: "Portfolio overview | ESR — website prototype" };

/** /portfolio (PORT): R2_Group_PortfolioOverview. Header active item: Our portfolio. */
export default function PortfolioOverviewPage() {
  return (
    <PageShell>
      {/* §1 */}
      <PageIntro title={PORT_INTRO.title} body={PORT_INTRO.body} />
      {/* §2 "We span" stats + interactive map */}
      <InteractiveMap stats={PORT_MAP_STATS} regions={MAP_REGIONS} dots={MAP_DOTS} />
      {/* §3 "Our assets" bento accordion */}
      <BentoAccordion {...PORT_OUR_ASSETS} />
      {/* §4 case-study carousel */}
      <FeatureBand controls="carousel-lg" {...PORT_CASE_STUDY_BAND} />
      {/* §5 customer logos */}
      <LogoMarquee {...PORT_CUSTOMERS} />
      {/* §6 */}
      <SplitBlock {...INVEST_WITH_ESR} />
      {/* §7–8 */}
      <MarketCards />
      {/* §9 */}
      <FormBlock variant="newsletter" />
    </PageShell>
  );
}
