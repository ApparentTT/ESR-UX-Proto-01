import { Section, type SectionBg } from "@/components/ui/Section";
import { NewsCard, type NewsCardData } from "./NewsCard";
import { ScrollRow } from "./ScrollRow";

/**
 * B12 NewsCardRow ("The latest" cards, HOME §8b, SUS §8b, INV §8b). Pair it with a SectionHeading above
 * ("The latest from across our markets" + "Explore the latest" → /news).
 * Padding 64 top / 72 bottom at desktop. 390: a scroll-snap row (cards ~85% wide) scrolling inside its own
 * container; 768: 2 x 2 grid; ≥1280: 4-up, 24px gap (cards ≈ the drawn 302.5px inside the 1280 container).
 */
export function NewsCardRow({
  cards,
  bg = "white",
  className = "pt-10 pb-12 md:pt-14 md:pb-16 lg:pt-16 lg:pb-[72px]",
  headingLevel = "h3",
  label,
}: {
  cards: NewsCardData[];
  bg?: SectionBg;
  /** Section padding override */
  className?: string;
  /** Level of each card title (h3 under the section's h2) */
  headingLevel?: "h2" | "h3" | "h4";
  /** Optional accessible name for the section */
  label?: string;
}) {
  return (
    <Section bg={bg} className={className} aria-label={label}>
      <ScrollRow className="thin-scrollbar -mx-6 -my-4 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 py-4 md:mx-0 md:my-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:p-0 xl:grid-cols-4 xl:gap-6"
      >
        {cards.map((c, i) => (
          <li key={i} className="w-[85%] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none">
            <NewsCard {...c} headingLevel={headingLevel} />
          </li>
        ))}
      </ScrollRow>
    </Section>
  );
}
