import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { StatRow } from "@/components/sections/stats/StatRow";
import { OutlineTextCardRow } from "@/components/sections/infocards/OutlineTextCardRow";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { ABOUT_FEATURED_CARDS } from "@/components/sections/cards/presets";
import { ABOUT_STAT_ROWS, ABOUT_FOOTNOTES } from "@/data/site/stats";
import { ABOUT_PURPOSE, ABOUT_PURPOSE_HEADING } from "@/data/site/purpose";
import { ABOUT_INTRO, ABOUT_LEADERSHIP, ABOUT_PROVEN_CAPABILITY } from "@/data/site/pages/about";

export const metadata: Metadata = { title: "About us | ESR — website prototype" };

/** /about (ABOUT): R2_Group_About (specs/about.md, inventory §4). Header active item: About. */
export default function AboutPage() {
  return (
    <PageShell>
      {/* §1 */}
      <PageIntro title={ABOUT_INTRO.title} body={ABOUT_INTRO.body} />
      {/* §2 full-width image (the hidden "Key funds" column is not built) */}
      <FullWidthImage size="tall" />
      {/* §3 two stat rows (row 2 duplicates row 1, as drawn) + footnotes without a rule */}
      <StatRow variant="about" rows={ABOUT_STAT_ROWS} footnotes={ABOUT_FOOTNOTES} />
      {/* §4a–b "Our purpose" */}
      <SectionHeading title={<span id="our-purpose-heading">{ABOUT_PURPOSE_HEADING}</span>} />
      <OutlineTextCardRow items={ABOUT_PURPOSE} labelledBy="our-purpose-heading" />
      {/* §5 "Our leadership" teaser, image left */}
      <SplitBlock imageSide="left" {...ABOUT_LEADERSHIP} />
      {/* §6 "Proven capability" static band; §7 continues the same surface band */}
      <FeatureBand controls="none" {...ABOUT_PROVEN_CAPABILITY} />
      {/* §7 featured cards: Our people / Our customers (inert) / News and insights. No section heading, so the card titles are h2. */}
      <MediaCardGrid variant="featured3" bg="surface" cards={ABOUT_FEATURED_CARDS} cardHeadingLevel="h2" />
    </PageShell>
  );
}
