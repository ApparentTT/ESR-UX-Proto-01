import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { NewsSearchFilters } from "@/components/sections/news/NewsSearchFilters";
import { NewsListingSection } from "@/components/sections/news/NewsListingSection";
import { MarketCtaFromSearch } from "@/components/sections/news/MarketCtaFromSearch";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { NEWS_INTRO } from "@/data/site/news";

export const metadata: Metadata = { title: "News search results | ESR — website prototype" };

/**
 * /news/search (NSR): NewsSearch results state. Header active item: News and insights.
 * Reads ?q=, ?market=, ?type=, ?topic= and ?sort= on the client (the header search and the footer
 * "News and insights" links land here). No params shows the wireframe state: “data centres” + Press release.
 * The featured article and "All stories" are replaced by the results list.
 */
export default function NewsSearchPage() {
  return (
    <PageShell>
      {/* NEWS §1, kept for continuity (NSR open question 1) */}
      <PageIntro title={NEWS_INTRO.title} body={NEWS_INTRO.body} />
      {/* NSR §1 filled search field + applied filters */}
      <NewsSearchFilters mode="results" />
      {/* NSR §2 results head + grid (Load more above 6 results) */}
      <NewsListingSection variant="newsResults" />
      {/* NEWS §5, only while a market filter is applied */}
      <MarketCtaFromSearch />
      {/* NEWS §6 */}
      <FormBlock variant="mediaEnquiry" />
    </PageShell>
  );
}
