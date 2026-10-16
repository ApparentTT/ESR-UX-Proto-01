/**
 * News and insights detail (article) pages: Figma Primary wireframes, section "News and insights detail page"
 * (1508:33350), verbatim. Three drawn bodies share one page template:
 * - Group "News detail_Group" 1508:34602 (390: 1519:36767): summary points, hero image, body, quote, body.
 * - Local "News detail_local" 1508:34788 (390: 1519:37576): "Topline summary points", quote, body (a press release).
 * - Local "News detail_local" 1508:35676 (390: 1519:37809): summary, lorem body, media mosaic, quote, lorem body.
 *
 * Every article card on the site links to one of these pages: its href is the page URL ("/news/<slug>" or
 * "/jp/news/<slug>"), and the slug is read back from it. Each page takes its title, date and tags from the card's
 * record and the body from the drawn frame. Group articles use the group body. Japan articles use the local press
 * release body for press releases and news, and the local media body for thought leadership and case studies.
 * The drawn articles themselves ("ESR Announces Strategic Expansion…", "ESR Appoints Reini Otter…") are extra
 * pages that no card lists.
 */
import type { NewsCardData } from "@/components/sections/cards/NewsCard";
import { HOME_LATEST, INV_LATEST } from "@/data/site/latest";
import { JP_HOME_LATEST } from "@/data/site/local/home";
import { JP_NEWS_ARTICLES, JP_NEWS_FEATURED, type JpNewsArticle } from "@/data/site/local/news";
import { NEWS_ARTICLES, NEWS_FEATURED, NEWS_MARKETS, NEWS_TOPICS, NEWS_TYPES, type NewsArticle } from "@/data/site/news";

/* ----------------------------------------------------------------- bodies */

/** One body block. "column" is the 1085px text column (text and quotes, 28px apart). */
export type ArticleBlock =
  | { kind: "column"; /** 40px above */ padTop?: boolean; /** 40px below instead of 72 */ tight?: boolean; items: ({ kind: "text"; paragraphs: string[] } | { kind: "quote"; quote: string; cite?: string })[] }
  | { kind: "hero" }
  | { kind: "gallery" };

export type ArticleBody = { summary: string[]; blocks: ArticleBlock[] };

const GROUP_QUOTE =
  "“The GCC presents a compelling opportunity for ESR to bring together our development, fund management, and operating capabilities in a region characterised by economic dynamism, sustained infrastructure investment and resilient long-term fundamentals.”";

/** 1508:34649 + 1508:34670 + 1508:34672 */
export const GROUP_BODY: ArticleBody = {
  summary: [
    "Building a scalable logistics real estate and data centres platform to capture opportunities driven by strong structural demand across the region",
    "Pipeline of more than 3 million sqm across logistics and digital infrastructure assets, with a potential end value in excess of US$10 billion",
    "Establishing an on-the-ground team to bring ESR’s development, asset management, and capital formation expertise to the GCC",
  ],
  blocks: [
    { kind: "hero" },
    {
      kind: "column",
      items: [
        {
          kind: "text",
          paragraphs: [
            "ESR today announced its strategic expansion into the Middle East, with plans to establish a long-term logistics real estate and data centres platform across the Gulf Cooperation Council (“GCC”).",
            "Initially focused on Saudi Arabia and the United Arab Emirates (“UAE”), ESR has identified a pipeline of over 3 million sqm across logistics and digital infrastructure assets, with a potential end value in excess of US$10 billion.",
            "Economic growth, expanding trade corridors, evolving supply chains and rising institutional investment are driving demand for modern logistics and digital infrastructure across the GCC. At the same time, modern institutional-grade logistics facilities remain in short supply, accounting for less than 20% of total stock in the UAE and less than 10% in Saudi Arabia, driving near-full occupancy of Grade A facilities in these markets.",
            "ESR’s strategy combines local market knowledge, relationships, and execution capabilities with its development, asset management, and capital formation expertise. The Group benefits from longstanding relationships with leading institutions and stakeholders across the region, including those developed through ESR’s shareholder base and broader capital partner network. Drawing on a proven approach that has enabled its growth across multiple markets, ESR is engaging with strategic partners and investors to establish a scalable business across the GCC.",
            "The expansion represents a natural extension of ESR’s Asia-Pacific platform and strategy, building on the Group’s track record of developing and scaling institutional-grade logistics platforms in high-growth markets. As economic, commercial and supply chain links between Asia and the Middle East continue to strengthen, ESR is well positioned to apply the development capabilities, customer relationships, capital partnerships, and operating expertise that have underpinned its success to support the next phase of growth in the GCC.",
            "Stuart Gibson, Co-founder and Co-CEO, ESR, said, “The GCC presents a compelling opportunity for ESR to bring together our development, fund management, and operating capabilities in a region characterised by economic dynamism, sustained infrastructure investment and resilient long-term fundamentals.",
          ],
        },
        { kind: "quote", quote: GROUP_QUOTE, cite: "Stuard Gibson, Co-Founder and Co-CEO, ESR" },
        {
          kind: "text",
          paragraphs: [
            "“Across our portfolio, we have helped shape logistics markets by delivering institutional-grade facilities that combine operational excellence with human-centric design. As markets evolve, we believe success is defined not only by scale, but by our ability to raise standards for customers and create environments where people and businesses can thrive. Our ambition is to bring that same approach to the GCC, providing customers with the quality, functionality and experience that they have come to expect from ESR.”",
            "Phil Pearce, President, ESR, said, “The Middle East sits at the intersection of some of the world’s most important trade and investment corridors and is experiencing strong demand for modern logistics infrastructure. By combining local market expertise with ESR’s logistics real estate and data centre capabilities, longstanding relationships with regional stakeholders, and a global network of institutional capital partners, we are well positioned to support the next phase of the region’s Industrial and logistics development. Our ambition is to build a durable regional platform that delivers long-term value for customers, investors, and communities across the GCC.”",
            "To support its regional ambitions, ESR has already made senior hires and established an on-the-ground team spanning development, investment, and asset management. The team is leading project origination and delivery, capital deployment, and strategic partnerships across the GCC, with capabilities continuing to expand as the business grows.",
          ],
        },
      ],
    },
  ],
};

const TOPLINE = ["Topline summary points", "Topline summary points", "Topline summary points"];

/** 1508:34848 + 1508:34871 (the quote has no attribution at 1440; 390 draws the group quote instead) */
export const LOCAL_PRESS_BODY: ArticleBody = {
  summary: TOPLINE,
  blocks: [
    {
      kind: "column",
      items: [
        {
          kind: "quote",
          quote:
            "“Reini brings more than 25 years of experience in industrial and commercial property development across Australia and Europe. He joins ESR from Frasers Property Group, where he held several senior leadership positions, most recently serving as Chief Executive Officer of Frasers Property Industrial.”",
        },
        {
          kind: "text",
          paragraphs: [
            "ESR, an Asia-Pacific focused real asset owner and manager, has appointed Reini Otter as Chief Executive Officer, Australia and New Zealand.",
            "Based in Sydney, Reini will lead ESR’s Australia and New Zealand business, with responsibility for driving the next phase of growth across the region. He will focus on strengthening customer and capital partner relationships, accelerating the delivery of ESR’s fund management and development platform in logistics real estate and data centres, and supporting long-term value creation across one of the company’s most strategically important markets.",
            "The appointment reflects ESR’s continued commitment to strengthening its leadership capability as it builds on its market-leading position and continues to expand its platform to meet growing customer and investor demand.",
            "Reini brings more than 25 years of experience in industrial and commercial property development across Australia and Europe. He joins ESR from Frasers Property Group, where he held several senior leadership positions, most recently serving as Chief Executive Officer of Frasers Property Industrial.",
            "Reini succeeds Phil Pearce, who established ESR’s Australia and New Zealand business in 2018 and grew it into one of the Pacific region’s leading industrial and logistics platforms, with A$22.9 billion in assets under management and a A$10.2 billion development pipeline.",
            "Following ESR’s privatisation in 2025, Phil was appointed President, with responsibility for the day-to-day execution of the company’s strategic priorities and operations, including oversight of regional leadership teams across the business, to drive ESR’s long-term growth.",
          ],
        },
      ],
    },
  ],
};

const LOREM_BODY = [
  "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.",
  "Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.",
];

/** 1508:35736 + 1508:36060 + 1508:36039 + 1508:35759 + 1508:36064 */
export const LOCAL_MEDIA_BODY: ArticleBody = {
  summary: TOPLINE,
  blocks: [
    { kind: "column", padTop: true, items: [{ kind: "text", paragraphs: LOREM_BODY }] },
    { kind: "gallery" },
    {
      kind: "column",
      padTop: true,
      tight: true,
      items: [
        {
          kind: "quote",
          quote:
            "“Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.”",
          cite: "Name, Position, Company",
        },
      ],
    },
    { kind: "column", padTop: true, items: [{ kind: "text", paragraphs: LOREM_BODY }] },
  ],
};

/* ---------------------------------------------------------------- copy */

export const ARTICLE_COPY = {
  /** Breadcrumb root */
  crumb: { label: "News and insights" },
  downloadPdf: "Download PDF",
  share: { share: "Share", copy: "Copy link", copied: "Link copied", email: "Email", linkedin: "LinkedIn", x: "X", line: "LINE" },
  relatedTitle: "Related articles",
  /** "OtherMarkets" 1508:34725 (group only; hidden on the local frames) */
  marketsTitle: "Looking in another market?",
  markets: ["Australia and New Zealand", "Greater China", "South Korea", "Singapore", "India"],
  /** Alt text for the image placeholders */
  heroLabel: "Article image",
  videoLabel: "Play video",
};

/* -------------------------------------------------------------- articles */

export type ArticleSite = "group" | "jp";

export type ArticleRecord = {
  slug: string;
  title: string;
  date: string;
  /** Market, content type, topic (as drawn on the intro and the cards) */
  tags: string[];
  body: ArticleBody;
};

const label = <T extends string>(opts: { id: T; label: string }[], id: T) => opts.find((o) => o.id === id)?.label ?? "";
const slugOf = (href: string | null | undefined) => href?.split("?")[0].split("/").pop() || null;
/** "Press release · Japan" (sometimes with two spaces either side) → ["Japan", "Press release"] */
const metaTags = (meta: string) => meta.split("·").map((s) => s.trim()).reverse();
const LOCAL_PRESS_TYPES = ["Press release", "News"];
const localBody = (type: string) => (LOCAL_PRESS_TYPES.includes(type) ? LOCAL_PRESS_BODY : LOCAL_MEDIA_BODY);

export const groupArticleTags = (a: NewsArticle) => [label(NEWS_MARKETS, a.market), label(NEWS_TYPES, a.type), label(NEWS_TOPICS, a.topic)];
/** Japan records have no market field: the market tag reads "Japan" */
export const jpArticleTags = (a: JpNewsArticle) => ["Japan", label(NEWS_TYPES, a.type), label(NEWS_TOPICS, a.topic)];

function fromCards(cards: NewsCardData[], body: (type: string) => ArticleBody): ArticleRecord[] {
  return cards.flatMap((c) => {
    const slug = slugOf(c.href);
    const tags = metaTags(c.meta);
    return slug ? [{ slug, title: c.title, date: c.date, tags, body: body(tags[1] ?? "") }] : [];
  });
}

function unique(records: ArticleRecord[]) {
  const seen = new Set<string>();
  return records.filter((r) => !seen.has(r.slug) && seen.add(r.slug));
}

/** The drawn group article, served at its own URL (not listed on any card) */
export const GROUP_DRAWN_SLUG = "esr-announces-strategic-expansion-into-the-middle-east";
/** The drawn local article (press release), served at its own URL (not listed on any card) */
export const JP_DRAWN_SLUG = "esr-appoints-reini-otter-as-ceo-of-australia-and-new-zealand-business";

const GROUP_ARTICLES: ArticleRecord[] = unique([
  ...NEWS_ARTICLES.flatMap((a) => {
    const slug = slugOf(a.href);
    return slug ? [{ slug, title: a.headline, date: a.date, tags: groupArticleTags(a), body: GROUP_BODY }] : [];
  }),
  ...(slugOf(NEWS_FEATURED.href)
    ? [{ slug: slugOf(NEWS_FEATURED.href)!, title: NEWS_FEATURED.headline, date: NEWS_FEATURED.date, tags: NEWS_FEATURED.tags, body: GROUP_BODY }]
    : []),
  ...fromCards([...HOME_LATEST, ...INV_LATEST], () => GROUP_BODY),
  { slug: GROUP_DRAWN_SLUG, title: "ESR Announces Strategic Expansion into the Middle East", date: "8 October 2026", tags: ["Group", "Press release", "Development"], body: GROUP_BODY },
]);

const JP_ARTICLES: ArticleRecord[] = unique([
  ...JP_NEWS_ARTICLES.flatMap((a) => {
    const slug = slugOf(a.href);
    const tags = jpArticleTags(a);
    return slug ? [{ slug, title: a.headline, date: a.date, tags, body: localBody(tags[1]) }] : [];
  }),
  ...(slugOf(JP_NEWS_FEATURED.href)
    ? [{ slug: slugOf(JP_NEWS_FEATURED.href)!, title: JP_NEWS_FEATURED.headline, date: JP_NEWS_FEATURED.date, tags: JP_NEWS_FEATURED.tags, body: LOCAL_PRESS_BODY }]
    : []),
  ...fromCards(JP_HOME_LATEST, localBody),
  {
    slug: JP_DRAWN_SLUG,
    title: "ESR Appoints Reini Otter as CEO of Australia and New Zealand Business",
    date: "17 July 2026",
    tags: ["Australia", "New Zealand", "Press release", "Leadership"],
    body: LOCAL_PRESS_BODY,
  },
]);

export const ARTICLES: Record<ArticleSite, ArticleRecord[]> = { group: GROUP_ARTICLES, jp: JP_ARTICLES };
export const NEWS_ROOT: Record<ArticleSite, string> = { group: "/news", jp: "/jp/news" };

export function articleBySlug(site: ArticleSite, slug: string) {
  return ARTICLES[site].find((a) => a.slug === slug);
}

export type RelatedArticle = { tags: string[]; headline: string; date: string; href: string | null };

/** "Related articles": the first three listed articles of the same site, other than this one */
export function relatedArticles(site: ArticleSite, slug: string): RelatedArticle[] {
  const list =
    site === "group"
      ? NEWS_ARTICLES.map((a) => ({ tags: groupArticleTags(a), headline: a.headline, date: a.date, href: a.href }))
      : JP_NEWS_ARTICLES.map((a) => ({ tags: jpArticleTags(a), headline: a.headline, date: a.date, href: a.href }));
  return list.filter((a) => slugOf(a.href) !== slug).slice(0, 3);
}
