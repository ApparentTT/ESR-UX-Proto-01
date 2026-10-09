import { Section, type SectionBg } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { T, PAD } from "@/components/ui/type";

export type SplitBlockCta = { label: string; href: string | null };

/**
 * B8 SplitBlock ("Blocks - Structure" text + image). Medium 40 title, 18/28 body, primary button,
 * and a ~5:3 image placeholder; two equal columns 30px apart, vertically centred.
 * imageSide "left" (ABOUT §5): image 653 | gap 119 | text 534, and the image stacks first on mobile.
 * Below 1024 it stacks: text then image (24px gap).
 */
export function SplitBlock({
  title,
  body,
  cta,
  imageSide = "right",
  bg = "white",
  headingLevel: H = "h2",
}: {
  title: string;
  body?: string;
  cta?: SplitBlockCta;
  imageSide?: "right" | "left";
  /** CGOV §4 draws this block on a grey band: use "surface" */
  bg?: SectionBg;
  headingLevel?: "h2" | "h3";
}) {
  const left = imageSide === "left";
  return (
    <Section
      bg={bg}
      className={PAD.block}
      containerClassName={`flex flex-col gap-6 lg:grid lg:items-center ${
        left ? "lg:grid-cols-[653fr_534fr] lg:gap-16 xl:gap-[119px]" : "lg:grid-cols-2 lg:gap-[30px]"
      }`}
    >
      <div className={left ? "order-2 lg:order-none lg:col-start-2 lg:row-start-1" : ""}>
        <H className={T.h40m}>{title}</H>
        {body && <p className={`mt-4 lg:mt-5 ${T.bodyLg}`}>{body}</p>}
        {cta && (
          <div className="mt-6 flex lg:mt-8">
            <Button href={cta.href}>
              {/* white-space: pre keeps verbatim double spaces ("Meet  our leadership team") */}
              <span className="whitespace-pre">{cta.label}</span>
            </Button>
          </div>
        )}
      </div>
      <ImagePlaceholder
        className={`w-full rounded-control ${left ? "order-1 aspect-[638/380] lg:order-none lg:col-start-1 lg:row-start-1 lg:aspect-[653/380]" : "aspect-[638/380]"}`}
        iconSize={40}
      />
    </Section>
  );
}
