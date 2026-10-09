import { Section } from "@/components/ui/Section";
import { ProgressBar } from "@/components/ui/DataBits";
import { PAD, T } from "@/components/ui/type";

/**
 * "Our targets" (inventory B31, SUS §4).
 * Surface band, 80/80, column with a 36px gap. Bold 40 head + muted sub.
 * Three equal-height white cards (r12, padding 28, gap 20): Medium 20 title, then target items:
 * label + right-aligned target, an 8px single-fill progress bar, and a 13px caption.
 * Responsive: 1 column at 390 (padding 20, auto height), 2 + 1 from 768, 3 across from 1280.
 */
export type TargetItem = {
  label: string;
  /** Right-hand target, verbatim, e.g. "XX% by 2030" */
  target: string;
  /** Bar fill in percent (wireframe placeholder widths) */
  progress: number;
  /** Caption under the bar, verbatim, e.g. "XX% complete" */
  caption: string;
};

export type TargetGroup = { title: string; items: TargetItem[] };

export type TargetProgressCardsProps = {
  title: string;
  sub?: string;
  groups: TargetGroup[];
  id?: string;
};

export function TargetProgressCards({ title, sub, groups, id = "targets" }: TargetProgressCardsProps) {
  const headingId = `${id}-heading`;
  return (
    <Section bg="surface" id={id} aria-labelledby={headingId} className={PAD.data} containerClassName="flex flex-col gap-8 lg:gap-9">
      <div className="flex flex-col gap-2.5">
        <h2 id={headingId} className={T.h40b}>
          {title}
        </h2>
        {sub && <p className="text-[16px] leading-[1.45] text-muted-surface lg:text-[18px]">{sub}</p>}
      </div>
      <ul role="list" className="grid gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {groups.map((g) => (
          <li key={g.title} className="flex flex-col gap-5 rounded-card bg-white p-5 md:p-7 xl:min-h-[340px]">
            <h3 className={T.title20m}>{g.title}</h3>
            <ul role="list" className="flex flex-col gap-5">
              {g.items.map((t) => (
                <li key={t.label} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <span className="min-w-0 flex-1 text-[15px] leading-[1.45] text-ink">{t.label}</span>
                    <span className="whitespace-nowrap text-right text-[14px] font-medium leading-[1.45] text-muted">{t.target}</span>
                  </div>
                  <ProgressBar segments={[t.progress]} label={`${t.label} progress`} />
                  <span className="text-[13px] leading-[1.45] text-muted">{t.caption}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
