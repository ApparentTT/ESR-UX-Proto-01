import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { ArticleDetail } from "@/components/sections/news/ArticleDetail";
import { ARTICLES, articleBySlug } from "@/data/site/news-detail";

type Params = { params: Promise<{ slug: string }> };

/** One static page per article card on the Japan site (data/site/news-detail.ts); any other slug is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return ARTICLES.jp.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug("jp", slug);
  return { title: `${a?.title ?? "Article"} | ESR Japan — website prototype` };
}

/**
 * /jp/news/[slug]: local News and insights detail, Figma Primary wireframes section "News and insights detail page"
 * (1508:33350). Press releases and news: "News detail_local" 1508:34788 (1440) / 1519:37576 (390). Thought
 * leadership and case studies: "News detail_local" 1508:35676 (1440) / 1519:37809 (390), with the media mosaic.
 * The frames are drawn for Australia and New Zealand; the drawn article itself is at
 * /jp/news/esr-appoints-reini-otter-as-ceo-of-australia-and-new-zealand-business. Local nav: News and insights.
 */
export default async function JapanNewsArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = articleBySlug("jp", slug);
  if (!article) notFound();

  return (
    <LocalPageShell>
      <ArticleDetail site="jp" article={article} />
    </LocalPageShell>
  );
}
