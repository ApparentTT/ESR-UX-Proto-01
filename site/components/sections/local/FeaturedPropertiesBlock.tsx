import { Container } from "@/components/layout/Container";
import { FeaturedProperties } from "@/components/sections/cards/FeaturedProperties";
import type { PropertyCardData } from "@/components/sections/cards/PropertyCard";
import { SmartLink } from "@/components/ui/SmartLink";
import { HIT, T } from "@/components/ui/type";

/**
 * "Featured cards" on R2Local_Properties (Figma 1110:72076): the SemiBold 24 heading, the group
 * FeaturedProperties bento (one large card beside 2 x 2), then "View all properties" (SemiBold 20 underlined)
 * at the right, 40 apart. 30 / 72 at 1440.
 */
export function FeaturedPropertiesBlock({
  title,
  featured,
  cards,
  link,
}: {
  title: string;
  featured: PropertyCardData;
  cards: PropertyCardData[];
  link: { label: string; href: string | null };
}) {
  return (
    <div className="bg-white pb-12 pt-8 md:pb-16 lg:pb-[72px] lg:pt-[30px]">
      <Container>
        <h2 className={T.eyebrow24}>{title}</h2>
      </Container>
      <FeaturedProperties featured={featured} cards={cards} className="pt-6 lg:pt-10" />
      <Container className="mt-6 flex justify-end lg:mt-10">
        <SmartLink
          href={link.href}
          className={`${HIT} text-[18px] font-semibold tracking-[-0.02em] text-ink underline underline-offset-4 hover:decoration-2 lg:text-[20px]`}
        >
          {link.label}
        </SmartLink>
      </Container>
    </div>
  );
}
