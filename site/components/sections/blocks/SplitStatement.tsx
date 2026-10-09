import { Section, type SectionBg } from "@/components/ui/Section";
import { T, PAD } from "@/components/ui/type";

/**
 * B4 SplitStatement (HOME §2 "Who we are"). Eyebrow + body on the left (413 of 1306),
 * a Medium 40 statement on the right (773), 120px apart. Stacks with a 24px gap below 1024.
 */
export function SplitStatement({
  eyebrow,
  body,
  statement,
  bg = "white",
}: {
  /** SemiBold 24 eyebrow, rendered as the section's h2 */
  eyebrow: string;
  body?: string;
  /** Medium 40 statement */
  statement: string;
  bg?: SectionBg;
}) {
  return (
    <Section
      bg={bg}
      className={PAD.block}
      containerClassName="flex flex-col gap-6 lg:grid lg:grid-cols-[413fr_773fr] lg:items-start lg:gap-12 xl:gap-[120px]"
    >
      <div className="flex flex-col gap-4 lg:gap-8">
        <h2 className={T.eyebrow24}>{eyebrow}</h2>
        {body && <p className={T.bodyLg}>{body}</p>}
      </div>
      <p className={T.h40m}>{statement}</p>
    </Section>
  );
}
