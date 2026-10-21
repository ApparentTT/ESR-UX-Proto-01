import { useId } from "react";
import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { TextLink } from "@/components/ui/TextLink";
import { T } from "@/components/ui/type";

export type LeaderGridItem = {
  name: string;
  /** A string, or one line per array item */
  title: string | string[];
  /** One line (about 12 words at most) */
  summary: string;
};

/**
 * Leadership module (ABOUT §5, client feedback round): Medium 40 heading, up to eight leaders as cards
 * (4:5 portrait placeholder, Bold 18/20 name, muted role and a one-line bio; no LinkedIn links), then a
 * "Meet our full leadership team" arrow link. 4 columns from 1024, 2 at 768 and 390 (smaller type at 390).
 * `columns={3}` (Japan About, at most three leaders): 3 columns from 768, 2 at 390 with the third wrapping.
 */
export function LeaderGrid({
  title,
  leaders,
  cta,
  columns = 4,
}: {
  title: string;
  leaders: LeaderGridItem[];
  cta?: { label: string; href: string | null };
  /** 4 (group About, up to eight leaders) or 3 (up to three) */
  columns?: 3 | 4;
}) {
  const headingId = `${useId()}-title`;
  return (
    <Section aria-labelledby={headingId} className="pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-[72px] lg:pt-[72px]">
      <h2 id={headingId} className={T.h40m}>
        {title}
      </h2>
      <ul
        role="list"
        className={`mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:mt-[30px] lg:gap-x-[30px] lg:gap-y-12 ${columns === 3 ? "md:grid-cols-3" : "lg:grid-cols-4"}`}
      >
        {leaders.slice(0, columns === 3 ? 3 : 8).map((l, i) => {
          const titleLines = Array.isArray(l.title) ? l.title : [l.title];
          return (
            <li key={`${i}-${l.name}`} className="min-w-0">
              <article className="flex flex-col">
                <ImagePlaceholder className="aspect-[4/5] w-full rounded-control" />
                <h3 className="mt-3 text-[16px] font-bold leading-[1.4] text-ink md:mt-4 md:text-[18px] lg:text-[20px]">{l.name}</h3>
                <p className="mt-1 text-[13px] font-medium leading-[1.45] text-muted md:text-[14px] lg:text-[16px]">
                  {titleLines.map((line, j) => (
                    <span key={j} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <p className="mt-2 text-[13px] leading-[1.45] text-muted md:text-[14px] lg:text-[15px]">{l.summary}</p>
              </article>
            </li>
          );
        })}
      </ul>
      {cta && (
        <div className="mt-8 lg:mt-12">
          <TextLink href={cta.href} variant="arrow" size={18}>
            {cta.label}
          </TextLink>
        </div>
      )}
    </Section>
  );
}
