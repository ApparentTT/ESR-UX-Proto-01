import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PAD } from "@/components/ui/type";

export type ContactCtaBandProps = {
  title: string;
  body: string;
  /** Pill button, e.g. "Contact us" → /contact */
  cta: { label: string; href: string | null };
  headingLevel?: "h2" | "h3";
};

/**
 * B39 ContactCtaBand (CAP §8). Light grey band (#F2F2F2 → surface), 64/64 (40 at 390).
 * Bold 24 (-0.48) heading + 18/28 muted body on the left, a grey pill button on the right,
 * vertically centred with a 64px gap. Aligned to the standard container (the drawn 112px
 * side padding is not used). Stacks at 390 with the pill left-aligned; a row from 768.
 */
export function ContactCtaBand({ title, body, cta, headingLevel: H = "h2" }: ContactCtaBandProps) {
  return (
    <Section
      bg="surface"
      className={PAD.mid}
      containerClassName="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-16"
    >
      <div className="flex min-w-0 flex-col gap-3">
        <H className="text-[20px] font-bold leading-[1.2] tracking-[-0.02em] text-ink lg:text-[24px]">{title}</H>
        <p className="text-[16px] leading-6 text-muted-surface lg:text-[18px] lg:leading-7">{body}</p>
      </div>
      <Button variant="pill" href={cta.href}>
        {cta.label}
      </Button>
    </Section>
  );
}
