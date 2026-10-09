import { SmartLink } from "@/components/ui/SmartLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";

export type NewsCardData = {
  /** e.g. "1 July 2026" */
  date: string;
  /** "Type · Market", verbatim (some sets use double spaces around the dot; they are preserved) */
  meta: string;
  title: string;
  /** Article pages are not wireframed, so cards default to an inert link (null) */
  href?: string | null;
};

/**
 * B12 NewsCard ("The latest" cards). Off-white card with a light border and soft shadow, a 278.5:182 media
 * block, a bold meta row (date left, "Type · Market" right), a Medium 20/1.3 title and a round arrow chip.
 * The whole card is the link. Hover: deeper shadow, darker chip, underlined title, arrow nudge.
 */
export function NewsCard({ date, meta, title, href = null, headingLevel: H = "h3" }: NewsCardData & { headingLevel?: "h2" | "h3" | "h4" }) {
  return (
    <SmartLink
      href={href}
      className="group flex h-full flex-col gap-3 overflow-hidden rounded-[4px] border border-[#E9E9E9] bg-[#FCFCFC] px-[11px] py-3 shadow-[0_2px_13.4px_rgba(0,0,0,0.10)] transition-shadow hover:shadow-[0_6px_22px_rgba(0,0,0,0.18)]"
    >
      <ImagePlaceholder className="aspect-[278.5/182] w-full rounded-[4px]" iconSize={24} />
      <div className="flex flex-col gap-5 lg:gap-6">
        <p className="flex flex-wrap items-baseline justify-between gap-x-1.5 text-[14px] font-bold leading-5 text-[#393939]">
          <span className="whitespace-nowrap">{date}</span>
          <span className="whitespace-pre">{meta}</span>
        </p>
        <H className="text-[18px] font-medium leading-[1.3] text-[#393939] underline-offset-4 group-hover:underline lg:text-[20px]">{title}</H>
      </div>
      <span className="inline-flex h-8 w-[31px] shrink-0 items-center justify-center rounded-full bg-[#E0E0E0] text-black transition-colors group-hover:bg-[#D1D5DB]">
        <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </SmartLink>
  );
}
