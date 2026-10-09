import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { MARKET_CARDS } from "./presets";
import { ScrollRow } from "./ScrollRow";

export type MarketCardData = {
  /** Market name, used as the accessible name and key */
  name: string;
  /** Optional explicit line breaks as drawn, e.g. ["Australia and", "New Zealand"] */
  lines?: string[];
  /** Local market sites are external and not wireframed, so cards default to inert (null) */
  href?: string | null;
};

/**
 * One market card: a tall surface-grey tile (248.4:357) with a 1px muted border, content bottom-aligned:
 * SemiBold 20/32 name + a small arrow_outward. Two-line names use line-height 1.3 with the arrow on line 2.
 */
export function MarketCard({ name, lines, href = null }: MarketCardData) {
  const twoLine = !!lines && lines.length > 1;
  return (
    <SmartLink
      href={href}
      className={`group flex aspect-[248.4/357] h-full flex-col justify-end rounded-control border border-muted bg-surface p-4 transition-colors hover:border-ink hover:bg-[#EDEEF1] ${twoLine ? "pb-5" : ""}`}
    >
      <span className="flex items-end justify-between gap-3 text-[18px] font-semibold text-ink lg:text-[20px]">
        <span className={`underline-offset-4 group-hover:underline ${twoLine ? "leading-[1.3]" : "leading-[1.6]"}`}>
          {twoLine
            ? lines.map((l, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {l}
                  {i < lines.length - 1 ? " " : ""}
                </Fragment>
              ))
            : name}
        </span>
        <span className={`flex shrink-0 items-center ${twoLine ? "h-[1.3em]" : "h-[1.6em]"}`}>
          <Icon name="arrow_outward" size={16} className="text-black transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
    </SmartLink>
  );
}

/**
 * B7 MarketCards ("Explore our markets", HOME §5, PORT §7–8, DEV §9; identical on all three).
 * Renders its own SectionHeading (72 / 30) and the card block (30 / 64).
 * 390: a scroll-snap row (~70% cards) scrolling inside its own container; 768: ~3 visible; ≥1280: static 5-up.
 */
export function MarketCards({
  title = "Explore our markets",
  markets = MARKET_CARDS,
  headingLevel = "h2",
}: {
  title?: string;
  markets?: MarketCardData[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <>
      <SectionHeading title={title} as={headingLevel} />
      <Section className="pb-12 pt-2 md:pb-14 md:pt-4 lg:pb-16 lg:pt-[30px]">
        <ScrollRow className="thin-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 pt-1 md:-mx-10 md:scroll-px-10 md:gap-4 md:px-10 lg:-mx-20 lg:scroll-px-20 lg:px-20 xl:mx-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:px-0 xl:pb-0 xl:pt-0"
        >
          {markets.map((m) => (
            <li key={m.name} className="w-[70%] max-w-[280px] shrink-0 snap-start md:w-[30%] lg:w-[23%] xl:w-auto xl:max-w-none">
              <MarketCard {...m} />
            </li>
          ))}
        </ScrollRow>
      </Section>
    </>
  );
}
