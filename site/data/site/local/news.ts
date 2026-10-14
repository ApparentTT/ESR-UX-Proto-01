/**
 * /jp/news: Local_NewsAndInsights (Primary wireframes 1289:109057, mobile 1289:109058), verbatim.
 * The frame is drawn for Australia and New Zealand: as in the local navigation, the market name reads "Japan".
 * Search, Content type, Topic and sort filter the records in place (URL params ?q= ?type= ?topic= ?sort=, which
 * the local nav's Thought leadership / Press releases / Case studies links use). Cards show content type and
 * topic, as drawn. Records 7-10 are the group's "data centres" press releases, appended by "Load more articles".
 */
import type { NewsArticle } from "@/data/site/news";
import { NEWS_FEATURED } from "@/data/site/news";

export const JP_NEWS_INTRO = {
  title: "News and insights",
  body: "Announcements, thought leadership and case studies from ESR Japan.",
};

/** Same featured article as the group page */
export const JP_NEWS_FEATURED = NEWS_FEATURED;

type LocalArticle = Omit<NewsArticle, "market">;
const H = "Article headline placeholder";
const H_DC = "Article headline placeholder mentioning data centres";

export const JP_NEWS_ARTICLES: LocalArticle[] = [
  { id: "jp-news-01", type: "press-release", topic: "development", headline: H, date: "1 July 2026", isoDate: "2026-07-01", href: null },
  { id: "jp-news-02", type: "thought-leadership", topic: "esg-and-sustainability", headline: H, date: "28 June 2026", isoDate: "2026-06-28", href: null },
  { id: "jp-news-03", type: "case-study", topic: "development", headline: H, date: "21 June 2026", isoDate: "2026-06-21", href: null },
  { id: "jp-news-04", type: "press-release", topic: "fund-management", headline: H, date: "14 June 2026", isoDate: "2026-06-14", href: null },
  { id: "jp-news-05", type: "case-study", topic: "data-centres", headline: H, date: "7 June 2026", isoDate: "2026-06-07", href: null },
  { id: "jp-news-06", type: "thought-leadership", topic: "development", headline: H, date: "1 June 2026", isoDate: "2026-06-01", href: null },
  { id: "jp-news-07", type: "press-release", topic: "data-centres", headline: H_DC, date: "1 July 2026", isoDate: "2026-07-01", href: null },
  { id: "jp-news-08", type: "press-release", topic: "data-centres", headline: H_DC, date: "28 June 2026", isoDate: "2026-06-28", href: null },
  { id: "jp-news-09", type: "press-release", topic: "data-centres", headline: H_DC, date: "14 June 2026", isoDate: "2026-06-14", href: null },
  { id: "jp-news-10", type: "press-release", topic: "data-centres", headline: H_DC, date: "2 June 2026", isoDate: "2026-06-02", href: null },
];
export type JpNewsArticle = LocalArticle;

/** "News from across the ESR group": the group News and insights page */
export const JP_NEWS_GROUP_CTA = {
  title: "News from across the ESR group",
  sub: "Group announcements, fund news and thought leadership from our markets across Asia Pacific.",
  cta: { label: "Go to group news", href: "/news" },
};
