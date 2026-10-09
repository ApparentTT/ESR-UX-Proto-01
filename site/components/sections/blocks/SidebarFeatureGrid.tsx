import { Section, type SectionBg } from "@/components/ui/Section";
import { T, PAD } from "@/components/ui/type";
import { FeatureCard, type FeatureCardData } from "./FeatureCard";

/**
 * B5 SidebarFeatureGrid (HOME §4 "What we do"). Eyebrow + body in a 413 sidebar, a 2 x 2 grid of
 * FeatureCards (24px gap) in the 773 column. 390: intro then 1 column; 768: intro on top, cards 2-up.
 */
export function SidebarFeatureGrid({
  eyebrow,
  body,
  cards,
  bg = "white",
}: {
  /** SemiBold 24 eyebrow, rendered as the section's h2 */
  eyebrow: string;
  body?: string;
  cards: FeatureCardData[];
  bg?: SectionBg;
}) {
  return (
    <Section
      bg={bg}
      className={PAD.block}
      containerClassName="flex flex-col gap-8 lg:grid lg:grid-cols-[413fr_773fr] lg:items-start lg:gap-12 xl:gap-[120px]"
    >
      <div className="flex flex-col gap-4 lg:gap-8">
        <h2 className={T.eyebrow24}>{eyebrow}</h2>
        {body && <p className={T.bodyLg}>{body}</p>}
      </div>
      <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
        {cards.map((c) => (
          <li key={c.title}>
            <FeatureCard {...c} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
