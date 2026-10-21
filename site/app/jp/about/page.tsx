import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { LeaderGrid } from "@/components/sections/blocks/LeaderGrid";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { OutlineTextCardRow } from "@/components/sections/infocards/OutlineTextCardRow";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { LocalIntro } from "@/components/sections/local/LocalIntro";
import { ScopeStats } from "@/components/sections/local/ScopeStats";
import {
  JP_ABOUT_CAPABILITY,
  JP_ABOUT_CARDS,
  JP_ABOUT_INTRO,
  JP_ABOUT_LEADERSHIP,
  JP_ABOUT_PURPOSE,
  JP_ABOUT_PURPOSE_HEADING,
  JP_ABOUT_STATS,
} from "@/data/site/local/about";

export const metadata: Metadata = { title: "About us | ESR Japan — website prototype" };

/** /jp/about: R2_Local_About (Key wireframes 1347:77157, mobile 1347:77158). Local nav: About. */
export default function JapanAboutPage() {
  return (
    <LocalPageShell>
      {/* Intro + "Discover more about ESR group" (group About page) */}
      <LocalIntro title={JP_ABOUT_INTRO.title} body={JP_ABOUT_INTRO.body} action={JP_ABOUT_INTRO.action} />
      <FullWidthImage size="tall" />
      {/* Key stats / opt 2: Group / Local toggle, four stats, footnote */}
      <ScopeStats {...JP_ABOUT_STATS} />
      <SectionHeading title={<span id="jp-our-purpose">{JP_ABOUT_PURPOSE_HEADING}</span>} />
      <OutlineTextCardRow items={JP_ABOUT_PURPOSE} labelledBy="jp-our-purpose" />
      {/* "Our leadership": the group About leader grid, three Japan leaders, and a link to the Japan leadership page */}
      <LeaderGrid columns={3} {...JP_ABOUT_LEADERSHIP} />
      <FeatureBand controls="none" {...JP_ABOUT_CAPABILITY} />
      {/* Featured cards, no section heading: the card titles are h2 */}
      <MediaCardGrid variant="featured3" cards={JP_ABOUT_CARDS} cardHeadingLevel="h2" />
    </LocalPageShell>
  );
}
