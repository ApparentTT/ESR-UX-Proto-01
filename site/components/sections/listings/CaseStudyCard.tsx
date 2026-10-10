import { SmartLink } from "@/components/ui/SmartLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";

/** One SCS listing card. `eyebrow` is verbatim ("Category  ·  Country", two spaces either side of the dot). */
export type CaseStudyCardData = {
  eyebrow: string;
  title: string;
  excerpt: string;
  /** CTA label, "Find out more" */
  cta: string;
  /** Detail pages are not wireframed: null = inert link */
  href: string | null;
};

/**
 * B32 ListingCard `caseStudy` (SCS §2b). White, r12, overflow hidden, no border or shadow.
 * Flat image 240 tall (200 mobile, 220 tablet), then a body (padding 28, gap 10): eyebrow 13/1.45 muted,
 * title Medium 20/1.45, excerpt 15/1.45 muted, "Find out more →" (14 + 18px arrow, pt 4).
 * Content is top-aligned (the CTA is not pinned to the bottom). The whole card is the link.
 * Hover: title underline, arrow nudges 4px, shadow 0 4px 16px rgba(17,24,39,0.08).
 */
export function CaseStudyCard({
  eyebrow,
  title,
  excerpt,
  cta,
  href,
  headingLevel: H = "h3",
}: CaseStudyCardData & { headingLevel?: "h2" | "h3" | "h4" }) {
  return (
    <SmartLink
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-card bg-white transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(17,24,39,0.08)] focus-visible:shadow-[0_4px_16px_rgba(17,24,39,0.08)]"
    >
      <ImagePlaceholder className="h-[200px] w-full shrink-0 md:h-[220px] lg:h-[240px]" iconSize={40} />
      <div className="flex flex-col gap-2.5 p-6 lg:p-7">
        <p className="whitespace-pre-wrap text-[13px] leading-[1.45] text-muted">{eyebrow}</p>
        <H className="text-[18px] font-medium leading-[1.45] text-ink underline-offset-4 group-hover:underline lg:text-[20px]">{title}</H>
        <p className="text-[15px] leading-[1.45] text-muted">{excerpt}</p>
        <span className="inline-flex items-center gap-2 pt-1 text-[14px] font-medium leading-[1.45] text-ink">
          {cta}
          <Icon name="arrow_forward" size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </SmartLink>
  );
}
