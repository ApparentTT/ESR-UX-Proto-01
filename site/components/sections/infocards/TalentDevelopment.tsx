import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PAD } from "@/components/ui/type";
import { InfoCardGrid, type InfoCardItem } from "./InfoCardGrid";

/**
 * B45 TalentDevelopment (PEOPLE §4). White band, padding 80/80, column gap 32 (head, pillars, button).
 * Head (gap 10): H2 Medium 40/1.2 with no tracking + 18/1.48 muted sub (max 760).
 * InfoCardGrid "pillar" (3-up from 1024, stacked below), then the dark "See all open roles" button with a
 * trailing open_in_new (external jobs board, inert while href is null).
 */
export type TalentDevelopmentProps = {
  title: string;
  sub?: string;
  pillars: InfoCardItem[];
  cta?: { label: string; href: string | null };
  id?: string;
  className?: string;
};

export function TalentDevelopment({ title, sub, pillars, cta, id = "talent-development", className = "" }: TalentDevelopmentProps) {
  const headingId = `${id}-heading`;
  return (
    <Section
      bg="white"
      id={id}
      aria-labelledby={headingId}
      className={`${PAD.data} ${className}`}
      containerClassName="flex flex-col gap-6 md:gap-8"
    >
      <div className="flex max-w-[760px] flex-col gap-2.5">
        <h2 id={headingId} className="text-[28px] font-medium leading-[1.2] text-ink md:text-[34px] lg:text-[40px]">
          {title}
        </h2>
        {sub && <p className="text-[16px] leading-[1.48] text-muted lg:text-[18px]">{sub}</p>}
      </div>
      <InfoCardGrid variant="pillar" items={pillars} />
      {cta && (
        <Button variant="dark" href={cta.href} icon="open_in_new" iconSize={18} className="self-start pr-6">
          {cta.label}
          <span className="sr-only">(external site)</span>
        </Button>
      )}
    </Section>
  );
}
