import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { LeaderList } from "@/components/sections/blocks/LeaderList";
import { InfoCardSection } from "@/components/sections/infocards/InfoCardSection";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { LEAD_LEARN_MORE_CARDS } from "@/components/sections/cards/presets";
import { LEADERS } from "@/data/site/leaders";
import { LEAD_REITS } from "@/data/site/reitInfo";
import { LEAD_INTRO } from "@/data/site/pages/about-leadership";

export const metadata: Metadata = { title: "Our leadership | ESR — website prototype" };

/** /about/leadership (LEAD): Group_OurLeadership. Header active item: About. */
export default function LeadershipPage() {
  return (
    <PageShell>
      {/* §1 display intro: Bold 48 title, 20px muted sub (820 wide), 56 below */}
      <PageIntro variant="display" subSize={20} pb="md" title={LEAD_INTRO.title} body={LEAD_INTRO.body} />
      {/* §2 3 groups (h2) of 15 leaders (h3); LinkedIn and "View [area of focus]" are inert */}
      <LeaderList leaders={LEADERS} />
      {/* §3 "Our REITs": surface band, 4 white cards; "lorem.ipsum.com" is inert */}
      <InfoCardSection {...LEAD_REITS} id="our-reits" />
      {/* §4 About link cards, no section heading (#FAFBFF renders white). The card titles are h2s
          so they do not sit under "Our REITs" in the outline. */}
      <MediaCardGrid variant="learnMore3" cards={LEAD_LEARN_MORE_CARDS} cardHeadingLevel="h2" />
    </PageShell>
  );
}
