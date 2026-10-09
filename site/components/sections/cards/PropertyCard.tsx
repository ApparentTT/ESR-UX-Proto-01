import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";

export type PropertyCardData = {
  /** Outline tags at the top, e.g. "Under development" */
  tags?: string[];
  title: string;
  /** Meta items, joined with "·": type · size · availability (SemiBold) */
  type: string;
  size: string;
  availability: string;
  /** Property pages are not wireframed, so cards default to inert (null) */
  href?: string | null;
  /** Link label at the bottom; defaults to "Explore" */
  cta?: string;
};

/**
 * B38 PropertyCard: a surface-grey tile with a 1px muted border (radius 8, padding 24), tags at the top and
 * the details bottom-aligned: Bold 20/32 title, a wrapping Medium 16 meta row (availability SemiBold) and a
 * Bold 13 underlined "Explore →". The whole card is the link. Hover: ink border, title underline, arrow nudge.
 */
export function PropertyCard({
  tags = [],
  title,
  type,
  size,
  availability,
  href = null,
  cta = "Explore",
  headingLevel: H = "h3",
  className = "",
}: PropertyCardData & { headingLevel?: "h2" | "h3" | "h4"; className?: string }) {
  return (
    <SmartLink
      href={href}
      className={`group flex h-full flex-col justify-between gap-6 rounded-control border border-muted bg-surface p-5 transition-colors hover:border-ink lg:p-6 ${className}`}
    >
      {tags.length > 0 ? (
        <span className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Tag key={t} size="sm">
              {t}
            </Tag>
          ))}
        </span>
      ) : (
        <span aria-hidden="true" />
      )}
      <span className="flex flex-col gap-6">
        <span className="flex flex-col gap-1.5">
          <H className="text-[18px] font-bold leading-7 text-ink underline-offset-4 group-hover:underline lg:text-[20px] lg:leading-8">{title}</H>
          <span className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[15px] font-medium leading-[1.2] tracking-[-0.02em] text-ink lg:text-[16px]">
            <span>{type}</span>
            <span aria-hidden="true">·</span>
            <span>{size}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold">{availability}</span>
          </span>
        </span>
        <span className="inline-flex items-center gap-3 self-start text-[13px] font-bold leading-5 text-[#393939] underline underline-offset-2">
          {cta}
          <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </SmartLink>
  );
}
