import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { ProcessSteps } from "@/components/sections/stats/ProcessSteps";
import { OverlayCaseCards } from "@/components/sections/cards/OverlayCaseCards";
import { DEV_CASE_STUDY_CARDS } from "@/components/sections/cards/presets";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { OutlineTextCardRow } from "@/components/sections/infocards/OutlineTextCardRow";
import { Accordion } from "@/components/sections/listings/Accordion";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { DevOpportunitySearch } from "@/components/sections/local/DevOpportunitySearch";
import { LocalKeyStats } from "@/components/sections/local/LocalKeyStats";
import { DEV_PROCESS } from "@/data/site/processSteps";
import { PORTFOLIO_FAQ } from "@/data/site/documents";
import { JP_INVEST, JP_NEWSLETTER } from "@/data/site/local/shared";
import {
  JP_DEV_CUSTOMER_STORIES,
  JP_DEV_INTRO,
  JP_DEV_NEWSLETTER,
  JP_DEV_SCALE,
  JP_DEV_SEARCH,
  JP_DEV_SUSTAINABILITY,
  JP_DEV_VIEW_ALL,
  JP_DEV_WHAT_WE_DEVELOP,
} from "@/data/site/local/developments";

export const metadata: Metadata = { title: "Developments | ESR Japan — website prototype" };

/** /jp/developments: Local_Developments (Primary wireframes 1273:74412, mobile 1273:87214). Local nav: Our portfolio. */
export default function JapanDevelopmentsPage() {
  return (
    <LocalPageShell>
      <PageIntro title={JP_DEV_INTRO.title} body={JP_DEV_INTRO.body} pb="sm" />
      {/* "End to end, in house" (the group process steps), drawn on white here */}
      <div className="[&>section]:bg-white">
        <ProcessSteps {...DEV_PROCESS} id="jp-dev-process" />
      </div>
      {/* "Find a development opportunity" into the ESR Japan property search */}
      <DevOpportunitySearch {...JP_DEV_SEARCH} />
      {/* "Backed by global scale" */}
      <LocalKeyStats title={JP_DEV_SCALE.title} sub={JP_DEV_SCALE.sub} stats={JP_DEV_SCALE.stats} footnotes={JP_DEV_SCALE.footnotes} />
      {/* Development case studies (no heading drawn: the card titles are h2) + "View all case studies" */}
      <OverlayCaseCards cards={DEV_CASE_STUDY_CARDS} headingLevel="h2" className="pb-6 pt-2 md:pt-4 lg:pb-6 lg:pt-0" />
      <Section className="pb-12 md:pb-16 lg:pb-20">
        <TextLink href={JP_DEV_VIEW_ALL.href} variant="arrow" size={14}>
          {JP_DEV_VIEW_ALL.label}
        </TextLink>
      </Section>
      <FeatureBand controls="carousel-lg" {...JP_DEV_CUSTOMER_STORIES} />
      <FeatureBand controls="carousel-lg" bg="white" {...JP_DEV_SUSTAINABILITY} />
      <SplitBlock bg="surface" {...JP_INVEST} />
      <SectionHeading title={<span id="jp-what-we-develop">{JP_DEV_WHAT_WE_DEVELOP.title}</span>} />
      <OutlineTextCardRow items={JP_DEV_WHAT_WE_DEVELOP.items} labelledBy="jp-what-we-develop" />
      <Accordion {...PORTFOLIO_FAQ} />
      <FormBlock
        variant="newsletter"
        align="start"
        title={JP_DEV_NEWSLETTER.title}
        body={JP_DEV_NEWSLETTER.body}
        fields={JP_NEWSLETTER.fields}
        required={JP_NEWSLETTER.required}
      />
    </LocalPageShell>
  );
}
