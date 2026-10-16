import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ArticleDetail } from "@/components/sections/news/ArticleDetail";
import { ARTICLES, articleBySlug } from "@/data/site/news-detail";

type Params = { params: Promise<{ slug: string }> };

/** One static page per article card on the group site (data/site/news-detail.ts); any other slug is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return ARTICLES.group.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug("group", slug);
  return { title: `${a?.title ?? "Article"} | ESR — website prototype` };
}

/**
 * /news/[slug]: News and insights detail, Figma Primary wireframes section "News and insights detail page"
 * (1508:33350): "News detail_Group" 1508:34602 (1440) and "News detail_Group / mob" 1519:36767 (390). Every group
 * article shares the drawn body; the title, date and tags are the card's. The drawn article itself is at
 * /news/esr-announces-strategic-expansion-into-the-middle-east. Header active item: News and insights.
 */
export default async function NewsArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = articleBySlug("group", slug);
  if (!article) notFound();

  return (
    <PageShell>
      <ArticleDetail site="group" article={article} />
    </PageShell>
  );
}
