import { Container } from "@/components/layout/Container";

/**
 * Full-bleed section band. Backgrounds collapse the wireframes' greys into the project tokens:
 * white, surface (#F5F6F8: tint, surface and CTA bands) and grey (#E5E7EB: hero, form blocks, tiles).
 */
export type SectionBg = "white" | "surface" | "grey";
const BG: Record<SectionBg, string> = { white: "bg-white", surface: "bg-surface", grey: "bg-line" };

export function Section({
  bg = "white",
  className = "",
  containerClassName = "",
  contained = true,
  as: Tag = "section",
  children,
  ...rest
}: {
  bg?: SectionBg;
  /** Padding and any extra classes on the full-bleed band, e.g. PAD.block */
  className?: string;
  containerClassName?: string;
  /** false to lay out edge to edge (marquees, carousels) */
  contained?: boolean;
  as?: "section" | "div";
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`${BG[bg]} ${className}`} {...rest}>
      {contained ? <Container className={containerClassName}>{children}</Container> : children}
    </Tag>
  );
}
