import { Section, type SectionBg } from "@/components/ui/Section";
import { OutlineTextCard, type OutlineTextCardItem } from "./OutlineTextCard";

/**
 * B23 OutlineTextCardRow (ABOUT §4b "Our purpose"). Follows a SectionHeading "title".
 * Static 3-up row of outline text cards (424.67 x 405 at 1440, gap 16). Each whole card is a link.
 * Block padding 30 top / 72 bottom.
 * Responsive: stacked at 390 (min-height 220, title 20); a scroll-snap row of ~300px cards
 * (next card peeking) at 768; the 3-up grid from 1024.
 */
export type OutlineTextCardRowProps = {
  items: OutlineTextCardItem[];
  bg?: SectionBg;
  /** id of the heading that names this block (e.g. the SectionHeading h2), for aria-labelledby */
  labelledBy?: string;
  titleAs?: "h3" | "h4";
  className?: string;
};

export function OutlineTextCardRow({ items, bg = "white", labelledBy, titleAs = "h3", className = "" }: OutlineTextCardRowProps) {
  return (
    <Section bg={bg} aria-labelledby={labelledBy} className={`pt-4 pb-12 md:pt-6 md:pb-16 lg:pt-[30px] lg:pb-[72px] ${className}`}>
      <ul
        role="list"
        className="flex flex-col gap-4 md:-mx-10 md:flex-row md:snap-x md:snap-mandatory md:overflow-x-auto md:scroll-px-10 md:px-10 md:pb-2 thin-scrollbar lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {items.map((item) => (
          <li key={item.title} className="flex md:w-[300px] md:shrink-0 md:snap-start lg:w-auto">
            <OutlineTextCard
              {...item}
              titleAs={titleAs}
              className="min-h-[220px] w-full md:min-h-[320px] lg:aspect-[424.67/405] lg:min-h-0"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
