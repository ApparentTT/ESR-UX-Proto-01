import { Section, type SectionBg } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { T } from "@/components/ui/type";
import { fill } from "./newsSearch";

export type MarketCtaStripProps = {
  /** Market name shown in the heading and button ("Japan" as drawn on /news) */
  market: string;
  /** "See what is happening in {market}" */
  headingTemplate: string;
  sub: string;
  /** Designer note line (13px). Shown when `showNote` is true */
  note?: string;
  showNote?: boolean;
  /** "Go to {market} news" */
  buttonTemplate: string;
  /** Local market sites are external and not wireframed: null = inert */
  href: string | null;
  bg?: SectionBg;
};

/**
 * B35 MarketCtaStrip (NEWS §5). White, 56 / 56 at desktop. Text column (Bold 32 heading, 17px sub, optional
 * 13px designer note) and a dark "Go to {market} news" button with an arrow, right-aligned.
 * 390: stacked with a full-width button. On /news it renders as drawn (Japan + note); on /news/search use
 * MarketCtaFromSearch, which shows it only while a market filter is applied.
 */
export function MarketCtaStrip({ market, headingTemplate, sub, note, showNote = true, buttonTemplate, href, bg = "white" }: MarketCtaStripProps) {
  return (
    <Section bg={bg} className="py-10 md:py-12 lg:py-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-2.5">
          <h2 className={T.h32b}>{fill(headingTemplate, { market })}</h2>
          <p className="text-[16px] leading-[1.45] text-muted lg:text-[17px]">{sub}</p>
          {showNote && note && <p className="text-[13px] leading-[1.45] text-muted">{note}</p>}
        </div>
        <Button variant="dark" href={href} icon="arrow_forward" iconSize={18} className="w-full md:w-auto">
          {fill(buttonTemplate, { market })}
        </Button>
      </div>
    </Section>
  );
}
