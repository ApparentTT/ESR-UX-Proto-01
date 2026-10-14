import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { StatRow } from "@/components/sections/stats/StatRow";
import { MediaCardList } from "@/components/sections/cards/MediaCardGrid";
import { TalentDevelopment } from "@/components/sections/infocards/TalentDevelopment";
import { QuoteCarousel } from "@/components/sections/carousels/QuoteCarousel";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { Section } from "@/components/ui/Section";
import { T } from "@/components/ui/type";
import { PEOPLE_STATS } from "@/data/site/stats";
import { PEOPLE_TALENT } from "@/data/site/careers";
import { PEOPLE_EMPLOYEE_QUOTES } from "@/data/site/quoteCarousels";
import { PEOPLE_INTRO } from "@/data/site/pages/our-people";
import { JP_PEOPLE_BENEFITS } from "@/data/site/local/our-people";

export const metadata: Metadata = { title: "Our people | ESR Japan — website prototype" };

/**
 * /jp/our-people: OurPeople local (Primary wireframes 1273:80361, mobile 1273:80362). Local nav: About.
 * The group page's sections, plus "Benefits"; no "Mobility and growth at ESR" (removed on the local page only).
 */
export default function JapanOurPeoplePage() {
  return (
    <LocalPageShell>
      <PageIntro title={PEOPLE_INTRO.title} body={PEOPLE_INTRO.body} />
      {/* "Life at ESR" image */}
      <FullWidthImage size="short" py="compact" />
      {/* People stats + full-width divider */}
      <StatRow variant="people" stats={PEOPLE_STATS} />
      {/* "Benefits": Medium 40 heading, 32 gap, three 415 x 248 image cards (32 top / 72 bottom) */}
      <Section aria-labelledby="jp-people-benefits" className="pb-12 pt-8 md:pb-16 lg:pb-[72px]">
        <h2 id="jp-people-benefits" className={T.h40m}>
          {JP_PEOPLE_BENEFITS.title}
        </h2>
        <MediaCardList variant="products3" cards={JP_PEOPLE_BENEFITS.cards} className="mt-6 lg:mt-8" />
      </Section>
      {/* "Talent development": 3 pillars + "See all open roles" (inert, external) */}
      <TalentDevelopment {...PEOPLE_TALENT} />
      {/* Employee quote carousel */}
      <QuoteCarousel {...PEOPLE_EMPLOYEE_QUOTES} />
      {/* "Careers enquiry" form */}
      <FormBlock variant="careers" />
    </LocalPageShell>
  );
}
