import { Section } from "@/components/ui/Section";
import { PAD, T } from "@/components/ui/type";
import { StatList, type StatItem } from "./StatRow";
import { StackedBarChart, type StackedBarChartProps } from "./StackedBarChart";

/**
 * "Our investment track record" (inventory B26, INV §3).
 * Surface band, 80/80, column with a 40px gap: Bold 40 head + muted sub (max 760),
 * StatRow bold5, then the white stacked-bar chart card.
 */
export type TrackRecordProps = {
  title: string;
  sub?: string;
  /** Five stats for the bold5 row; stat 5 carries `sideLabel` */
  stats: StatItem[];
  chart: Omit<StackedBarChartProps, "as" | "id">;
  id?: string;
};

export function TrackRecord({ title, sub, stats, chart, id = "track-record" }: TrackRecordProps) {
  const headingId = `${id}-heading`;
  return (
    <Section bg="surface" id={id} aria-labelledby={headingId} className={PAD.data} containerClassName="flex flex-col gap-8 lg:gap-10">
      <div className="flex flex-col gap-2.5">
        <h2 id={headingId} className={T.h40b}>
          {title}
        </h2>
        {sub && <p className="max-w-[760px] text-[16px] leading-[1.45] text-muted-surface lg:text-[18px]">{sub}</p>}
      </div>
      <StatList variant="bold5" stats={stats} />
      <StackedBarChart {...chart} as="h3" id={`${id}-chart`} />
    </Section>
  );
}
