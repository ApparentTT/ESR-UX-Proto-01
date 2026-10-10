import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import { Tag } from "@/components/ui/Tag";
import { T } from "@/components/ui/type";

export type ArticleCardData = {
  /** Market, content type, topic (in that order) */
  tags: string[];
  headline: string;
  date: string;
  /** null = inert (article pages are not wireframed) */
  href?: string | null;
};

/**
 * B32 ListingCard `article` (NEWS §4, NSR §2). White, radius 12, no border; a flat 220px image, then
 * 24 / 28 / 28 / 28 padding with a 12px gap: filled tags, headline Medium 20 / 1.45, date Regular 14.
 * The whole card is one link (stretched over the card). Hover: headline underline + a small lift.
 */
export function ArticleCard({ tags, headline, date, href = null, headingLevel = "h3" }: ArticleCardData & { headingLevel?: "h2" | "h3" | "h4" }) {
  const H = headingLevel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(17,24,39,0.08)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ink">
      <ImagePlaceholder className="h-[200px] w-full shrink-0 md:h-[220px]" />
      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-5 md:px-7 md:pb-7 md:pt-6">
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {tags.map((t) => (
            <li key={t}>
              <Tag variant="filled">{t}</Tag>
            </li>
          ))}
        </ul>
        <H className={T.title20m}>
          <SmartLink href={href} className="underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline focus-visible:outline-none">
            {headline}
          </SmartLink>
        </H>
        <p className="text-[14px] leading-[1.45] text-muted">{date}</p>
      </div>
    </article>
  );
}
