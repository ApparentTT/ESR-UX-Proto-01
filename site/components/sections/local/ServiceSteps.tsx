import { Section } from "@/components/ui/Section";
import { PAD, T } from "@/components/ui/type";

export type ServiceStep = { number: string; title: string; body: string };

/**
 * Numbered services row (Figma "DevelopmentServices" 1292:60716 on R2Local_Properties, "Let us take care of
 * the property management"): the group ProcessSteps layout on white with three steps. Bold 36 heading, 40px to
 * the steps; each step is the number and a hairline rule, a Bold 22 title and a 15/1.48 muted body, 32 apart.
 * 64 / 64. Three columns from 1024, one column (24 apart) below.
 */
export function ServiceSteps({ title, steps }: { title: string; steps: ServiceStep[] }) {
  return (
    <Section className={PAD.mid} containerClassName="flex flex-col gap-8 lg:gap-10">
      <h2 className={T.h36b}>{title}</h2>
      <ol role="list" className="grid gap-6 md:gap-8 lg:grid-cols-3">
        {steps.map((s) => (
          <li key={s.number} className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium leading-[1.48] text-muted">{s.number}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </div>
            <h3 className="text-[20px] font-bold leading-[1.48] text-ink lg:text-[22px]">{s.title}</h3>
            <p className="text-[15px] leading-[1.48] text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
