import { Section, type SectionBg } from "@/components/ui/Section";
import { PropertyCard, type PropertyCardData } from "./PropertyCard";

/**
 * B38 FeaturedProperties (CAP §5). Follows a SectionHeading "Featured properties". Padding 30 / 72.
 * ≥1280: one large card (638 x 778) beside a 2 x 2 grid of 304 x 374 cards, 30px gaps.
 * 768–1279: the large card full width (~480 tall), then the small cards 2 x 2.
 * 390: the large card (~420 tall), then the small cards in 1 column.
 */
export function FeaturedProperties({
  featured,
  cards,
  bg = "white",
  className = "pb-12 pt-2 md:pb-16 md:pt-4 lg:pb-[72px] lg:pt-[30px]",
  headingLevel = "h3",
}: {
  /** The large card */
  featured: PropertyCardData;
  /** The small cards, in reading order (top-left, top-right, bottom-left, bottom-right) */
  cards: PropertyCardData[];
  bg?: SectionBg;
  /** Section padding override */
  className?: string;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  return (
    <Section bg={bg} className={className}>
      <ul role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 xl:gap-[30px]">
        <li className="md:col-span-2 xl:row-span-2">
          <PropertyCard {...featured} headingLevel={headingLevel} className="min-h-[420px] md:min-h-[480px] xl:min-h-0" />
        </li>
        {cards.map((c, i) => (
          <li key={i}>
            <PropertyCard {...c} headingLevel={headingLevel} className="min-h-[240px] md:min-h-[300px] xl:aspect-[304/374] xl:min-h-0" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
