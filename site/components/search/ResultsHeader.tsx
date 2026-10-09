import type { SortId } from "@/lib/filters";
import { SortControl } from "./SortControl";

type Props = {
  title: string;
  subtitle: string;
  sort: SortId;
  onSort: (s: SortId) => void;
};

export function ResultsHeader({ title, subtitle, sort, onSort }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 py-5 md:py-6">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold leading-snug md:text-[22px]" aria-live="polite">
          {title}
        </h1>
        <p className="mt-1 text-[13px] text-muted-surface md:text-sm">{subtitle}</p>
      </div>
      <SortControl value={sort} onChange={onSort} />
    </div>
  );
}
