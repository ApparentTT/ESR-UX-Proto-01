import { Section, type SectionBg } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";
import { ScrollRow } from "./ScrollRow";

export type OverlayCaseCardData = {
  /** e.g. "Kanagawa  ·  Logistics" (double spaces kept) */
  eyebrow: string;
  title: string;
  /** Regular 15 line under the title */
  showcase?: string;
  /** CTA label; defaults to "Read the case study" */
  cta?: string;
  /** Case-study detail pages are not wireframed, so cards default to inert (null) */
  href?: string | null;
};

/**
 * One tall (2:3) image card with white text over a bottom gradient: eyebrow, Bold 26/1.18 title,
 * showcase line and "Read the case study →". The gradient sits behind the text block itself, so the
 * text keeps AA contrast whatever its length. The whole card is the link. Hover: lift, darker scrim, CTA underline.
 */
export function OverlayCaseCard({
  eyebrow,
  title,
  showcase,
  cta = "Read the case study",
  href = null,
  headingLevel: H = "h3",
}: OverlayCaseCardData & { headingLevel?: "h2" | "h3" | "h4" }) {
  return (
    <SmartLink
      href={href}
      className="group relative flex aspect-[419/620] h-full flex-col justify-end overflow-hidden rounded-card bg-placeholder transition-transform duration-300 hover:-translate-y-1"
    >
      {/* The placeholder fills the top of the card (same grey as the card) so its icon stays clear of the text. */}
      <ImagePlaceholder className="absolute inset-x-0 top-0 h-[62%] w-full" iconSize={40} />
      <span aria-hidden="true" className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      <div className="relative flex flex-col gap-2.5 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0,rgba(0,0,0,0.62)_120px,rgba(0,0,0,0.85)_100%)] px-6 pb-6 pt-32 text-white lg:px-7 lg:pb-7 lg:pt-36">
        <p className="whitespace-pre-wrap text-[13px] font-medium leading-[1.45] text-white/80">{eyebrow}</p>
        <H className="text-[22px] font-bold leading-[1.18] md:text-[24px] lg:text-[26px]">{title}</H>
        {showcase && <p className="text-[15px] leading-[1.45] text-white/85">{showcase}</p>}
        <span className="inline-flex items-center gap-2 self-start pt-1.5 text-[14px] font-medium leading-[1.45]">
          <span className="underline-offset-4 group-hover:underline">{cta}</span>
          <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </SmartLink>
  );
}

/**
 * B20 OverlayCaseCards (DEV §5b "Development case studies"). Follows a SectionHeading. Padding 30 / 72.
 * Three 419 x 620 cards, 24px gap at ≥1024. Below that, a scroll-snap row (~80% cards on mobile,
 * ~2 visible at 768) scrolling inside its own container.
 */
export function OverlayCaseCards({
  cards,
  bg = "white",
  className = "pb-12 pt-2 md:pb-16 md:pt-4 lg:pb-[72px] lg:pt-[30px]",
  headingLevel = "h3",
}: {
  cards: OverlayCaseCardData[];
  bg?: SectionBg;
  /** Section padding override */
  className?: string;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  return (
    <Section bg={bg} className={className}>
      <ScrollRow className="thin-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 pt-1 md:-mx-10 md:scroll-px-10 md:gap-6 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0"
      >
        {cards.map((c, i) => (
          <li key={i} className="w-[80%] max-w-[360px] shrink-0 snap-start md:w-[46%] md:max-w-none lg:w-auto">
            <OverlayCaseCard {...c} headingLevel={headingLevel} />
          </li>
        ))}
      </ScrollRow>
    </Section>
  );
}
