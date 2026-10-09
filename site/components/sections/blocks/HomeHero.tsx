import { Section } from "@/components/ui/Section";
import { T } from "@/components/ui/type";

/**
 * B1 HomeHero (HOME §1). Text-only grey hero with rounded bottom corners. Carries the page's h1.
 * 544px tall at desktop with the content vertically centred; auto height (min ~420/480) below.
 */
export function HomeHero({ title, sub }: { title: string; sub?: string }) {
  return (
    <Section
      bg="grey"
      className="overflow-hidden rounded-b-[20px] lg:rounded-b-[30px]"
      containerClassName="flex min-h-[420px] items-center py-16 md:min-h-[480px] lg:min-h-[544px] lg:py-[90px]"
    >
      <div className="flex w-full max-w-[773px] flex-col gap-6 md:gap-8 lg:p-10">
        <h1 className={`${T.heroH1} max-w-[693px]`}>{title}</h1>
        {sub && <p className={T.bodyLg}>{sub}</p>}
      </div>
    </Section>
  );
}
