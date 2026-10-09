import { Container } from "@/components/layout/Container";
import { T } from "@/components/ui/type";
import { TextLink } from "@/components/ui/TextLink";

/**
 * Heading block placed before a content block (inventory B3, "Blocks - Structure").
 * title: Medium 40. sub: muted 18/28. link: section link top right (drops below at <1024).
 * eyebrow: heading in SemiBold 24 instead (HOME "Scale that delivers").
 * bold: Bold 40/1.2 heading with a 10px gap to an 18/1.45 sub (SUS "Proof points").
 */
export function SectionHeading({
  title,
  sub,
  link,
  variant = "title",
  as: H = "h2",
  bg = "white",
  className = "",
}: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  link?: { label: string; href: string | null };
  variant?: "title" | "eyebrow" | "bold";
  as?: "h1" | "h2" | "h3";
  bg?: "white" | "surface";
  className?: string;
}) {
  const head = variant === "eyebrow" ? T.eyebrow24 : variant === "bold" ? T.h40b : T.h40m;
  const pad = variant === "bold" ? "pt-12 pb-2 md:pt-16 lg:pt-20" : "pt-12 pb-6 md:pt-16 lg:pt-[72px] lg:pb-[30px]";
  return (
    <div className={`${bg === "surface" ? "bg-surface" : "bg-white"} ${pad} ${className}`}>
      <Container className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="max-w-[893px] lg:pr-[120px]">
          <H className={head}>{title}</H>
          {sub && <p className={`${variant === "bold" ? "mt-2.5" : "mt-4 lg:mt-5"} ${variant === "bold" ? T.sub18 : "text-[16px] leading-6 text-muted lg:text-[18px] lg:leading-7"}`}>{sub}</p>}
        </div>
        {link && (
          <TextLink href={link.href} variant="section">
            {link.label}
          </TextLink>
        )}
      </Container>
    </div>
  );
}
