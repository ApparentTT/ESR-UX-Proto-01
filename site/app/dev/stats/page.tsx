import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { T } from "@/components/ui/type";
import { StatRow } from "@/components/sections/stats/StatRow";
import { TrackRecord } from "@/components/sections/stats/TrackRecord";
import { PowerPipeline } from "@/components/sections/stats/PowerPipeline";
import { TargetProgressCards } from "@/components/sections/stats/TargetProgressCards";
import { ProcessSteps } from "@/components/sections/stats/ProcessSteps";
import {
  HOME_STATS,
  HOME_FOOTNOTES,
  ABOUT_STAT_ROWS,
  ABOUT_FOOTNOTES,
  DEV_STATS,
  DEV_FOOTNOTES,
  DC_STATS,
  DC_FOOTNOTES,
  SUS_STATS,
  SUS_FOOTNOTES,
  PEOPLE_STATS,
  PORT_MAP_STATS,
  DEV_MAP_STATS,
} from "@/data/site/stats";
import { TRACK_RECORD } from "@/data/site/trackRecord";
import { POWER_PIPELINE } from "@/data/site/powerPipeline";
import { SUS_TARGETS } from "@/data/site/targets";
import { DEV_PROCESS } from "@/data/site/processSteps";

export const metadata: Metadata = {
  title: "Stats family | ESR prototype",
};

/** Developer label between previews. Not part of any page. */
function DevLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-y border-dashed border-line bg-white py-2">
      <Container>
        <h2 className="font-mono text-[12px] leading-5 text-muted">{children}</h2>
      </Container>
    </div>
  );
}

/** Developer gallery of the stats family (B6, B19, B21, B26, B31). Not linked from the site. */
export default function StatsGallery() {
  return (
    <PageShell>
      <PageIntro
        title="Stats family"
        body="StatRow (all variants), ProcessSteps, PowerPipeline, TrackRecord with StackedBarChart, and TargetProgressCards, with the wireframe copy."
        pb="md"
      />

      <DevLabel>StatRow variant=&quot;home&quot; · HOME §3 (after SectionHeading eyebrow)</DevLabel>
      <SectionHeading
        variant="eyebrow"
        as="h3"
        title="Scale that delivers"
        sub="A leading platform with the scale, expertise and local presence to create value across Asia-Pacific."
        link={{ label: "Explore our group portfolio", href: "/portfolio" }}
      />
      <StatRow variant="home" stats={HOME_STATS} footnotes={HOME_FOOTNOTES} />

      <DevLabel>ProcessSteps · DEV §2</DevLabel>
      <ProcessSteps {...DEV_PROCESS} />

      <DevLabel>StatRow variant=&quot;dev&quot; · DEV §3</DevLabel>
      <StatRow variant="dev" stats={DEV_STATS} footnotes={DEV_FOOTNOTES} />

      <DevLabel>StatRow variant=&quot;map&quot; · PORT §2a and DEV §4a (inside InteractiveMap)</DevLabel>
      <div className="bg-white py-12 lg:py-[72px]">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[30px]">
            <h3 className={`${T.h40m} whitespace-nowrap`}>We span</h3>
            <StatRow variant="map" stats={PORT_MAP_STATS} className="lg:flex-1" />
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[30px]">
            <h3 className={`${T.h40m} whitespace-nowrap`}>We span</h3>
            <StatRow variant="map" stats={DEV_MAP_STATS} className="lg:flex-1" />
          </div>
        </Container>
      </div>

      <DevLabel>PowerPipeline (StatRow variant=&quot;bold4&quot; inside) · DC §3</DevLabel>
      <PowerPipeline {...POWER_PIPELINE} />

      <DevLabel>StatRow variant=&quot;dc&quot; · DC §5</DevLabel>
      <div className="pt-12 lg:pt-[72px]" />
      <StatRow variant="dc" stats={DC_STATS} footnotes={DC_FOOTNOTES} />

      <DevLabel>TrackRecord + StackedBarChart (StatRow variant=&quot;bold5&quot; inside) · INV §3</DevLabel>
      <TrackRecord {...TRACK_RECORD} />

      <DevLabel>TargetProgressCards · SUS §4</DevLabel>
      <TargetProgressCards {...SUS_TARGETS} />

      <DevLabel>StatRow variant=&quot;sus&quot; · SUS §5 (after SectionHeading bold)</DevLabel>
      <SectionHeading variant="bold" as="h3" title="Proof points" sub="Evidence of outcomes across the portfolio, not just intent." />
      <StatRow variant="sus" stats={SUS_STATS} footnotes={SUS_FOOTNOTES} />

      <DevLabel>StatRow variant=&quot;about&quot; · ABOUT §3 (two rows, footnotes without rule)</DevLabel>
      <div className="pt-12 lg:pt-[72px]" />
      <StatRow variant="about" rows={ABOUT_STAT_ROWS} footnotes={ABOUT_FOOTNOTES} />

      <DevLabel>StatRow variant=&quot;people&quot; · PEOPLE §3 (divider, no footnotes)</DevLabel>
      <div className="pt-12 lg:pt-[72px]" />
      <StatRow variant="people" stats={PEOPLE_STATS} />
    </PageShell>
  );
}
