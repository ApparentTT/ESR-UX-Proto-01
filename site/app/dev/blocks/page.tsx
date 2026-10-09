import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HomeHero } from "@/components/sections/blocks/HomeHero";
import { SplitStatement } from "@/components/sections/blocks/SplitStatement";
import { SidebarFeatureGrid } from "@/components/sections/blocks/SidebarFeatureGrid";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { FeatureBand } from "@/components/sections/blocks/FeatureBand";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { Spacer } from "@/components/sections/blocks/Spacer";
import { LeaderList } from "@/components/sections/blocks/LeaderList";
import { LEADERS } from "@/data/site/leaders";

export const metadata: Metadata = { title: "Blocks | ESR prototype" };

/** Dev label between previews. Not part of any page. */
function Label({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p id={id} className="border-y border-line bg-white px-6 py-2 font-mono text-[12px] leading-5 text-muted md:px-10 lg:px-20">
      {children}
    </p>
  );
}

const HOME_CASE_BODY = "Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.";
const WHAT_WE_DO_CARD_BODY = "Quis nis ullarper vestibulum eros. Suspendisse lacus lectus molestie id et, nibh tellus in. Lorem diam eu, diam vel.";

/** Developer gallery of the "blocks" section components with real wireframe copy. Not linked from the site. */
export default function BlocksGallery() {
  return (
    <PageShell>
      <Label>B1 HomeHero (HOME §1)</Label>
      <HomeHero title="Global new economy assets, REITS and asset management" sub="Vorem ipsum dolor sit amet, consectetur adipiscing elit." />

      <Label>B4 SplitStatement (HOME §2)</Label>
      <SplitStatement
        eyebrow="Who we are"
        body="Our history, values and people shape how we create long-term value for our investors, customers and communities."
        statement="A leading Asia-Pacific real asset owner and manager focused on logistics real estate and data centres."
      />

      <Label>B5 SidebarFeatureGrid + FeatureCard (HOME §4)</Label>
      <SidebarFeatureGrid
        eyebrow="What we do"
        body="Worem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus."
        cards={[
          { tag: "Industrial and logistics", title: "Properties", description: WHAT_WE_DO_CARD_BODY, href: "/portfolio/properties" },
          { tag: "Industrial and logistics", title: "Developments", description: WHAT_WE_DO_CARD_BODY, href: "/portfolio/developments" },
          { title: "Data centres", description: WHAT_WE_DO_CARD_BODY, href: "/portfolio/data-centres" },
          { title: "Infrastructure", description: WHAT_WE_DO_CARD_BODY, href: null },
        ]}
      />

      <Label>B8 SplitBlock (HOME §6, PORT §6, PROP §7, DEV §7)</Label>
      <SplitBlock title="Invest with ESR" body="[Description about Invest with ESR]" cta={{ label: "Learn more", href: "/investors" }} />
      <Label>B8 SplitBlock (CAP §7)</Label>
      <SplitBlock title="Invest with ESR" body="Our funds, our strategy and the track record behind them." cta={{ label: "Learn more", href: "/investors" }} />
      <Label>B8 SplitBlock (DC §9)</Label>
      <SplitBlock
        title="Data centre leadership"
        body="The team running our digital infrastructure business across Asia Pacific."
        cta={{ label: "Meet our leadership", href: "/about/leadership" }}
      />
      <Label>B8 SplitBlock (SUS §6)</Label>
      <SplitBlock
        title="Reports and policies"
        body="Our sustainability report, ESG data pack, disclosures and published policies, all in one place."
        cta={{ label: "Go to governance", href: "/sustainability/governance" }}
      />
      <Label>B8 SplitBlock (SCS §3)</Label>
      <SplitBlock
        title="Governance"
        body="The frameworks, disclosures and published policies behind the work on this page."
        cta={{ label: "Go to governance", href: "/sustainability/governance" }}
      />
      <Label>B8 SplitBlock (SGOV §8)</Label>
      <SplitBlock
        title="Sustainability at ESR"
        body="Our targets, the work behind them and the case studies showing how it plays out across our portfolio."
        cta={{ label: "Explore sustainability", href: "/sustainability" }}
      />
      <Label>B8 SplitBlock bg=&quot;surface&quot; (CGOV §4)</Label>
      <SplitBlock
        bg="surface"
        title="Our leadership"
        body="The board and executive team accountable for the frameworks on this page."
        cta={{ label: "Meet our leadership", href: "/about/leadership" }}
      />
      <Label>B8 SplitBlock imageSide=&quot;left&quot; (ABOUT §5)</Label>
      <SplitBlock
        imageSide="left"
        title="Our leadership"
        body="[Description about leadership team with ESR]"
        cta={{ label: "Meet  our leadership team", href: "/about/leadership" }}
      />

      <Label>B9 FeatureBand controls=&quot;carousel-lg&quot; (HOME §7, PORT §4)</Label>
      <FeatureBand
        controls="carousel-lg"
        title={"Creating value in action\n[Case study title]"}
        body={HOME_CASE_BODY}
        actions={[
          { label: "View case study", href: null },
          { label: "Explore our capabilities", href: "/about/proven-capability", variant: "secondary" },
        ]}
      />
      <Label>B9 FeatureBand controls=&quot;carousel-lg&quot; (DEV §8)</Label>
      <FeatureBand
        controls="carousel-lg"
        title="Featured sustainability stories"
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        actions={[{ label: "Learn more", href: "/sustainability/case-studies" }]}
      />
      <Label>B9 FeatureBand controls=&quot;carousel-sm&quot; (SUS §7)</Label>
      <FeatureBand
        controls="carousel-sm"
        label="Featured sustainability stories (Sustainability)"
        title="Featured sustainability stories"
        body={HOME_CASE_BODY}
        actions={[{ label: "View case study", href: null }]}
      />
      <Label>B9 FeatureBand controls=&quot;arrow-only&quot; (SGOV §5; here the arrow scrolls to the DC band below)</Label>
      <FeatureBand
        controls="arrow-only"
        arrowTargetId="dc-band"
        arrowLabel="Go to past disclosures"
        title="Disclosure 2026"
        body="Our most recent disclosure, covering performance against targets, assurance and the year ahead."
        actions={[{ label: "Download the report", href: null }]}
      />
      <Label id="dc-band">B9 FeatureBand controls=&quot;none&quot; (DC §6)</Label>
      <FeatureBand
        title="Our sustainable approach"
        body="Designed around water usage, PUE and energy efficiency from the first drawing, not retrofitted later. Every facility is built to hold its value as regulation tightens."
        actions={[{ label: "Explore sustainability", href: "/sustainability" }]}
      />
      <Label>B9 FeatureBand controls=&quot;none&quot; (ABOUT §6)</Label>
      <FeatureBand title="Proven capability" body={HOME_CASE_BODY} actions={[{ label: "View all case studies", href: "/about/proven-capability" }]} />
      <Label>B9 FeatureBand controls=&quot;none&quot; (CAP §6)</Label>
      <FeatureBand
        title="Properties"
        body="Every property we own and manage across the region, and the asset management team behind them."
        actions={[{ label: "Explore properties", href: "/portfolio/properties" }]}
      />

      <Label>B25 FullWidthImage size=&quot;default&quot; (DC §2, INV §2, SUS §2, SGOV §4, CGOV §2)</Label>
      <FullWidthImage />
      <Label>B25 FullWidthImage size=&quot;tall&quot; (ABOUT §2)</Label>
      <FullWidthImage size="tall" />
      <Label>B25 FullWidthImage size=&quot;short&quot; py=&quot;compact&quot; (PEOPLE §2)</Label>
      <FullWidthImage size="short" py="compact" />

      <Label>B43 Spacer (SGOV §2: 24 / 48 / 98)</Label>
      <Spacer />

      <Label>B37 LeaderList (LEAD §2)</Label>
      <LeaderList leaders={LEADERS} />
    </PageShell>
  );
}
