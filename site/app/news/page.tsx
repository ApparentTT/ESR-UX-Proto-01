import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { NewsSearchFilters } from "@/components/sections/news/NewsSearchFilters";
import { FeaturedArticle } from "@/components/sections/news/FeaturedArticle";
import { NewsListingSection } from "@/components/sections/news/NewsListingSection";
import { MarketCtaStrip } from "@/components/sections/news/MarketCtaStrip";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { NEWS_FEATURED, NEWS_INTRO, NEWS_MARKET_CTA } from "@/data/site/news";

export const metadata: Metadata = { title: "News and insights | ESR — website prototype" };

/**
 * /news (NEWS): Group_NewsAndInsights. Header active item: News and insights.
 * Any search, filter or sort choice goes to /news/search with URL params (NEWS §2, open question 1).
 */
export default function NewsPage() {
  return (
    <PageShell>
      {/* §1 */}
      <PageIntro title={NEWS_INTRO.title} body={NEWS_INTRO.body} />
      {/* §2 search field + filter bar, empty state */}
      <NewsSearchFilters mode="news" />
      {/* §3 featured article (surface band, continues into §4) */}
      <FeaturedArticle {...NEWS_FEATURED} />
      {/* §4 "All stories": 6 cards, "Load more articles" appends the 4 remaining records */}
      <NewsListingSection variant="newsAll" />
      {/* §5 market CTA, rendered as drawn: Japan with the designer note */}
      <MarketCtaStrip market="Japan" {...NEWS_MARKET_CTA} />
      {/* §6 */}
      <FormBlock variant="mediaEnquiry" />
    </PageShell>
  );
}
