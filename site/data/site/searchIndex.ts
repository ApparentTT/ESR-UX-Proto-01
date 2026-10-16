/**
 * Site search index: everything the header search and /search look through, built from the prototype's
 * own content (no copy is written here beyond the type labels):
 * - pages: every page in PAGES (config/site.ts) but the two search pages, plus the property search entry
 *   page. Group pages show their page intro; local market pages (/jp...) show their section name.
 * - news articles, case studies, leaders, documents and funds, from their data modules.
 *
 * href is where a result goes (null = inert: the item has no page in the prototype, as on the page that
 * lists it). path is the URL path shown on the result: the item's own page, or the page that lists it.
 */
import { PAGES } from "@/config/site";
import { MARKET } from "@/config/market";
import { NAV_SECTIONS } from "@/config/nav";
import { NEWS_ARTICLES, NEWS_INTRO, NEWS_MARKETS, NEWS_TOPICS, NEWS_TYPES } from "@/data/site/news";
import { CAP_CASE_STUDIES, SCS_CASE_STUDIES } from "@/data/site/caseStudies";
import { LEADERS } from "@/data/site/leaders";
import { CGOV_DOCUMENTS, SGOV_POLICIES } from "@/data/site/documents";
import { FLAGSHIP_FUNDS, FUND_ROWS, REITS, REITS_LABEL } from "@/data/site/funds";
import { HOME_WHO_WE_ARE } from "@/data/site/pages/home";
import { PORT_INTRO, PROP_INTRO } from "@/data/site/pages/portfolio";
import { DEV_INTRO } from "@/data/site/pages/developments";
import { DC_INTRO } from "@/data/site/pages/data-centres";
import { INV_INTRO } from "@/data/site/pages/investors";
import { SCS_INTRO, SGOV_INTRO, SUS_INTRO } from "@/data/site/pages/sustainability";
import { ABOUT_INTRO } from "@/data/site/pages/about";
import { LEAD_INTRO } from "@/data/site/pages/about-leadership";
import { CAP_INTRO } from "@/data/site/pages/about-proven-capability";
import { CGOV_INTRO } from "@/data/site/pages/about-corporate-governance";
import { PEOPLE_INTRO } from "@/data/site/pages/our-people";
import { CUSTOMERS_INTRO } from "@/data/site/pages/our-customers";
import { CONTACT_INTRO } from "@/data/site/pages/contact";
import { JOB_ALERTS_INTRO } from "@/data/site/pages/job-alerts";

export type SearchType = "page" | "local" | "news" | "case-study" | "leader" | "document" | "fund";

/** Result types in filter order: label on a result, plural on its filter. */
export const SEARCH_TYPES: { id: SearchType; label: string; plural: string }[] = [
  { id: "page", label: "Page", plural: "Pages" },
  { id: "local", label: "Japan site", plural: "Japan site" },
  { id: "news", label: "News", plural: "News" },
  { id: "case-study", label: "Case study", plural: "Case studies" },
  { id: "leader", label: "Leader", plural: "Leaders" },
  { id: "document", label: "Document", plural: "Documents" },
  { id: "fund", label: "Fund", plural: "Funds" },
];

export const searchTypeLabel = (t: SearchType) => SEARCH_TYPES.find((x) => x.id === t)?.label ?? t;

export type SearchEntry = {
  id: string;
  type: SearchType;
  title: string;
  excerpt: string;
  href: string | null;
  path: string;
  /** Searched as well as the title and excerpt (tags, groups, a leader's bio) */
  keywords: string[];
};

/** Not searched: the search pages themselves. */
const SEARCH_PAGES = new Set(["/search", "/news/search"]);

/** Group pages: the page's intro (or its opening statement) as the excerpt. */
const PAGE_EXCERPTS: Record<string, string> = {
  "/": HOME_WHO_WE_ARE.statement,
  "/portfolio": PORT_INTRO.body,
  "/portfolio/properties": PROP_INTRO.body,
  "/portfolio/developments": DEV_INTRO.body,
  "/portfolio/data-centres": DC_INTRO.body,
  "/investors": INV_INTRO.body,
  "/sustainability": SUS_INTRO.body,
  "/sustainability/governance": SGOV_INTRO.body,
  "/sustainability/case-studies": SCS_INTRO.body,
  "/news": NEWS_INTRO.body,
  "/about": ABOUT_INTRO.body,
  "/about/leadership": LEAD_INTRO.body,
  "/about/proven-capability": CAP_INTRO.body,
  "/about/corporate-governance": CGOV_INTRO.body,
  "/about/our-people": PEOPLE_INTRO.body,
  "/about/our-customers": CUSTOMERS_INTRO.body,
  "/contact": CONTACT_INTRO.body,
  "/about/careers/job-alerts": JOB_ALERTS_INTRO.body,
};

/** The header menu's title and line for a page, searched with it ("Industrial and logistics" finds Properties). */
const navWords = (href: string) =>
  NAV_SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.items))
    .filter((i) => i.href === href)
    .flatMap((i) => [i.title, i.text]);

const isLocal = (href: string) => href === "/jp" || href.startsWith("/jp/");

/** "Sustainable solutions  ·  Australia" (the wireframes' two spaces either side of the dot) as "Sustainable solutions · Australia". */
const tidy = (s: string) => s.replace(/\s+/g, " ").trim();

const label = <T extends string>(options: { id: T; label: string }[], id: T) => options.find((o) => o.id === id)?.label ?? id;

function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const p of PAGES) {
    if (SEARCH_PAGES.has(p.href)) continue;
    const local = isLocal(p.href);
    out.push({
      id: `page:${p.href}`,
      type: local ? "local" : "page",
      title: p.label,
      excerpt: PAGE_EXCERPTS[p.href] ?? p.group,
      href: p.href,
      path: p.href,
      keywords: [p.group, ...navWords(p.href)],
    });
  }
  // The property search entry page (not in PAGES): its page title and intro line
  out.push({
    id: "page:/properties",
    type: "page",
    title: "Find properties",
    excerpt: `Search warehouses, business parks and data centres across ${MARKET.name}.`,
    href: "/properties",
    path: "/properties",
    keywords: ["Find space for your business", "property search", "Our portfolio"],
  });

  for (const a of NEWS_ARTICLES) {
    const tags = [label(NEWS_MARKETS, a.market), label(NEWS_TYPES, a.type), label(NEWS_TOPICS, a.topic)];
    out.push({
      id: `news:${a.id}`,
      type: "news",
      title: a.headline,
      excerpt: [...tags, a.date].join(" · "),
      href: a.href,
      path: a.href ?? "/news",
      keywords: ["News and insights", "article"],
    });
  }

  SCS_CASE_STUDIES.forEach((c, i) =>
    out.push({
      id: `case:scs-${i}`,
      type: "case-study",
      title: c.title,
      excerpt: `${tidy(c.eyebrow)}. ${c.excerpt}`,
      href: c.href,
      path: c.href ?? "/sustainability/case-studies",
      keywords: ["Sustainability case studies"],
    }),
  );
  CAP_CASE_STUDIES.forEach((c, i) =>
    out.push({
      id: `case:cap-${i}`,
      type: "case-study",
      title: c.title,
      excerpt: tidy(c.meta),
      href: c.href,
      path: c.href ?? "/about/proven-capability",
      keywords: ["Proven capability"],
    }),
  );

  for (const l of LEADERS) {
    const role = Array.isArray(l.title) ? l.title.join(", ") : l.title;
    out.push({
      id: `leader:${l.name}`,
      type: "leader",
      title: l.name,
      excerpt: `${role}. ${l.bio}`,
      href: "/about/leadership",
      path: "/about/leadership",
      keywords: [l.group, "Our leadership"],
    });
  }

  const docs = [
    { list: CGOV_DOCUMENTS, page: "Corporate governance", path: "/about/corporate-governance" },
    { list: SGOV_POLICIES, page: "Governance and management", path: "/sustainability/governance" },
  ];
  for (const { list, page, path } of docs)
    for (const g of list.groups)
      for (const d of g.documents)
        out.push({
          id: `doc:${path}:${d.name}`,
          type: "document",
          title: d.name,
          excerpt: [page, g.label, list.format].filter(Boolean).join(" · "),
          href: d.href,
          path,
          keywords: [list.title, "download"],
        });

  FLAGSHIP_FUNDS.forEach((f, i) =>
    out.push({
      id: `fund:flagship-${i}`,
      type: "fund",
      title: f.name,
      excerpt: tidy(f.meta),
      href: f.cta.href,
      path: f.cta.href ?? "/investors",
      keywords: ["Flagship funds", "Invest with ESR"],
    }),
  );
  FUND_ROWS.forEach((f, i) =>
    out.push({
      id: `fund:row-${i}`,
      type: "fund",
      title: f.fund,
      excerpt: [f.strategy, f.markets, f.sector].join(" · "),
      href: f.link.href,
      path: f.link.href ?? "/investors#our-funds",
      keywords: ["Our funds", "Invest with ESR"],
    }),
  );
  for (const r of REITS)
    out.push({
      id: `fund:reit-${r.name}`,
      type: "fund",
      title: r.name,
      excerpt: `${REITS_LABEL} · ${tidy(r.meta)}`,
      href: r.href,
      path: r.href ?? "/investors",
      keywords: ["REIT", "Invest with ESR"],
    });

  return out;
}

/* ----------------------------------------------------------------- search */

/** Lower case, accents and apostrophes dropped, punctuation as spaces. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^\p{L}\p{N}²]+/gu, " ")
    .trim();

/** A loose stem so "property" finds "properties", "centre" finds "centres" and the other way round. */
const stem = (t: string) => (t.length > 4 ? t.replace(/(ies|es|s|y)$/, "") : t);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type Prepared = SearchEntry & { n: { title: string; excerpt: string; rest: string }; order: number };

let INDEX: Prepared[] | null = null;
/** Built once, on first use. */
function index(): Prepared[] {
  if (!INDEX)
    INDEX = buildIndex().map((e, order) => ({
      ...e,
      order,
      n: { title: norm(e.title), excerpt: norm(e.excerpt), rest: norm([...e.keywords, searchTypeLabel(e.type)].join(" ")) },
    }));
  return INDEX;
}

type Token = { text: string; start: RegExp; anywhere: boolean };
const toToken = (t: string): Token => ({ text: t, start: new RegExp(`(^|\\s)${escape(t)}`), anywhere: /[^\x00-\x7f]/.test(t) });

/** Where a token sits in a field: 2 at the start of a word, 1 inside one (non-Latin scripts only), 0 not at all. */
function hit(field: string, t: Token): number {
  if (t.start.test(field)) return 2;
  return t.anywhere && field.includes(t.text) ? 1 : 0;
}

/** Results types rank pages first, then the order of SEARCH_TYPES, on equal scores. */
const TYPE_RANK: Record<SearchType, number> = Object.fromEntries(SEARCH_TYPES.map((t, i) => [t.id, i])) as Record<SearchType, number>;

/**
 * Every entry that matches all the words of q (anywhere in its title, excerpt, tags or type), best first:
 * the whole phrase in the title, then words in the title, then in the excerpt, then elsewhere.
 * An empty q matches nothing.
 */
export function searchSite(q: string): SearchEntry[] {
  const phrase = norm(q);
  if (!phrase) return [];
  const tokens = phrase.split(" ").map((t) => toToken(stem(t)));
  const scored: { e: Prepared; score: number }[] = [];
  for (const e of index()) {
    let score = 0;
    let all = true;
    for (const t of tokens) {
      const inTitle = hit(e.n.title, t);
      const inExcerpt = inTitle ? 0 : hit(e.n.excerpt, t);
      const inRest = inTitle || inExcerpt ? 0 : hit(e.n.rest, t);
      if (!inTitle && !inExcerpt && !inRest) {
        all = false;
        break;
      }
      score += inTitle * 10 + inExcerpt * 3 + inRest;
    }
    if (!all) continue;
    if (e.n.title === phrase) score += 60;
    else if (e.n.title.startsWith(phrase)) score += 40;
    else if (e.n.title.includes(phrase)) score += 25;
    else if (e.n.excerpt.includes(phrase)) score += 8;
    scored.push({ e, score });
  }
  scored.sort((a, b) => b.score - a.score || TYPE_RANK[a.e.type] - TYPE_RANK[b.e.type] || a.e.order - b.e.order);
  return scored.map(({ e: { id, type, title, excerpt, href, path, keywords } }) => ({ id, type, title, excerpt, href, path, keywords }));
}

/** How many results of each type, in SEARCH_TYPES order (types with none left out). */
export function countByType(results: SearchEntry[]): { id: SearchType; label: string; plural: string; count: number }[] {
  return SEARCH_TYPES.map((t) => ({ ...t, count: results.filter((r) => r.type === t.id).length })).filter((t) => t.count > 0);
}

export const isSearchType = (v: string | null | undefined): v is SearchType => SEARCH_TYPES.some((t) => t.id === v);
