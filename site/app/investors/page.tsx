import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { FullWidthImage } from "@/components/sections/blocks/FullWidthImage";
import { TrackRecord } from "@/components/sections/stats/TrackRecord";
import { ProductSuite } from "@/components/sections/infocards/ProductSuite";
import { FundCards } from "@/components/sections/infocards/FundCards";
import { FundList } from "@/components/sections/listings/FundList";
import { LogoMarquee } from "@/components/sections/carousels/LogoMarquee";
import { NewsCardRow } from "@/components/sections/cards/NewsCardRow";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { TRACK_RECORD } from "@/data/site/trackRecord";
import { INV_PRODUCT_SUITE } from "@/data/site/productSuite";
import { INV_FLAGSHIP_FUNDS } from "@/data/site/flagshipFunds";
import { FUND_LIST } from "@/data/site/funds";
import { INV_INVESTORS } from "@/data/site/logoMarquees";
import { INV_LATEST, LATEST_HEADINGS } from "@/data/site/latest";
import { INV_INTRO } from "@/data/site/pages/investors";

export const metadata: Metadata = { title: "Invest with ESR | ESR — website prototype" };

/** /investors (INV): Group_InvestWithESR. Header active item: Investor. */
export default function InvestorsPage() {
  return (
    <PageShell>
      {/* §1 */}
      <PageIntro title={INV_INTRO.title} body={INV_INTRO.body} />
      {/* §2 "Strategy" image (the hidden text column is not built) */}
      <FullWidthImage />
      {/* §3 "Our investment track record": bold5 stats + AUM stacked bar chart */}
      <TrackRecord {...TRACK_RECORD} />
      {/* §4 "Investment product suite": asset classes + listed REITs */}
      <ProductSuite {...INV_PRODUCT_SUITE} />
      {/* §5 "Flagship funds across the group" */}
      <FundCards {...INV_FLAGSHIP_FUNDS} />
      {/* §6 "Our funds": filters + fund table */}
      <FundList {...FUND_LIST} />
      {/* §7 "Our investors" logo strip */}
      <LogoMarquee {...INV_INVESTORS} />
      {/* §8a–b "The latest from across our markets" */}
      <SectionHeading {...LATEST_HEADINGS.investors} />
      <NewsCardRow cards={INV_LATEST} />
      {/* §9 */}
      <FormBlock variant="investorEnquiry" />
    </PageShell>
  );
}
