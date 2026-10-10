import { Section, type SectionBg } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";

export type FeaturedArticleProps = {
  /** Overlay label on the image ("Featured") */
  label: string;
  /** Market, content type, topic */
  tags: string[];
  headline: string;
  standfirst: string;
  date: string;
  ctaLabel: string;
  /** null = inert (articles are not wireframed) */
  href: string | null;
  bg?: SectionBg;
  headingLevel?: "h2" | "h3";
};

/**
 * B34 FeaturedArticle (NEWS §3). Surface band, 32 top / 56 bottom at desktop. Image (5:3, radius 12, "Featured"
 * overlaid top left) and a text column (tags, Bold 36 headline, standfirst, date, "Read the article" arrow link).
 * 390: stacked, image on top. 768: two equal columns. ≥1024: 700 : 558 as drawn, 48px gap, vertically centred.
 * Shown on /news only (hidden while a search is active).
 */
export function FeaturedArticle({ label, tags, headline, standfirst, date, ctaLabel, href, bg = "surface", headingLevel = "h2" }: FeaturedArticleProps) {
  const H = headingLevel;
  return (
    <Section bg={bg} className="pb-10 pt-6 md:pb-12 md:pt-8 lg:pb-14" aria-label={label}>
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-[700fr_558fr] lg:gap-12">
        <div className="relative">
          <ImagePlaceholder className="aspect-[5/3] w-full rounded-card" iconSize={40} />
          <span className="absolute left-[19px] top-4 text-[14px] font-medium leading-[1.45] text-body">{label}</span>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4">
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {tags.map((t) => (
              <li key={t}>
                <Tag variant="filled">{t}</Tag>
              </li>
            ))}
          </ul>
          {/* Bold 36 / 1.2 as drawn from 1280; 26 / 28 / 30 below so the 1024 column stays at two or three lines. */}
          <H className="text-[26px] font-bold leading-[1.2] text-ink md:text-[28px] lg:text-[30px] xl:text-[36px]">{headline}</H>
          <p className="text-[16px] leading-[1.45] text-muted-surface lg:text-[18px]">{standfirst}</p>
          <p className="text-[15px] leading-[1.45] text-muted-surface">{date}</p>
          <div className="pt-2">
            <TextLink variant="arrow" size={16} href={href}>
              {ctaLabel}
            </TextLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
