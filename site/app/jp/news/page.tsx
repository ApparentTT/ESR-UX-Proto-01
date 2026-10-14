import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { MarketCtaStrip } from "@/components/sections/news/MarketCtaStrip";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { LocalNewsBrowser } from "@/components/sections/local/LocalNewsBrowser";
import { JP_NEWS_ARTICLES, JP_NEWS_FEATURED, JP_NEWS_GROUP_CTA, JP_NEWS_INTRO } from "@/data/site/local/news";

export const metadata: Metadata = { title: "News and insights | ESR Japan — website prototype" };

/**
 * /jp/news: Local_NewsAndInsights (Primary wireframes 1289:109057, mobile 1289:109058). Local nav: News and insights.
 * Search, filters and sort work in place (URL params), like the group /news + /news/search pair.
 */
export default function JapanNewsPage() {
  return (
    <LocalPageShell>
      <PageIntro title={JP_NEWS_INTRO.title} body={JP_NEWS_INTRO.body} />
      <LocalNewsBrowser featured={JP_NEWS_FEATURED} articles={JP_NEWS_ARTICLES} />
      {/* "News from across the ESR group" → group News and insights */}
      <MarketCtaStrip
        market="ESR group"
        headingTemplate={JP_NEWS_GROUP_CTA.title}
        sub={JP_NEWS_GROUP_CTA.sub}
        showNote={false}
        buttonTemplate={JP_NEWS_GROUP_CTA.cta.label}
        href={JP_NEWS_GROUP_CTA.cta.href}
      />
      <FormBlock variant="mediaEnquiry" id="media-enquiries" fields={["name", "email", "message", "consent"]} />
    </LocalPageShell>
  );
}
