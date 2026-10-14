import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { LeaderList } from "@/components/sections/blocks/LeaderList";
import { InfoCardSection } from "@/components/sections/infocards/InfoCardSection";
import { MarketCtaStrip } from "@/components/sections/news/MarketCtaStrip";
import { LEAD_REITS } from "@/data/site/reitInfo";
import { JP_LEADERS, JP_LEAD_GROUP_PROMO, JP_LEAD_INTRO } from "@/data/site/local/leadership";

export const metadata: Metadata = { title: "Our leadership | ESR Japan — website prototype" };

/** /jp/leadership: Local_OurLeadership (Primary wireframes 1340:75216, mobile 1340:75217). Local nav: About. */
export default function JapanLeadershipPage() {
  return (
    <LocalPageShell>
      <PageIntro variant="display" subSize={20} pb="md" title={JP_LEAD_INTRO.title} body={JP_LEAD_INTRO.body} />
      {/* "Japan leadership": 4 leaders, lines between rows; LinkedIn is inert */}
      <div className="lg:pt-6 [&_h2]:border-t-0">
        <LeaderList leaders={JP_LEADERS} divided />
      </div>
      {/* "Group leadership" promo → group Our leadership */}
      <MarketCtaStrip
        market="ESR group"
        headingTemplate={JP_LEAD_GROUP_PROMO.title}
        sub={JP_LEAD_GROUP_PROMO.sub}
        showNote={false}
        buttonTemplate={JP_LEAD_GROUP_PROMO.cta.label}
        href={JP_LEAD_GROUP_PROMO.cta.href}
      />
      <InfoCardSection {...LEAD_REITS} id="our-reits" />
    </LocalPageShell>
  );
}
