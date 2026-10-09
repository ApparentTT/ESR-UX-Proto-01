import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Section } from "@/components/ui/Section";
import { PAD } from "@/components/ui/type";
import { ExpandingCards } from "@/components/sections/infocards/ExpandingCards";
import { OutlineTextCard } from "@/components/sections/infocards/OutlineTextCard";
import { OutlineTextCardRow } from "@/components/sections/infocards/OutlineTextCardRow";
import { InfoCardGrid } from "@/components/sections/infocards/InfoCardGrid";
import { InfoCardSection } from "@/components/sections/infocards/InfoCardSection";
import { LinkTileGrid } from "@/components/sections/infocards/LinkTileGrid";
import { ProductSuite } from "@/components/sections/infocards/ProductSuite";
import { FundCards } from "@/components/sections/infocards/FundCards";
import { TalentDevelopment } from "@/components/sections/infocards/TalentDevelopment";
import { MobilityMarkets } from "@/components/sections/infocards/MobilityMarkets";
import { DC_FEATURES, DC_FEATURES_HEADING } from "@/data/site/featuresBenefits";
import { ABOUT_PURPOSE, ABOUT_PURPOSE_HEADING } from "@/data/site/purpose";
import { INV_PRODUCT_SUITE } from "@/data/site/productSuite";
import { INV_FLAGSHIP_FUNDS } from "@/data/site/flagshipFunds";
import { PEOPLE_TALENT, PEOPLE_MOBILITY } from "@/data/site/careers";
import { LEAD_REITS } from "@/data/site/reitInfo";

export const metadata: Metadata = {
  title: "Info cards family | ESR prototype",
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

/** Developer gallery of the info cards family (B22, B23, B27, B28, B29, B44, B45). Not linked from the site. */
export default function InfoCardsGallery() {
  return (
    <PageShell>
      <PageIntro
        title="Info cards family"
        body="ExpandingCards, OutlineTextCard and OutlineTextCardRow, InfoCardGrid (assetClass, pillar, reitInfo), LinkTileGrid (reit, market), ProductSuite, FundCards, TalentDevelopment and MobilityMarkets, with the wireframe copy."
        pb="md"
      />

      <DevLabel>SectionHeading title + ExpandingCards · DC §4 (Scalability open by default; vertical accordion below 1280)</DevLabel>
      <SectionHeading title={<span id="features-heading">{DC_FEATURES_HEADING}</span>} />
      <ExpandingCards items={DC_FEATURES} labelledBy="features-heading" />

      <DevLabel>SectionHeading title + OutlineTextCardRow · ABOUT §4 (card 3 links to /about/our-people)</DevLabel>
      <SectionHeading title={<span id="purpose-heading">{ABOUT_PURPOSE_HEADING}</span>} />
      <OutlineTextCardRow items={ABOUT_PURPOSE} labelledBy="purpose-heading" />

      <DevLabel>OutlineTextCard on its own (the shell shared with ExpandingCards)</DevLabel>
      <Section bg="white" className={PAD.mid}>
        <div className="max-w-[425px]">
          <OutlineTextCard {...ABOUT_PURPOSE[2]} titleAs="h2" className="min-h-[220px] lg:aspect-[424.67/405] lg:min-h-0" />
        </div>
      </Section>

      <DevLabel>ProductSuite · INV §4 (InfoCardGrid assetClass + LinkTileGrid reit)</DevLabel>
      <ProductSuite {...INV_PRODUCT_SUITE} />

      <DevLabel>FundCards · INV §5</DevLabel>
      <FundCards {...INV_FLAGSHIP_FUNDS} />

      <DevLabel>TalentDevelopment · PEOPLE §4 (InfoCardGrid pillar + dark button)</DevLabel>
      <TalentDevelopment {...PEOPLE_TALENT} />

      <DevLabel>MobilityMarkets · PEOPLE §6 (grey band, LinkTileGrid market)</DevLabel>
      <MobilityMarkets {...PEOPLE_MOBILITY} />

      <DevLabel>InfoCardSection variant=&quot;reitInfo&quot; · LEAD §3 &quot;Our REITs&quot; (surface band)</DevLabel>
      <InfoCardSection {...LEAD_REITS} id="our-reits" />

      <DevLabel>Standalone grids (no band): InfoCardGrid assetClass / pillar, LinkTileGrid reit / market, for composing new sections</DevLabel>
      <Section bg="white" className={PAD.mid} containerClassName="flex flex-col gap-12">
        <h2 className="sr-only">Standalone grids</h2>
        <InfoCardGrid variant="assetClass" label={INV_PRODUCT_SUITE.assetClasses.label} items={INV_PRODUCT_SUITE.assetClasses.items} />
        <InfoCardGrid variant="pillar" items={PEOPLE_TALENT.pillars} />
        <LinkTileGrid variant="reit" label={INV_PRODUCT_SUITE.reits.label} items={INV_PRODUCT_SUITE.reits.items} />
      </Section>
      <Section bg="grey" className={PAD.mid}>
        <LinkTileGrid variant="market" label={PEOPLE_MOBILITY.label} labelOn="grey" items={PEOPLE_MOBILITY.markets} />
      </Section>
      <Section bg="surface" className={PAD.mid}>
        <InfoCardGrid variant="reitInfo" items={LEAD_REITS.items} />
      </Section>
    </PageShell>
  );
}
