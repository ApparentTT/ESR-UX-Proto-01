import { Section, type SectionBg } from "@/components/ui/Section";
import { T } from "@/components/ui/type";
import { InfoCardGrid, type InfoCardItem } from "./InfoCardGrid";
import { LinkTileGrid, type LinkTileItem } from "./LinkTileGrid";

/**
 * B44 ProductSuite (INV §4 "Investment product suite").
 * White band, padding 32/32 as drawn (40 top on mobile), column gap 44.
 * Head row (from 1024): Bold 40/1.2 H2 in a 671 column with a forced line break, then the
 * Regular 18/1.48 muted intro (max 538) starting at x 683. Stacks below 1024 (gap 12).
 * Then InfoCardGrid "assetClass" under its group label, then LinkTileGrid "reit" under its label.
 * Group labels are h3s and card titles h4s, so the outline reads H2 > group > card.
 */
export type ProductSuiteProps = {
  /** One string, or lines joined with forced breaks (wireframe: ["Investment", "product suite"]) */
  title: string | string[];
  intro?: string;
  assetClasses: { label: string; items: InfoCardItem[] };
  reits: { label: string; items: LinkTileItem[] };
  bg?: SectionBg;
  id?: string;
  className?: string;
};

export function ProductSuite({ title, intro, assetClasses, reits, bg = "white", id = "product-suite", className = "" }: ProductSuiteProps) {
  const headingId = `${id}-heading`;
  const lines = Array.isArray(title) ? title : [title];
  return (
    <Section
      bg={bg}
      id={id}
      aria-labelledby={headingId}
      className={`pt-10 pb-8 md:pt-12 lg:py-8 ${className}`}
      containerClassName="flex flex-col gap-8 lg:gap-11"
    >
      <div className="flex flex-col gap-3 lg:grid lg:min-h-[109px] lg:grid-cols-[671fr_623fr] lg:items-start lg:gap-3">
        <h2 id={headingId} className={T.h40b}>
          {lines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        {intro && <p className="max-w-[538px] text-[16px] leading-[1.48] text-muted lg:text-[18px]">{intro}</p>}
      </div>
      <InfoCardGrid variant="assetClass" label={assetClasses.label} labelAs="h3" titleAs="h4" items={assetClasses.items} />
      <LinkTileGrid variant="reit" label={reits.label} labelAs="h3" items={reits.items} />
    </Section>
  );
}
