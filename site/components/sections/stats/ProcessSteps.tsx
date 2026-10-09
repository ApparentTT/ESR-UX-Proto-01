import { Section } from "@/components/ui/Section";
import { PAD, T } from "@/components/ui/type";

/**
 * Numbered process row (inventory B19, DEV §2 "End to end, in house").
 * Surface band, 64/64, column with a 40px gap. Head: Bold 36 title + 17/1.48 sub.
 * Steps: 4 columns (gap 32) at 1024+, 2 x 2 at 768, 1 column (gap 24) at 390.
 * Each step: number + hairline rule, Bold 22 title, 15/1.48 body. Static.
 */
export type ProcessStep = { number: string; title: string; body: string };

export type ProcessStepsProps = {
  title: string;
  sub?: string;
  steps: ProcessStep[];
  id?: string;
};

export function ProcessSteps({ title, sub, steps, id = "process-steps" }: ProcessStepsProps) {
  const headingId = `${id}-heading`;
  return (
    <Section bg="surface" id={id} aria-labelledby={headingId} className={PAD.mid} containerClassName="flex flex-col gap-8 lg:gap-10">
      <div className="flex flex-col gap-2.5">
        <h2 id={headingId} className={T.h36b}>
          {title}
        </h2>
        {sub && <p className="text-[16px] leading-[1.48] text-muted-surface lg:text-[17px]">{sub}</p>}
      </div>
      <ol role="list" className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.number} className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-medium leading-[1.48] text-muted-surface">{s.number}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-line" />
            </div>
            <h3 className="text-[20px] font-bold leading-[1.48] text-ink lg:text-[22px]">{s.title}</h3>
            <p className="text-[15px] leading-[1.48] text-muted-surface">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
