import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { TextLink } from "@/components/ui/TextLink";
import { T } from "@/components/ui/type";
import type { Leader } from "@/data/site/leaders";

/**
 * B37 LeaderList (LEAD §2). Leaders grouped under Bold 24 group titles (1px #D6D6D6 top rule),
 * one row per leader: 260 x 300 photo, then name, title, full bio, inert "LinkedIn profile" and an
 * optional inert "View [area of focus]" button. Groups render in order of first appearance.
 * 390: photo stacks above the text (160 x 185). 768: side by side, photo 200 x 231.
 */
export function LeaderList({ leaders }: { leaders: Leader[] }) {
  const groups: { title: string; leaders: Leader[] }[] = [];
  for (const l of leaders) {
    const g = groups.find((x) => x.title === l.group);
    if (g) g.leaders.push(l);
    else groups.push({ title: l.group, leaders: [l] });
  }

  return (
    <Section className="pb-8 lg:pb-12">
      {groups.map((g) => (
        <div key={g.title}>
          <h2 className={`border-t border-[#D6D6D6] pb-3 pt-4 ${T.h24b}`}>{g.title}</h2>
          <ul>
            {g.leaders.map((l) => (
              <li key={l.name}>
                <LeaderRow leader={l} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}

function LeaderRow({ leader: l }: { leader: Leader }) {
  const titleLines = Array.isArray(l.title) ? l.title : [l.title];
  return (
    <article className="flex flex-col gap-4 py-6 md:flex-row md:items-start md:gap-6 md:py-7 lg:gap-10 lg:py-9">
      <ImagePlaceholder className="h-[185px] w-[160px] shrink-0 rounded-control md:h-[231px] md:w-[200px] lg:h-[300px] lg:w-[260px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <h3 className={T.name28b}>{l.name}</h3>
        <p className="text-[16px] font-medium leading-[1.5] text-muted lg:text-[17px]">
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
        <p className="text-[16px] leading-[1.5] text-ink">{l.bio}</p>
        <div className="pt-1">
          <TextLink href={null} variant="external" size={14} iconBefore>
            LinkedIn profile<span className="sr-only">: {l.name}</span>
          </TextLink>
        </div>
        {l.hasAreaButton && (
          <div className="flex pt-4 lg:pt-6">
            <Button href={null}>
              View [area of focus]<span className="sr-only">: {l.name}</span>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
