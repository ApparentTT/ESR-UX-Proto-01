import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { MarketCards } from "@/components/sections/cards/MarketCards";
import { NewsCardRow } from "@/components/sections/cards/NewsCardRow";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { OverlayCaseCards } from "@/components/sections/cards/OverlayCaseCards";
import { FeaturedProperties } from "@/components/sections/cards/FeaturedProperties";
import {
  HOME_EXPLORE_CARDS,
  PROP_PORTFOLIO_CARDS,
  SUS_PILLAR_CARDS,
  SGOV_GOVERN_HEADING,
  SGOV_GOVERN_CARDS,
  ABOUT_FEATURED_CARDS,
  DC_STORY_CARDS,
  LEAD_LEARN_MORE_CARDS,
  CAP_CASE_STUDY_CARDS,
  DEV_CASE_STUDY_CARDS,
  CAP_FEATURED_PROPERTY,
  CAP_PROPERTY_CARDS,
} from "@/components/sections/cards/presets";
import { HOME_LATEST, INV_LATEST, LATEST_HEADINGS } from "@/data/site/latest";

export const metadata: Metadata = { title: "Cards | ESR prototype" };

/** Dev label between previews. Not part of any page. */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="border-y border-line bg-white px-6 py-2 font-mono text-[12px] leading-5 text-muted md:px-10 lg:px-20">{children}</p>;
}

/** Developer gallery of the "cards" section components with real wireframe copy. Not linked from the site. */
export default function CardsGallery() {
  return (
    <PageShell>
      <div className="bg-white px-6 pb-4 pt-8 md:px-10 lg:px-20">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">Cards gallery</h1>
        <p className="mt-1 text-[14px] leading-5 text-muted">B7 MarketCards, B12 NewsCardRow, B13 MediaCardGrid, B20 OverlayCaseCards, B38 FeaturedProperties.</p>
      </div>

      <Label>B7 MarketCards (HOME §5, PORT §7–8, DEV §9). Includes its SectionHeading</Label>
      <MarketCards />

      <Label>B3 SectionHeading + B12 NewsCardRow, HOME data set (HOME §8, SUS §8b)</Label>
      <SectionHeading {...LATEST_HEADINGS.home} />
      <NewsCardRow cards={HOME_LATEST} />

      <Label>B3 SectionHeading + B12 NewsCardRow, INV data set (INV §8)</Label>
      <SectionHeading {...LATEST_HEADINGS.investors} />
      <NewsCardRow cards={INV_LATEST} />

      <Label>B13 MediaCardGrid explore2 (HOME §9)</Label>
      <SectionHeading title="Explore more about us" />
      <MediaCardGrid variant="explore2" cards={HOME_EXPLORE_CARDS} />

      <Label>B13 MediaCardGrid products3 (PROP §8–9)</Label>
      <SectionHeading title="Explore our portfolio" />
      <MediaCardGrid variant="products3" cards={PROP_PORTFOLIO_CARDS} />

      <Label>B13 MediaCardGrid products3, static pillars (SUS §3)</Label>
      <SectionHeading title="Strategic pillars" />
      <MediaCardGrid variant="products3" cards={SUS_PILLAR_CARDS} />

      <Label>B13 MediaCardGrid products3, static, inline heading (SGOV §3)</Label>
      <MediaCardGrid variant="products3" heading={SGOV_GOVERN_HEADING} cards={SGOV_GOVERN_CARDS} />

      <Label>B13 MediaCardGrid featured3 on a surface band (ABOUT §7)</Label>
      <MediaCardGrid variant="featured3" bg="surface" cards={ABOUT_FEATURED_CARDS} />

      <Label>B13 MediaCardGrid story3 (DC §7)</Label>
      <SectionHeading title="Featured sustainability stories" />
      <MediaCardGrid variant="story3" cards={DC_STORY_CARDS} />

      <Label>B13 MediaCardGrid learnMore3, no heading (LEAD §4)</Label>
      <MediaCardGrid variant="learnMore3" cards={LEAD_LEARN_MORE_CARDS} />

      <Label>B13 MediaCardGrid case3, bare list inside a surface section (CAP §2c–3)</Label>
      <Section bg="surface" className="py-12 md:py-16 lg:py-[72px]">
        <h2 className="mb-8 text-[22px] font-medium tracking-[-0.02em] text-ink md:text-[24px] lg:mb-16">Case studies</h2>
        <MediaCardGrid variant="case3" bg="surface" cards={CAP_CASE_STUDY_CARDS} bare />
      </Section>

      <Label>B3 SectionHeading + B20 OverlayCaseCards (DEV §5)</Label>
      <SectionHeading title="Development case studies" />
      <OverlayCaseCards cards={DEV_CASE_STUDY_CARDS} />

      <Label>B3 SectionHeading + B38 FeaturedProperties (CAP §4–5)</Label>
      <SectionHeading title="Featured properties" />
      <FeaturedProperties featured={CAP_FEATURED_PROPERTY} cards={CAP_PROPERTY_CARDS} />
    </PageShell>
  );
}
