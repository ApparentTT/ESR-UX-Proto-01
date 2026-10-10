import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { NewsSearchFilters } from "@/components/sections/news/NewsSearchFilters";
import { FeaturedArticle } from "@/components/sections/news/FeaturedArticle";
import { NewsListingSection } from "@/components/sections/news/NewsListingSection";
import { MarketCtaStrip } from "@/components/sections/news/MarketCtaStrip";
import { MarketCtaFromSearch } from "@/components/sections/news/MarketCtaFromSearch";
import { NEWS_FEATURED, NEWS_INTRO, NEWS_MARKET_CTA } from "@/data/site/news";

export const metadata: Metadata = { title: "News | ESR prototype" };

/** The preview filters in place on this page instead of going to /news/search. */
const DEV = { searchPath: "/dev/news", basePath: "/dev/news" };

/** Dev label between previews. Not part of any page. */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="border-y border-line bg-white px-6 py-2 font-mono text-[12px] leading-5 text-muted md:px-10 lg:px-20">{children}</p>;
}

const TRY = [
  ["no params (wireframe state)", "/dev/news"],
  ["?type=case-study", "/dev/news?type=case-study"],
  ["?market=japan", "/dev/news?market=japan"],
  ["?q=data centres&market=south-korea&topic=data-centres", "/dev/news?q=data%20centres&market=south-korea&topic=data-centres"],
  ["?sort=recent (10 results, load more)", "/dev/news?sort=recent"],
  ["?q=data centres&market=australia (0 results)", "/dev/news?q=data%20centres&market=australia"],
] as const;

/** Developer gallery of the news section components (B32 news variants, B33, B34, B35) with real wireframe copy. Not linked from the site. */
export default function NewsGallery() {
  return (
    <PageShell>
      <div className="bg-white px-6 pb-4 pt-8 md:px-10 lg:px-20">
        <p className="text-[24px] font-semibold tracking-[-0.02em] text-ink">News gallery</p>
        <p className="mt-1 text-[14px] leading-5 text-muted">
          B33 NewsSearchFilters, B34 FeaturedArticle, B32 NewsListingSection (newsAll, newsResults), B35 MarketCtaStrip. The live instances read this page&apos;s URL:
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] leading-5">
          {TRY.map(([label, href]) => (
            <li key={href}>
              <Link href={href} scroll={false} className="text-ink underline underline-offset-2">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Label>/news composition. B2 PageIntro (context only) + B33 NewsSearchFilters mode=&quot;news&quot; (NEWS §1–2). Choices navigate to the results URL</Label>
      <PageIntro title={NEWS_INTRO.title} body={NEWS_INTRO.body} />
      <NewsSearchFilters mode="news" {...DEV} />

      <Label>B34 FeaturedArticle (NEWS §3)</Label>
      <FeaturedArticle {...NEWS_FEATURED} />

      <Label>B32 NewsListingSection variant=&quot;newsAll&quot; (NEWS §4). Load more appends the 4 remaining records, then hides</Label>
      <NewsListingSection variant="newsAll" />

      <Label>B35 MarketCtaStrip, Japan with the designer note (NEWS §5)</Label>
      <MarketCtaStrip market="Japan" {...NEWS_MARKET_CTA} />

      <Label>/news/search composition. B33 NewsSearchFilters mode=&quot;results&quot;, live from the URL (no params = wireframe state, NSR §1)</Label>
      <NewsSearchFilters mode="results" {...DEV} />

      <Label>B32 NewsListingSection variant=&quot;newsResults&quot;, live from the URL (NSR §2)</Label>
      <NewsListingSection variant="newsResults" basePath={DEV.basePath} />

      <Label>B35 MarketCtaFromSearch, live: renders only while ?market= is a market (not Group)</Label>
      <MarketCtaFromSearch />

      <Label>B33 results mode, fixed state: market + type + topic chips (state prop)</Label>
      <NewsSearchFilters mode="results" state={{ market: "south-korea", type: "press-release", topic: "data-centres" }} {...DEV} />

      <Label>B32 newsResults, fixed state: no query, three filters (1 result, singular heading)</Label>
      <NewsListingSection variant="newsResults" state={{ market: "south-korea", type: "press-release", topic: "data-centres" }} basePath={DEV.basePath} />

      <Label>B32 newsResults, fixed state: zero results (q=data centres, market=australia)</Label>
      <NewsListingSection variant="newsResults" state={{ q: "data centres", market: "australia" }} basePath={DEV.basePath} />

      <Label>B35 MarketCtaFromSearch, fixed state market=south-korea (results-page look, no note)</Label>
      <MarketCtaFromSearch state={{ market: "south-korea" }} />
    </PageShell>
  );
}
