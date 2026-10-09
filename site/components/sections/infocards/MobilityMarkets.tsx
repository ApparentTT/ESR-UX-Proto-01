import { Section } from "@/components/ui/Section";
import { PAD, T } from "@/components/ui/type";
import { LinkTileGrid, type LinkTileItem } from "./LinkTileGrid";
import { mutedOn } from "./GroupLabel";

/**
 * B45 MobilityMarkets (PEOPLE §6 "Mobility and growth at ESR").
 * Grey band (wireframe #DFDFDF), padding 80/80, column gap 32 (head, label, tiles).
 * Head (gap 10): Bold 40/1.2 H2 + 18/1.48 sub (max 760). Label Medium 14/1.48 "Explore careers in our markets".
 * LinkTileGrid "market": white tiles, all external market careers pages (inert).
 * Muted copy on the grey band uses #4B5563 to keep 4.5:1 contrast.
 */
export type MobilityMarketsProps = {
  title: string;
  sub?: string;
  label: string;
  markets: LinkTileItem[];
  id?: string;
  className?: string;
};

export function MobilityMarkets({ title, sub, label, markets, id = "mobility", className = "" }: MobilityMarketsProps) {
  const headingId = `${id}-heading`;
  return (
    <Section
      bg="grey"
      id={id}
      aria-labelledby={headingId}
      className={`${PAD.data} ${className}`}
      containerClassName="flex flex-col gap-6 md:gap-8"
    >
      <div className="flex max-w-[760px] flex-col gap-2.5">
        <h2 id={headingId} className={T.h40b}>
          {title}
        </h2>
        {sub && <p className={`text-[16px] leading-[1.48] lg:text-[18px] ${mutedOn("grey")}`}>{sub}</p>}
      </div>
      <LinkTileGrid variant="market" label={label} labelOn="grey" labelGap={32} items={markets} />
    </Section>
  );
}
