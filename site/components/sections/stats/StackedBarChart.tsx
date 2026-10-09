import { Legend, FootnoteText } from "@/components/ui/DataBits";
import { T } from "@/components/ui/type";

/**
 * Two-segment stacked bar chart in a white card (inventory B26, INV §3c).
 * Desktop and tablet: vertical columns in a 300px area, value label above and year below each bar,
 * top segment ink, bottom segment mid grey, no axes or gridlines.
 * Mobile (< 768): the same data as horizontal stacked bars, one row per year, so every label stays
 * legible without a horizontal scroller (the spec's listed alternative).
 * The drawn bars are hidden from assistive tech; a visually hidden table carries the data.
 */

export type StackedBar = {
  /** Category label under the bar, e.g. "2019" */
  label: string;
  /** Value label above the bar, verbatim, e.g. "US $XXbn" */
  value: string;
  /** Top segment size (ink), in the chart's own units */
  top: number;
  /** Bottom segment size (mid grey), in the chart's own units */
  bottom: number;
};

export type StackedBarChartProps = {
  title: string;
  /** Series names: top segment (ink) and bottom segment (mid grey) */
  topLabel: string;
  bottomLabel: string;
  bars: StackedBar[];
  /** Scale maximum (tallest bar total). Defaults to the largest total. */
  max?: number;
  /** 13px footnote paragraph inside the card */
  footnote?: React.ReactNode;
  /** Heading level of the chart title (default h3, under the band's h2) */
  as?: "h2" | "h3" | "h4";
  /** Category column name for the hidden data table (default "Year") */
  categoryName?: string;
  /** Value column name for the hidden data table (default: the title) */
  valueName?: string;
  className?: string;
  id?: string;
};

/** Tallest bar in px at 768+ (300px area, room left for the labels). */
const MAX_BAR_PX = 210;

export function StackedBarChart({
  title,
  topLabel,
  bottomLabel,
  bars,
  max,
  footnote,
  as: H = "h3",
  categoryName = "Year",
  valueName,
  className = "",
  id = "stacked-bar-chart",
}: StackedBarChartProps) {
  const scaleMax = max ?? Math.max(1, ...bars.map((b) => b.top + b.bottom));
  const titleId = `${id}-title`;
  const first = bars[0]?.label;
  const last = bars[bars.length - 1]?.label;

  return (
    <figure aria-labelledby={titleId} className={`relative flex flex-col gap-5 rounded-card bg-white p-5 md:px-8 md:py-7 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <H id={titleId} className={`flex-1 ${T.title20m}`}>
          {title}
        </H>
        <Legend
          items={[
            { label: bottomLabel, tone: "mid" },
            { label: topLabel, tone: "dark" },
          ]}
        />
      </div>

      {/* Vertical columns, 768+ */}
      <div aria-hidden="true" className="hidden h-[300px] grid-cols-8 items-end gap-3 md:grid lg:gap-5">
        {bars.map((b) => {
          const total = b.top + b.bottom;
          return (
            <div key={b.label} className="flex min-w-0 flex-col items-center gap-2.5">
              <span className="whitespace-nowrap text-[12px] font-medium leading-[1.45] text-ink lg:text-[13px]">{b.value}</span>
              <span
                className="flex w-full flex-col overflow-hidden rounded-[6px]"
                style={{ height: `${(total / scaleMax) * MAX_BAR_PX}px` }}
              >
                <span className="w-full bg-ink" style={{ flexGrow: b.top }} />
                <span className="w-full bg-[#A1A6AD]" style={{ flexGrow: b.bottom }} />
              </span>
              <span className="text-[12px] leading-[1.45] text-muted lg:text-[13px]">{b.label}</span>
            </div>
          );
        })}
      </div>

      {/* Horizontal rows, < 768 */}
      <div aria-hidden="true" className="flex flex-col gap-3 md:hidden">
        {bars.map((b) => {
          const total = b.top + b.bottom;
          return (
            <div key={b.label} className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3">
              <span className="text-[13px] leading-[1.45] text-muted">{b.label}</span>
              <span className="flex h-4 min-w-0">
                <span
                  className="flex h-full overflow-hidden rounded-[4px]"
                  style={{ width: `${(total / scaleMax) * 100}%` }}
                >
                  <span className="h-full bg-[#A1A6AD]" style={{ flexGrow: b.bottom }} />
                  <span className="h-full bg-ink" style={{ flexGrow: b.top }} />
                </span>
              </span>
              <span className="whitespace-nowrap text-[12px] font-medium leading-[1.45] text-ink">{b.value}</span>
            </div>
          );
        })}
      </div>

      <div className="sr-only">
        <table>
          <caption>
            {`${title}: stacked bars from ${first} to ${last}, each split into ${topLabel} (top segment) and ${bottomLabel} (bottom segment).`}
          </caption>
          <thead>
            <tr>
              <th scope="col">{categoryName}</th>
              <th scope="col">{valueName ?? title}</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.label}>
                <th scope="row">{b.label}</th>
                <td>{b.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footnote && <FootnoteText>{footnote}</FootnoteText>}
    </figure>
  );
}
