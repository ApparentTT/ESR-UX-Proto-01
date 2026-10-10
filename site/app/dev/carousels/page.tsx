import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { QuoteCarousel } from "@/components/sections/carousels/QuoteCarousel";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { MarketCarousel } from "@/components/sections/carousels/MarketCarousel";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { PROP_CUSTOMER_QUOTES, PEOPLE_EMPLOYEE_QUOTES } from "@/data/site/quoteCarousels";
import { PORT_CUSTOMERS, INV_INVESTORS } from "@/data/site/logoMarquees";
import { PROP_MARKET_CAROUSEL } from "@/data/site/marketCarousel";
import { PORT_OUR_ASSETS, DEV_WHAT_WE_DEVELOP, DC_EXPLORE_PORTFOLIO } from "@/data/site/bentoAccordion";

export const metadata: Metadata = { title: "Carousels | ESR prototype" };

/** Dev label between previews. Not part of any page. */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="border-y border-line bg-white px-6 py-2 font-mono text-[12px] leading-5 text-muted md:px-10 lg:px-20">{children}</p>;
}

/** Developer gallery of the "carousels" section components with real wireframe copy. Not linked from the site. */
export default function CarouselsGallery() {
  return (
    <PageShell>
      <h1 className="sr-only">Carousels gallery</h1>

      <Label>B16 MarketCarousel (PROP §4), after the PROP §3 SectionHeading for context</Label>
      <SectionHeading
        title="Explore our properties around the world"
        sub="Quis nis ullarper vestibulum eros. Suspendisse lacus lectus molestie id et, nibh tellus in."
      />
      <MarketCarousel {...PROP_MARKET_CAROUSEL} />

      <Label>B10 QuoteCarousel, customer: dots + white top strip (PROP §5)</Label>
      <QuoteCarousel {...PROP_CUSTOMER_QUOTES} />

      <Label>B10 QuoteCarousel, employee: bars (PEOPLE §5)</Label>
      <QuoteCarousel {...PEOPLE_EMPLOYEE_QUOTES} />

      <Label>B11 LogoMarquee, customers (PORT §5, PROP §6)</Label>
      <LogoMarquee {...PORT_CUSTOMERS} />

      <Label>B11 LogoMarquee, investors (INV §7)</Label>
      <LogoMarquee {...INV_INVESTORS} />

      <Label>B14 BentoAccordion, &quot;Our assets&quot; (PORT §3)</Label>
      <BentoAccordion {...PORT_OUR_ASSETS} />

      <Label>B14 BentoAccordion, &quot;What we develop&quot;, currentHref /portfolio/developments (DEV §6)</Label>
      <BentoAccordion {...DEV_WHAT_WE_DEVELOP} />

      <Label>B14 BentoAccordion, &quot;Explore the portfolio&quot;, currentHref /portfolio/data-centres (DC §8)</Label>
      <BentoAccordion {...DC_EXPLORE_PORTFOLIO} />
    </PageShell>
  );
}
