import { Section } from "@/components/ui/Section";
import { PAD, T } from "@/components/ui/type";
import type { StatItem } from "./StatRow";
import { PIPELINE_LAND, PIPELINE_MAP_H, PIPELINE_MAP_W, projectPipeline } from "./pipelineMap";
import { CountUp } from "@/components/ui/CountUp";

/**
 * "Our group pipeline" (inventory B21, DC §3), group level only (client feedback round): no per-market
 * figures or selection. Surface band, 80/80. 1024+: Bold 40 heading, short intro and the group headline
 * stats (2 x 2, Bold 36 values) on the left, a static greyscale Asia Pacific map (pipelineMap.ts, r12 white
 * frame) on the right with a dot on each market where ESR has a data centre presence. Below 1024 the map
 * stacks under the stats. The dots are decorative; the markets are also given as a screen-reader list.
 */
export type PipelineLocation = {
  /** Market the dot belongs to (several dots may share one) */
  market: string;
  lon: number;
  lat: number;
};

export type PowerPipelineProps = {
  title: string;
  sub?: string;
  stats: StatItem[];
  /** Markets with a data centre presence, in reading order */
  markets: string[];
  /** Dot positions (longitude / latitude) */
  locations: PipelineLocation[];
  /** Legend label for the dots */
  legend: string;
  footnote?: React.ReactNode;
  id?: string;
};

export function PowerPipeline({ title, sub, stats, markets, locations, legend, footnote, id = "pipeline" }: PowerPipelineProps) {
  const headingId = `${id}-heading`;
  const listId = `${id}-markets`;
  return (
    <Section
      bg="surface"
      id={id}
      aria-labelledby={headingId}
      className={PAD.data}
      containerClassName="grid items-center gap-8 lg:grid-cols-[minmax(0,560fr)_minmax(0,646fr)] lg:gap-16 xl:gap-20"
    >
      <div className="flex flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 id={headingId} className={T.h40b}>
            {title}
          </h2>
          {sub && <p className="max-w-[820px] text-[16px] leading-[1.45] text-muted-surface lg:text-[18px]">{sub}</p>}
        </div>

        <ul role="list" aria-label={`${title}: headline figures`} className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-x-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8">
          {stats.map((s) => (
            <li key={s.label} className="flex min-w-0 flex-col gap-1.5 border-t border-[#C9CDD3] pt-4">
              <span className={`${T.stat36b} whitespace-nowrap`}><CountUp value={s.value} /></span>
              <span className="text-[14px] leading-[1.45] text-muted-surface md:text-[15px]">{s.label}</span>
            </li>
          ))}
        </ul>

        {footnote && <p className="hidden text-[13px] leading-[1.45] text-muted-surface lg:block">{footnote}</p>}
      </div>

      <figure className="flex flex-col gap-3">
        <div className="relative aspect-[646/571] w-full overflow-hidden rounded-card bg-white">
          <svg viewBox={`0 0 ${PIPELINE_MAP_W} ${PIPELINE_MAP_H}`} aria-hidden="true" focusable="false" className="absolute inset-0 block size-full">
            <path d={PIPELINE_LAND} fillRule="evenodd" className="fill-[#E1E3E7]" />
          </svg>
          {locations.map((d) => {
            const pos = projectPipeline(d.lon, d.lat);
            return (
              <span
                key={`${d.market}-${d.lon}-${d.lat}`}
                aria-hidden="true"
                className="absolute aspect-square w-[2.8%] min-w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_2px_#fff]"
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              />
            );
          })}
        </div>
        <figcaption className="flex items-center gap-2 text-[13px] leading-[1.45] text-muted-surface">
          <span aria-hidden="true" className="size-3 rounded-full bg-ink" />
          <span id={listId}>{legend}</span>
          <ul role="list" aria-labelledby={listId} className="sr-only">
            {markets.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </figcaption>
      </figure>

      {footnote && <p className="text-[13px] leading-[1.45] text-muted-surface lg:hidden">{footnote}</p>}
    </Section>
  );
}
