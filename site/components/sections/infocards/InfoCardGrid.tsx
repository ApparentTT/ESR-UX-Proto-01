import { useId } from "react";
import { TextLink } from "@/components/ui/TextLink";
import { GroupLabel, type GroupLabelOn } from "./GroupLabel";

/**
 * B27 InfoCardGrid: text cards without media (grid only, no section band).
 * - assetClass (INV §4b "What we invest in"): surface cards, r12, padding 24, gap 8, Medium 19/1.48 title,
 *   Regular 14/1.48 muted description, min 154 tall. 4-up (gap 20) from 1280, 2 x 2 from 768, 1 column below.
 * - pillar (PEOPLE §4 Talent development): surface cards, r12, padding 28, gap 8, Medium 20/1.48 title,
 *   Regular 15/1.48 muted description, min 138 tall. 3-up (gap 20) from 1024, 1 column below.
 * - reitInfo (LEAD §3 "Our REITs", inside a surface band): white cards, r12, padding 28, gap 10,
 *   13/1.5 eyebrow, Medium 22/1.5 title, Regular 14/1.5 description, then an external link
 *   (label + open_in_new after, pt 4). 4-up (gap 24) from 1280, 2 x 2 from 768, 1 column below.
 * Cards are static (not links). An optional group label sits above the grid with a 20px gap.
 */
export type InfoCardVariant = "assetClass" | "pillar" | "reitInfo";

export type InfoCardItem = {
  /** Small line above the title (reitInfo: "Country") */
  eyebrow?: string;
  title: string;
  description?: string;
  /** reitInfo: the external site link under the description (href null = inert) */
  link?: { label: string; href: string | null };
};

export type InfoCardGridProps = {
  variant: InfoCardVariant;
  items: InfoCardItem[];
  /** Group label above the grid, Medium 14/1.48 muted (e.g. "What we invest in") */
  label?: string;
  /** Element for the group label; use a heading when it names a sub-group under an h2 */
  labelAs?: "h3" | "h4" | "p";
  /** Background the label sits on, so its muted grey keeps 4.5:1 contrast */
  labelOn?: GroupLabelOn;
  /** Card title element (h3 under a section h2; h4 when the label is an h3) */
  titleAs?: "h3" | "h4" | "h5";
  className?: string;
};

const GRID: Record<InfoCardVariant, string> = {
  assetClass: "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4 xl:gap-5",
  pillar: "grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-5",
  reitInfo: "grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4",
};

const CARD: Record<InfoCardVariant, string> = {
  assetClass: "rounded-card bg-surface p-5 md:p-6 gap-2 xl:min-h-[154px]",
  pillar: "rounded-card bg-surface p-5 md:p-6 lg:p-7 gap-2 lg:min-h-[138px]",
  reitInfo: "rounded-card bg-white p-6 md:p-7 gap-2.5 xl:min-h-[261px]",
};

const TITLE: Record<InfoCardVariant, string> = {
  assetClass: "text-[18px] leading-[1.48] font-medium text-ink lg:text-[19px]",
  pillar: "text-[18px] leading-[1.48] font-medium text-ink lg:text-[20px]",
  reitInfo: "text-[20px] leading-[1.5] font-medium text-ink lg:text-[22px]",
};

/** Muted text on the surface fill uses muted-surface (#6B7280 is 4.47:1 there). */
const DESC: Record<InfoCardVariant, string> = {
  assetClass: "text-[14px] leading-[1.48] text-muted-surface",
  pillar: "text-[15px] leading-[1.48] text-muted-surface",
  reitInfo: "text-[14px] leading-[1.5] text-muted",
};

export function InfoCardGrid({
  variant,
  items,
  label,
  labelAs = "p",
  labelOn = "white",
  titleAs: H = "h3",
  className = "",
}: InfoCardGridProps) {
  const labelId = useId();
  const list = (
    <ul role="list" aria-labelledby={label ? labelId : undefined} className={GRID[variant]}>
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`} className={`flex flex-col ${CARD[variant]}`}>
          {item.eyebrow && <p className="text-[13px] leading-[1.5] text-muted">{item.eyebrow}</p>}
          <H className={TITLE[variant]}>{item.title}</H>
          {item.description && <p className={DESC[variant]}>{item.description}</p>}
          {item.link && (
            <div className="pt-1">
              <TextLink href={item.link.href} variant="external" size={14}>
                {item.link.label}
              </TextLink>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  if (!label) return className ? <div className={className}>{list}</div> : list;
  return (
    <div className={`flex flex-col gap-4 lg:gap-5 ${className}`}>
      <GroupLabel id={labelId} as={labelAs} on={labelOn}>
        {label}
      </GroupLabel>
      {list}
    </div>
  );
}
