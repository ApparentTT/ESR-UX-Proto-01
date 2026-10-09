import { Section, type SectionBg } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * B25 FullWidthImage: one container-wide image placeholder.
 * size (desktop ratio of the 1306-wide wireframe image):
 * - "default" 1306 x 500 (DC §2, INV §2, SUS §2, SGOV §4, CGOV §2)
 * - "tall"    1306 x 606 (ABOUT §2)
 * - "short"   1306 x 422 (PEOPLE §2)
 * All sizes are 4:3 at 390 and 16:9 at 768 so the image never gets too thin.
 * py: "block" = 72/72 (32/48 below desktop); "compact" = 32/32 (PEOPLE, 24 on mobile).
 */
const RATIO = {
  default: "lg:aspect-[1306/500]",
  tall: "lg:aspect-[1306/606]",
  short: "lg:aspect-[1306/422]",
} as const;

const PY = {
  block: "py-8 md:py-12 lg:py-[72px]",
  compact: "py-6 md:py-8",
} as const;

export function FullWidthImage({
  size = "default",
  py = "block",
  bg = "white",
}: {
  size?: keyof typeof RATIO;
  py?: keyof typeof PY;
  bg?: SectionBg;
}) {
  return (
    <Section bg={bg} className={PY[py]}>
      <ImagePlaceholder className={`aspect-[4/3] w-full rounded-control md:aspect-[16/9] ${RATIO[size]}`} iconSize={48} />
    </Section>
  );
}
