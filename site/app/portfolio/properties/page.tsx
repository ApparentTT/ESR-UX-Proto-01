import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MarketCarousel } from "@/components/sections/carousels/MarketCarousel";
import { QuoteCarousel } from "@/components/sections/carousels/QuoteCarousel";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { SplitBlock } from "@/components/sections/blocks/SplitBlock";
import { MediaCardGrid } from "@/components/sections/cards/MediaCardGrid";
import { PROP_PORTFOLIO_CARDS } from "@/components/sections/cards/presets";
import { Accordion } from "@/components/sections/listings/Accordion";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { PROP_MARKET_CAROUSEL } from "@/data/site/marketCarousel";
import { PROP_CUSTOMER_QUOTES } from "@/data/site/quoteCarousels";
import { PROP_CUSTOMERS } from "@/data/site/logoMarquees";
import { PORTFOLIO_FAQ } from "@/data/site/documents";
import {
  INVEST_WITH_ESR,
  PROP_INTRO,
  PROP_INTRO_ACTIONS,
  PROP_MARKETS_HEADING,
  PROP_PORTFOLIO_HEADING,
} from "@/data/site/pages/portfolio";

export const metadata: Metadata = { title: "Properties | ESR — website prototype" };

/** /portfolio/properties (PROP): R2_Group_Properties. Header active item: Our portfolio. */
export default function PortfolioPropertiesPage() {
  return (
    <PageShell>
      {/* §1–2 intro + CTAs into the property search: 72px under the body (32px PageIntro gap + 40px padding; padding, not margin, so it does not collapse), 72px under the buttons */}
      <PageIntro title={PROP_INTRO.title} body={PROP_INTRO.body} pb="lg">
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:pt-4 lg:pt-10">
          {PROP_INTRO_ACTIONS.map((a) => (
            <Button key={a.label} href={a.href} variant={a.variant} className="w-full md:w-auto">
              {a.label}
            </Button>
          ))}
        </div>
      </PageIntro>
      {/* §3 */}
      <SectionHeading title={PROP_MARKETS_HEADING.title} sub={PROP_MARKETS_HEADING.sub} />
      {/* §4 market carousel */}
      <MarketCarousel {...PROP_MARKET_CAROUSEL} />
      {/* §5 customer quotes */}
      <QuoteCarousel {...PROP_CUSTOMER_QUOTES} />
      {/* §6 customer logos */}
      <LogoMarquee {...PROP_CUSTOMERS} />
      {/* §7 */}
      <SplitBlock {...INVEST_WITH_ESR} />
      {/* §8–9 */}
      <SectionHeading title={PROP_PORTFOLIO_HEADING} />
      <MediaCardGrid variant="products3" cards={PROP_PORTFOLIO_CARDS} />
      {/* §10 */}
      <Accordion {...PORTFOLIO_FAQ} />
      {/* §11 */}
      <FormBlock variant="newsletter" />
    </PageShell>
  );
}
