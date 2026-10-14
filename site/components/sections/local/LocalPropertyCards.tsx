import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Tag } from "@/components/ui/Tag";
import { ScrollRow } from "@/components/sections/cards/ScrollRow";

export type LocalPropertyCardData = {
  /** Outline tags over the title ("Japan", "CASBEE S") */
  tags?: string[];
  title: string;
  /** Meta row, joined with "·": type · size · availability (SemiBold) */
  type: string;
  size: string;
  availability: string;
  /** Property pages are not wireframed: inert (null) */
  href: string | null;
};

/**
 * "Featured cards" (Figma 1110:53381 on the Japan homepage, 1110:63864 on the Japan portfolio): three property
 * cards, each a 404px image (radius 8, muted border) over its tags, Bold 20/32 title, the Medium 16 meta row and
 * "Explore →". The whole card is the link. Padding 34 / 72 at 1440. 390: a scroll-snap row (cards ~85% wide);
 * 768+: three columns.
 */
export function LocalPropertyCards({ cards, headingLevel: H = "h3" }: { cards: LocalPropertyCardData[]; headingLevel?: "h3" | "h4" }) {
  return (
    <Section className="pb-12 pt-4 md:pb-16 md:pt-6 lg:pb-[72px] lg:pt-[34px]">
      <ScrollRow className="thin-scrollbar -mx-6 -my-4 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 py-4 md:mx-0 md:my-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:p-0 lg:gap-[30px]">
        {cards.map((c, i) => (
          <li key={i} className="w-[85%] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none">
            <LocalPropertyCard {...c} headingLevel={H} />
          </li>
        ))}
      </ScrollRow>
    </Section>
  );
}

/** One Japan property card (also used by the "Our customers" Featured Properties carousel). The whole card is the link. */
export function LocalPropertyCard({
  tags,
  title,
  type,
  size,
  availability,
  href,
  headingLevel: H = "h3",
}: LocalPropertyCardData & { headingLevel?: "h3" | "h4" }) {
  return (
    <SmartLink href={href} className="group flex h-full flex-col gap-4">
      <ImagePlaceholder className="aspect-[415/404] w-full rounded-control border border-muted" />
      <span className="flex flex-1 flex-col justify-between gap-6">
        <span className="flex flex-col gap-2">
          {tags && tags.length > 0 && (
            <span className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </span>
          )}
          <H className="text-[18px] font-bold leading-7 text-ink underline-offset-4 group-hover:underline lg:text-[20px] lg:leading-8">{title}</H>
          <span className="flex flex-wrap items-center gap-2 text-[15px] font-medium leading-[1.2] tracking-[-0.02em] text-ink lg:text-[16px]">
            <span>{type}</span>
            <span aria-hidden="true">·</span>
            <span>{size}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold">{availability}</span>
          </span>
        </span>
        <span className="inline-flex items-center gap-3 self-start text-[13px] font-bold leading-5 text-[#393939] underline underline-offset-2">
          Explore
          <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </span>
    </SmartLink>
  );
}
