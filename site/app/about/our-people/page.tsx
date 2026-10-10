import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { StatRow } from "@/components/sections/stats/StatRow";
import { TalentDevelopment } from "@/components/sections/infocards/TalentDevelopment";
import { MobilityMarkets } from "@/components/sections/infocards/MobilityMarkets";
import { QuoteCarousel } from "@/components/sections/carousels/QuoteCarousel";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { PEOPLE_STATS } from "@/data/site/stats";
import { PEOPLE_TALENT, PEOPLE_MOBILITY } from "@/data/site/careers";
import { PEOPLE_EMPLOYEE_QUOTES } from "@/data/site/quoteCarousels";
import { PEOPLE_INTRO } from "@/data/site/pages/our-people";

export const metadata: Metadata = { title: "Our people | ESR — website prototype" };

/** /about/our-people (PEOPLE): OurPeople Group (specs/about-our-people.md, inventory §4). Header active item: About. */
export default function OurPeoplePage() {
  return (
    <PageShell>
      {/* §1 */}
      <PageIntro title={PEOPLE_INTRO.title} body={PEOPLE_INTRO.body} />
      {/* §2 "Life at ESR" image (the hidden "Purpose and values" column is not built) */}
      <FullWidthImage size="short" py="compact" />
      {/* §3 people stats + full-width divider */}
      <StatRow variant="people" stats={PEOPLE_STATS} />
      {/* §4 "Talent development": 3 pillars + "See all open roles" (inert, external) */}
      <TalentDevelopment {...PEOPLE_TALENT} />
      {/* §5 employee quote carousel (bars pager, 3 repeats of the designed slide) */}
      <QuoteCarousel {...PEOPLE_EMPLOYEE_QUOTES} />
      {/* §6 "Mobility and growth at ESR" + market tiles (inert, external) */}
      <MobilityMarkets {...PEOPLE_MOBILITY} />
      {/* §7 "Careers enquiry" form, white band */}
      <FormBlock variant="careers" />
    </PageShell>
  );
}
