import { Breadcrumb } from "@/components/sections/local/LocalIntro";
import { MarketChips } from "@/components/sections/property/PropertyBlocks";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { Tag } from "@/components/ui/Tag";
import {
  ARTICLE_COPY as C,
  NEWS_ROOT,
  relatedArticles,
  type ArticleBlock,
  type ArticleRecord,
  type ArticleSite,
} from "@/data/site/news-detail";
import { ArticleShare } from "./ArticleShare";
import { RelatedArticles } from "./RelatedArticles";

/** Page content column: 67px sides at 1440 as drawn (40 at 768, 24 at 390), widening with --page-max */
const GUTTER = "mx-auto w-full max-w-(--page-max) px-6 md:px-10 lg:px-[67px]";
/** The 1085px reading column (180px in from the 1440 frame edges) */
const COLUMN = "mx-auto w-full max-w-[1085px]";

/**
 * "DetailIntro" (1508:34626): breadcrumb (13 muted), date (Medium 13 muted), Bold 52/1.15 title (872 wide) with
 * Download PDF (outline) and Share (ink) at its bottom right, then filled tags. 390 (1519:36785): Bold 34/1.18
 * title, tags, then Download PDF (full width) beside an icon-only Share. The PDF is not part of the prototype.
 */
function ArticleIntro({ site, article }: { site: ArticleSite; article: ArticleRecord }) {
  return (
    <div className={`${GUTTER} flex flex-col gap-3 pt-9 lg:gap-5 lg:pb-7 lg:pt-12`}>
      <Breadcrumb items={[{ label: C.crumb.label, href: NEWS_ROOT[site] }, { label: article.title, href: null }]} />
      <p className="pt-3 text-[13px] font-medium leading-[1.5] text-muted">{article.date}</p>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,872px)_auto] lg:justify-between lg:gap-x-10 lg:gap-y-5">
        <h1 className="text-[34px] font-bold leading-[1.18] text-ink md:text-[42px] lg:col-start-1 lg:row-start-1 lg:text-[52px] lg:leading-[1.15]">
          {article.title}
        </h1>
        <ul aria-label="Tags" className="flex flex-wrap gap-2 lg:col-start-1 lg:row-start-2">
          {article.tags.map((t) => (
            <li key={t}>
              <Tag variant="filled">{t}</Tag>
            </li>
          ))}
        </ul>
        <div className="flex gap-3 py-4 md:justify-start lg:col-start-2 lg:row-start-1 lg:self-end lg:py-0 lg:pt-2">
          <Button
            variant="outlineDark"
            href={null}
            icon="download"
            iconLeading
            className="flex-1 pl-[22px] pr-[18px] md:flex-none lg:pl-[26px] lg:pr-5"
          >
            {C.downloadPdf}
          </Button>
          <ArticleShare title={article.title} copy={C.share} />
        </div>
      </div>
    </div>
  );
}

/**
 * Summary points ("AvailableSpace" 1508:34649): 17/1.5 muted bullets in the 1085 column, 16px rows with line rules
 * under each. 390 (1519:36808): 15px, a 6px dot 12px before the text.
 */
function ArticleSummary({ points }: { points: string[] }) {
  return (
    <div className={`${GUTTER} pb-4 pt-2 lg:pb-10 lg:pt-5`}>
      <ul aria-label="Summary" className={COLUMN}>
        {points.map((p, i) => (
          <li key={i} className="flex gap-3 border-b border-line py-4 text-[15px] leading-[1.5] text-muted lg:gap-[19px] lg:pl-[7px] lg:text-[17px]">
            <span aria-hidden="true" className="mt-[8px] size-1.5 shrink-0 rounded-full bg-current lg:mt-[10px]" />
            <span className="min-w-0 flex-1">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Body blocks. Text: 17/1.5 muted (15 at 390), a blank line between paragraphs. Quote: SemiBold 32/1.3 muted,
 * centred, 40px above and below, the attribution SemiBold 20 40px under it (24 / 14 at 390). Hero ("Overview"
 * 1508:34670): 1306 x 691 placeholder, radius 12; full bleed and 300 tall at 390 (1519:37499). Gallery
 * ("MediaGallery" 1508:36039): 870 x 460 video with a white play button beside two 428 x 226 images; at 390
 * (1519:38013) the video is full bleed and 300 tall over the two images. The video is not part of the prototype.
 */
function Block({ block }: { block: ArticleBlock }) {
  if (block.kind === "hero")
    return (
      <div className="mx-auto w-full max-w-(--page-max) py-6 md:px-10 md:pb-14 md:pt-0 lg:px-[67px] lg:pb-[72px]">
        <ImagePlaceholder label={C.heroLabel} className="h-[300px] w-full md:aspect-[1306/691] md:h-auto md:rounded-card" iconSize={40} />
      </div>
    );
  if (block.kind === "gallery")
    return (
      <div className="mx-auto w-full max-w-(--page-max) pb-6 md:px-10 lg:px-[67px]">
        <div className="grid gap-2 md:aspect-[1306/460] md:grid-cols-[minmax(0,870fr)_minmax(0,428fr)] md:grid-rows-2">
          <div className="relative h-[300px] md:row-span-2 md:h-auto">
            <ImagePlaceholder className="size-full md:rounded-card" icon={false} />
            <SmartLink
              href={null}
              aria-label={C.videoLabel}
              className="absolute left-1/2 top-1/2 flex size-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-sm md:size-[72px]"
            >
              <Icon name="play_arrow" size={32} />
            </SmartLink>
          </div>
          <ImagePlaceholder className="mx-2 h-[226px] rounded-card md:mx-0 md:h-auto" iconSize={28} />
          <ImagePlaceholder className="mx-2 h-[226px] rounded-card md:mx-0 md:h-auto" iconSize={28} />
        </div>
      </div>
    );
  return (
    <div className={`${GUTTER} ${block.padTop ? "pt-10" : "pt-5 lg:pt-0"} ${block.tight ? "pb-10" : "pb-10 md:pb-14 lg:pb-[72px]"}`}>
      <div className={`${COLUMN} flex flex-col gap-5 lg:gap-7`}>
        {block.items.map((item, i) =>
          item.kind === "text" ? (
            <div key={i} className="flex flex-col gap-[1.5em] text-[15px] leading-[1.5] text-muted lg:text-[17px]">
              {item.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          ) : (
            <figure key={i} className="flex flex-col gap-10 py-10 text-center font-semibold leading-[1.3] text-muted">
              <blockquote className="text-[24px] md:text-[28px] lg:text-[32px]">
                <p>{item.quote}</p>
              </blockquote>
              {item.cite && <figcaption className="text-[14px] md:text-[16px] lg:text-[20px]">{item.cite}</figcaption>}
            </figure>
          ),
        )}
      </div>
    </div>
  );
}

/**
 * The article page body below the header, shared by /news/[slug] (group) and /jp/news/[slug] (local): intro,
 * summary, body blocks, "Related articles", then "Looking in another market?" (group only, hidden on the local
 * frames; every market goes to the Japan local site, as in Find your market) and Media enquiries (the local frames
 * drop "Country of interest").
 */
export function ArticleDetail({ site, article }: { site: ArticleSite; article: ArticleRecord }) {
  return (
    <>
      <article>
        <ArticleIntro site={site} article={article} />
        <ArticleSummary points={article.body.summary} />
        {article.body.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </article>
      <RelatedArticles title={C.relatedTitle} cards={relatedArticles(site, article.slug)} gutter={GUTTER} />
      {site === "group" && <MarketChips title={C.marketsTitle} markets={C.markets.map((label) => ({ label, href: "/jp" }))} />}
      <FormBlock variant="mediaEnquiry" id="media-enquiries" fields={site === "jp" ? ["name", "email", "message", "consent"] : undefined} />
    </>
  );
}
