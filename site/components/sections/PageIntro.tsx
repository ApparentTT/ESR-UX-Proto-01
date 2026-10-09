import { Container } from "@/components/layout/Container";
import { T } from "@/components/ui/type";

/**
 * Text-only page header (inventory B2).
 * default: Medium 40 title + 18/28 body in a ~685px column, 72px top, no bottom padding by default.
 * display: Bold 48 title + muted 20px (or 19px) sub (Leadership, Contact).
 */
export function PageIntro({
  title,
  body,
  variant = "default",
  subSize = 20,
  pb = "none",
  children,
}: {
  title: string;
  body?: React.ReactNode;
  variant?: "default" | "display";
  /** display variant only: 20 (Leadership) or 19 (Contact) */
  subSize?: 19 | 20;
  /** bottom padding: none (next section supplies the space), sm (~40), md (48-56), lg (72) */
  pb?: "none" | "sm" | "md" | "lg";
  /** Actions or a CTA rendered under the text */
  children?: React.ReactNode;
}) {
  const pbCls = { none: "pb-0", sm: "pb-8 lg:pb-10", md: "pb-10 lg:pb-14", lg: "pb-12 md:pb-16 lg:pb-[72px]" }[pb];
  return (
    <section className={`bg-white pt-10 md:pt-14 lg:pt-[72px] ${pbCls}`}>
      <Container>
        {variant === "default" ? (
          <div className="max-w-[685px]">
            <h1 className={T.h40m}>{title}</h1>
            {body && <div className={`mt-4 lg:mt-5 ${T.bodyLg}`}>{body}</div>}
          </div>
        ) : (
          <div className={subSize === 20 ? "max-w-[820px]" : "max-w-[760px]"}>
            <h1 className={T.display48}>{title}</h1>
            {body && <div className={`mt-3 lg:mt-3.5 ${subSize === 20 ? T.lead20 : "text-[17px] leading-[1.5] text-muted lg:text-[19px]"}`}>{body}</div>}
          </div>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
