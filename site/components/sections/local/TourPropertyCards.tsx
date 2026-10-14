import { useId } from "react";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/type";

/**
 * "Featured properties" (Local_PropertyTours 1258:29038): grey band 72 / 72, Bold 36 heading, three white cards
 * (radius 10, gap 20): a 200px image, 12px muted region, Medium 19 name and "View property →". The whole card
 * is the link. 390: stacked; 768: 2 + 1; 1024: 3 up.
 */
export function TourPropertyCards({
  title,
  cards,
  cta,
  href,
}: {
  title: string;
  /** A card's own href (its property detail page) wins over the shared `href` */
  cards: { region: string; title: string; href?: string | null }[];
  cta: string;
  href: string | null;
}) {
  const headingId = useId();
  return (
    <Section bg="surface" aria-labelledby={headingId} className="py-12 md:py-16 lg:py-[72px]" containerClassName="flex flex-col gap-6 lg:gap-7">
      <h2 id={headingId} className={T.h36b}>
        {title}
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {cards.map((c) => (
          <li key={c.title}>
            <SmartLink
              href={c.href !== undefined ? c.href : href}
              className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(17,24,39,0.08)] motion-reduce:transition-none"
            >
              <ImagePlaceholder className="h-[200px] w-full" iconSize={32} />
              <div className="flex flex-col gap-1.5 px-5 pb-5 pt-[18px]">
                <span className="text-[12px] leading-[1.48] text-muted">{c.region}</span>
                <h3 className="text-[18px] font-medium leading-[1.48] text-ink lg:text-[19px]">{c.title}</h3>
                <span className="inline-flex items-center gap-2 pt-1 text-[14px] font-medium leading-[1.48] text-ink">
                  <span className="underline-offset-4 group-hover:underline">{cta}</span>
                  <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </div>
            </SmartLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
