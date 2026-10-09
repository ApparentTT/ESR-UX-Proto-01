import { Section } from "@/components/ui/Section";
import { PAD } from "@/components/ui/type";
import { InfoCardGrid, type InfoCardItem, type InfoCardVariant } from "./InfoCardGrid";
import { mutedOn } from "./GroupLabel";

/**
 * A band holding a Bold 40 head and an InfoCardGrid (inventory B27 in context).
 * Built for LEAD §3 "Our REITs": surface band, padding 80/80, gap 28 between head and cards;
 * head Bold 40/1.18 + Regular 18/1.5 muted sub, gap 10; InfoCardGrid "reitInfo" (white cards).
 */
export type InfoCardSectionProps = {
  title: string;
  sub?: string;
  variant: InfoCardVariant;
  items: InfoCardItem[];
  bg?: "white" | "surface";
  id?: string;
  className?: string;
};

export function InfoCardSection({ title, sub, variant, items, bg = "surface", id = "info-cards", className = "" }: InfoCardSectionProps) {
  const headingId = `${id}-heading`;
  return (
    <Section
      bg={bg}
      id={id}
      aria-labelledby={headingId}
      className={`${PAD.data} ${className}`}
      containerClassName="flex flex-col gap-6 lg:gap-7"
    >
      <div className="flex flex-col gap-2.5">
        <h2 id={headingId} className="text-[28px] font-bold leading-[1.18] text-ink md:text-[34px] lg:text-[40px]">
          {title}
        </h2>
        {sub && <p className={`text-[16px] leading-[1.5] lg:text-[18px] ${mutedOn(bg)}`}>{sub}</p>}
      </div>
      <InfoCardGrid variant={variant} items={items} />
    </Section>
  );
}
