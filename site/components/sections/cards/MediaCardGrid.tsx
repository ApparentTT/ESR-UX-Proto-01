import { Section, type SectionBg } from "@/components/ui/Section";
import { T, PAD } from "@/components/ui/type";
import { MediaCard, type MediaCardData, type MediaCardVariant } from "./MediaCard";
import { ScrollRow } from "./ScrollRow";

/**
 * explore2   HOME §9b "Explore more about us": 2 x 638, gap 30, 638:380 media, Bold 20/1.5 #374151 title + arrow, Medium 16 desc. 64 / 64.
 * products3  PROP §9, SUS §3b pillars (static), SGOV §3 (static, inline heading): 3 x 415, gap 30, 5:3 media, Bold 20/32 title, Medium 16 body. 72 / 72.
 * featured3  ABOUT §7 (on a surface band): 3 x 415, 8:9 media, Bold 20/32 title + 24px arrow in a 40 x 42 box. 72 / 72.
 * story3     DC §7b: 8:9 media, 13px muted eyebrow, Bold 20/32 title, "Read the story →". pt 32, pb 72. Scroll-snap row below 1024.
 * learnMore3 LEAD §4 (no heading): 5:4 media, Bold 20/32 title, "Learn more →". 72 / 72.
 * case3      CAP §2–3: 8:9 media, title + meta left, 40px arrow right. 3 columns, row gap 64. Use `bare` inside a listing.
 */
export type MediaCardGridVariant = "explore2" | "products3" | "featured3" | "story3" | "learnMore3" | "case3";

const KIND: Record<MediaCardGridVariant, MediaCardVariant> = {
  explore2: "explore",
  products3: "product",
  featured3: "featured",
  story3: "story",
  learnMore3: "learnMore",
  case3: "case",
};

const GRID: Record<MediaCardGridVariant, string> = {
  explore2: "grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-6 lg:gap-[30px]",
  products3: "grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 lg:grid-cols-3 lg:gap-[30px]",
  featured3: "grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-4 lg:gap-[30px]",
  story3:
    "thin-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 pt-1 md:-mx-10 md:scroll-px-10 md:gap-6 md:px-10 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-[30px] lg:overflow-visible lg:px-0 lg:pb-0 lg:pt-0",
  learnMore3: "grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-[30px]",
  case3: "grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-3 lg:gap-x-[30px] lg:gap-y-16",
};

const ITEM: Partial<Record<MediaCardGridVariant, string>> = {
  story3: "w-[80%] max-w-[340px] shrink-0 snap-start md:w-[46%] md:max-w-none lg:w-auto",
};

const PADDING: Record<MediaCardGridVariant, string> = {
  explore2: PAD.mid,
  products3: PAD.block,
  featured3: PAD.block,
  story3: "pb-12 pt-6 md:pb-16 md:pt-8 lg:pb-[72px]",
  learnMore3: PAD.block,
  case3: PAD.block,
};

/** Just the card list, for embedding in another section (e.g. the CAP case-study listing). */
export function MediaCardList({
  variant,
  cards,
  cardHeadingLevel = "h3",
  onSurface = false,
  className = "",
}: {
  variant: MediaCardGridVariant;
  cards: MediaCardData[];
  cardHeadingLevel?: "h2" | "h3" | "h4";
  onSurface?: boolean;
  className?: string;
}) {
  return (
    <ScrollRow className={`${GRID[variant]} ${className}`}>
      {cards.map((c, i) => (
        <li key={i} className={ITEM[variant] ?? ""}>
          <MediaCard variant={KIND[variant]} {...c} headingLevel={cardHeadingLevel} onSurface={onSurface} />
        </li>
      ))}
    </ScrollRow>
  );
}

/**
 * B13 MediaCardGrid: a full-bleed section holding a row/grid of MediaCards. Usually follows a SectionHeading;
 * `heading` adds an inline SemiBold 24 heading with a 64px gap instead (SGOV §3 "How we govern sustainability").
 */
export function MediaCardGrid({
  variant,
  cards,
  bg = "white",
  heading,
  headingLevel: H = "h2",
  cardHeadingLevel = "h3",
  className,
  bare = false,
}: {
  variant: MediaCardGridVariant;
  cards: MediaCardData[];
  /** featured3 (ABOUT §7) sits on a grey band: "surface". learnMore3's #FAFBFF renders white. */
  bg?: SectionBg;
  /** Inline heading above the cards (eyebrow24) */
  heading?: string;
  headingLevel?: "h2" | "h3";
  /** Level of each card title; h3 under a section h2 */
  cardHeadingLevel?: "h2" | "h3" | "h4";
  /** Section padding override (defaults per variant, see above) */
  className?: string;
  /** Render only the card list (no section, container or padding) */
  bare?: boolean;
}) {
  const onSurface = bg !== "white";
  const list = <MediaCardList variant={variant} cards={cards} cardHeadingLevel={cardHeadingLevel} onSurface={onSurface} />;
  if (bare) return list;
  return (
    <Section bg={bg} className={className ?? PADDING[variant]}>
      {heading && <H className={`mb-8 md:mb-12 lg:mb-16 ${T.eyebrow24}`}>{heading}</H>}
      {list}
    </Section>
  );
}
