import { Section } from "@/components/ui/Section";
import { T } from "@/components/ui/type";

/**
 * Japan homepage hero (Figma 1110:53319): the group HomeHero's grey text-only band, drawn square here so it
 * runs straight into the property search band below. Carries the page's h1. 597px tall at 1440 (90px padding,
 * content centred); auto height (min ~420/480) below.
 */
export function LocalHomeHero({ title, sub }: { title: string; sub?: string }) {
  return (
    <Section bg="grey" containerClassName="flex min-h-[420px] items-center py-16 md:min-h-[480px] lg:min-h-[597px] lg:py-[90px]">
      <div className="flex w-full max-w-[773px] flex-col gap-6 md:gap-8 lg:p-10">
        <h1 className={`${T.heroH1} max-w-[693px]`}>{title}</h1>
        {sub && <p className={T.bodyLg}>{sub}</p>}
      </div>
    </Section>
  );
}
