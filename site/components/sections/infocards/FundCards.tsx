import { Section } from "@/components/ui/Section";
import { SmartLink } from "@/components/ui/SmartLink";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PAD, T } from "@/components/ui/type";
import { mutedOn } from "./GroupLabel";

/**
 * B29 FundCards (INV §5 "Flagship funds across the group").
 * Band padding 80/80, column gap 32. Head: Bold 40/1.2 + 18/1.45 muted sub (max 760), gap 10.
 * Three cards (419.33 wide at 1440, gap 24): white, 1px line border, r12, overflow hidden.
 * Image 200 tall (180 on mobile), then a body (padding 28, gap 12): fund name Medium 24/1.45,
 * "Strategy  ·  Region" 15/1.45 muted, a stats row (py 8, gap 32; Bold 22 value over a 13px label),
 * and the "View fund" arrow link. The whole card is the click target (stretched link).
 * Hover: border #D1D5DB, a soft shadow, the arrow nudges 2px.
 * Responsive: 1 column at 390, 2 + 1 from 768, 3-up from 1024.
 */
export type FundStat = { value: string; label: string };

export type FundCard = {
  name: string;
  /** "Strategy  ·  Region", verbatim (double spaces around the dot are kept) */
  meta: string;
  stats: FundStat[];
  cta: { label: string; href: string | null };
};

export type FundCardsProps = {
  title: string;
  sub?: string;
  funds: FundCard[];
  bg?: "white" | "surface";
  id?: string;
  className?: string;
};

export function FundCards({ title, sub, funds, bg = "white", id = "flagship-funds", className = "" }: FundCardsProps) {
  const headingId = `${id}-heading`;
  return (
    <Section
      bg={bg}
      id={id}
      aria-labelledby={headingId}
      className={`${PAD.data} ${className}`}
      containerClassName="flex flex-col gap-6 md:gap-8"
    >
      <div className="flex max-w-[760px] flex-col gap-2.5">
        <h2 id={headingId} className={T.h40b}>
          {title}
        </h2>
        {sub && <p className={`text-[16px] leading-[1.45] lg:text-[18px] ${mutedOn(bg)}`}>{sub}</p>}
      </div>
      <ul role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {funds.map((fund, i) => (
          <li
            key={`${fund.name}-${i}`}
            className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-[#D1D5DB] hover:shadow-[0_4px_16px_rgba(17,24,39,0.06)] has-[a:focus-visible]:border-[#D1D5DB]"
          >
            <ImagePlaceholder className="h-[180px] w-full lg:h-[200px]" iconSize={40} />
            <div className="flex flex-1 flex-col gap-3 p-6 lg:p-7">
              <h3 className="text-[22px] font-medium leading-[1.45] text-ink lg:text-[24px]">{fund.name}</h3>
              <p className="whitespace-pre-wrap text-[15px] leading-[1.45] text-muted">{fund.meta}</p>
              <dl className="flex flex-wrap gap-x-8 gap-y-3 py-2">
                {fund.stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse gap-0.5">
                    <dt className="text-[13px] leading-[1.45] text-muted">{s.label}</dt>
                    <dd className="text-[22px] font-bold leading-[1.45] text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <SmartLink
                href={fund.cta.href}
                className="mt-auto inline-flex items-center gap-2 self-start text-[15px] font-medium leading-[1.45] text-ink underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover:underline"
              >
                {fund.cta.label}
                <span className="sr-only">: {fund.name}</span>
                <Icon name="arrow_forward" size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </SmartLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
