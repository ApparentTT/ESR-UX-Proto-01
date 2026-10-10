import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/sections/PageIntro";
import { InteractiveMap } from "@/components/sections/map/InteractiveMap";
import { MapStatsRow } from "@/components/sections/map/MapStatsRow";
import { MapCanvas } from "@/components/sections/map/MapCanvas";
import { MAP_DOTS, MAP_REGIONS } from "@/data/site/markets";
import { PORT_MAP_STATS, DEV_MAP_STATS } from "@/data/site/stats";

export const metadata: Metadata = {
  title: "Map family | ESR prototype",
};

/** Developer label between previews. Not part of any page. */
function DevLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-y border-dashed border-line bg-white py-2">
      <Container>
        <p className="font-mono text-[12px] leading-5 text-muted">{children}</p>
      </Container>
    </div>
  );
}

const NAMES = Object.fromEntries(MAP_REGIONS.flatMap((r) => r.markets.map((m) => [m.id, m.name])));

/** Developer gallery of the map family (B15). Not linked from the site. */
export default function MapGallery() {
  return (
    <PageShell>
      <PageIntro
        title="Map family"
        body="InteractiveMap (PORT and DEV variants, each region open), MapStatsRow and MapCanvas, with the wireframe copy."
        pb="md"
      />

      <DevLabel>InteractiveMap variant=&quot;port&quot; · PORT §2 (Asia open, panel top 44, zoom top 40)</DevLabel>
      <InteractiveMap id="map-port" stats={PORT_MAP_STATS} regions={MAP_REGIONS} dots={MAP_DOTS} />

      <DevLabel>InteractiveMap variant=&quot;dev&quot; · DEV §4 (dark overlay, panel top 61, zoom top 57)</DevLabel>
      <InteractiveMap id="map-dev" variant="dev" stats={DEV_MAP_STATS} regions={MAP_REGIONS} dots={MAP_DOTS} />

      <DevLabel>InteractiveMap defaultRegion=&quot;oceania&quot; · open state for Oceania</DevLabel>
      <InteractiveMap
        id="map-oceania"
        stats={PORT_MAP_STATS}
        regions={MAP_REGIONS}
        dots={MAP_DOTS}
        defaultRegion="oceania"
      />

      <DevLabel>InteractiveMap defaultRegion=&quot;middle-east&quot; · open state for Middle East</DevLabel>
      <InteractiveMap
        id="map-middle-east"
        variant="dev"
        stats={DEV_MAP_STATS}
        regions={MAP_REGIONS}
        dots={MAP_DOTS}
        defaultRegion="middle-east"
      />

      <DevLabel>MapStatsRow (as=&quot;h3&quot;) on its own · PORT stats</DevLabel>
      <section aria-label="MapStatsRow preview" className="bg-white py-12">
        <Container>
          <MapStatsRow stats={PORT_MAP_STATS} as="h3" />
        </Container>
      </section>

      <DevLabel>
        MapCanvas on its own · static: activeId=&quot;greater-china&quot;, zoom 1.25 (default frame) · activeId=&quot;japan&quot;,
        overlay, sizeClassName 4:3 to 1306:635
      </DevLabel>
      <section aria-label="MapCanvas preview" className="bg-white py-12">
        <Container className="grid gap-8 lg:grid-cols-2">
          <MapCanvas dots={MAP_DOTS} names={NAMES} activeId="greater-china" zoom={1.25} />
          <MapCanvas dots={MAP_DOTS} names={NAMES} activeId="japan" overlay sizeClassName="aspect-[4/3] md:aspect-[1306/635]" />
        </Container>
      </section>
    </PageShell>
  );
}
