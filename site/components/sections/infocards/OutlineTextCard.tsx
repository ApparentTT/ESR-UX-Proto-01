import { SmartLink } from "@/components/ui/SmartLink";
import { T } from "@/components/ui/type";

/**
 * Outline text card shell (inventory B22 / B23): tint fill (surface token), 1px ink border
 * (Figma 0.9px black), radius 8 (Figma 7.2), overflow hidden. Shared by ExpandingCards.
 */
export const OUTLINE_CARD_SHELL = "rounded-control border border-ink bg-surface overflow-hidden";

/** Card title: Medium 24 / 28.8 (20 below 1024). */
export const OUTLINE_CARD_TITLE = T.card24m;

/** cardTextLink look: Regular 14 / 28.8, underlined, ink at 80%. */
export const OUTLINE_CARD_LINK = "text-[14px] leading-[28.8px] text-ink/80 underline underline-offset-2";

export type OutlineTextCardItem = {
  title: string;
  /** Visible link label, verbatim (e.g. "Learn more") */
  linkLabel: string;
  /** Built route, or null for an inert link (page not wireframed) */
  href: string | null;
};

/**
 * One static outline text card where the whole card is the link (ABOUT §4b "Our purpose").
 * Title pinned top, link label pinned bottom. Hover: border darkens to black (2px look,
 * no layout shift), the underline thickens and the fill steps one grey darker.
 */
export function OutlineTextCard({
  title,
  linkLabel,
  href,
  titleAs: H = "h3",
  className = "",
}: OutlineTextCardItem & {
  titleAs?: "h2" | "h3" | "h4";
  className?: string;
}) {
  return (
    <SmartLink
      href={href}
      className={`group flex flex-col justify-between gap-8 px-6 py-6 transition-[background-color,box-shadow,border-color] duration-200 hover:border-black hover:bg-[#EEEFF2] hover:shadow-[inset_0_0_0_1px_#000] md:py-[35px] ${OUTLINE_CARD_SHELL} ${className}`}
    >
      <H className={`max-w-[375px] ${OUTLINE_CARD_TITLE}`}>{title}</H>
      <span className={`self-start ${OUTLINE_CARD_LINK} decoration-1 group-hover:text-ink group-hover:decoration-2`}>{linkLabel}</span>
    </SmartLink>
  );
}
