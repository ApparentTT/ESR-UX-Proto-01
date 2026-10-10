import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { T, PAD } from "@/components/ui/type";

export type ContactPersonBandProps = {
  title: string;
  sub: string;
  /** Plain text only: no links are designed */
  contact: { name: string; role: string; details: string };
  headingLevel?: "h2" | "h3";
};

/**
 * B24 ContactPersonBand (DC §10 "Talk to our data centre team"). Surface band, 64/64.
 * Bold 32 title + 17/1.45 muted sub on the left; a white contact card on the right
 * (radius 12, avatar circle, name / role / details). Columns scale 585 : 641 with an 80px gap
 * at 1280+ (40px at 1024). Below 1024 it stacks: text above the card, card max 641px,
 * avatar 80px with a 20px gap.
 */
export function ContactPersonBand({ title, sub, contact, headingLevel: H = "h2" }: ContactPersonBandProps) {
  return (
    <Section
      bg="surface"
      className={PAD.mid}
      containerClassName="grid gap-6 md:gap-8 lg:grid-cols-[585fr_641fr] lg:items-start lg:gap-10 xl:gap-20"
    >
      <div className="flex flex-col gap-2.5">
        <H className={T.h32b}>{title}</H>
        <p className="text-[16px] leading-[1.45] text-muted-surface lg:text-[17px]">{sub}</p>
      </div>
      <div className="flex w-full items-center gap-5 rounded-card bg-white p-5 md:max-w-[641px] md:px-7 md:py-6 lg:items-start lg:gap-8 xl:gap-[53px]">
        <ImagePlaceholder className="size-20 shrink-0 rounded-full lg:size-[117px]" iconSize={28} />
        <div className="flex min-w-0 flex-col gap-1 leading-[1.45] lg:pt-3">
          <p className="text-[18px] font-medium text-ink lg:text-[20px]">{contact.name}</p>
          <p className="text-[15px] text-muted">{contact.role}</p>
          {/* pre-wrap keeps the drawn double spaces either side of the "·" */}
          <p className="whitespace-pre-wrap text-[15px] text-muted">{contact.details}</p>
        </div>
      </div>
    </Section>
  );
}
