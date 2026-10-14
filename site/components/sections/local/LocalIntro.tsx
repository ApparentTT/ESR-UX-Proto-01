import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SmartLink } from "@/components/ui/SmartLink";
import { T } from "@/components/ui/type";

export type Crumb = { label: string; href: string | null };

/**
 * Page intro for the Japan local pages where PageIntro has no slot for the design:
 * - default (About, 1110:75219): Medium 40 title + 18/28 body in a 685px column, a primary button with
 *   arrow_outward on the right from 1024 (under the text below that). 72 top, no bottom padding.
 * - display (Property tours, 1258:28921): optional breadcrumb (13px muted, links), Bold 48 title, 19px muted sub
 *   in a 760px column. 72 top, 56 bottom.
 */
export function LocalIntro({
  title,
  body,
  variant = "default",
  breadcrumb,
  action,
}: {
  title: string;
  body?: string;
  variant?: "default" | "display";
  breadcrumb?: Crumb[];
  /** Button on the right (default variant) */
  action?: { label: string; href: string | null; icon?: string };
}) {
  if (variant === "display") {
    return (
      <section className="bg-white pb-10 pt-10 md:pb-12 md:pt-14 lg:pb-14 lg:pt-[72px]">
        <Container className="flex flex-col gap-3 lg:gap-3.5">
          {breadcrumb && <Breadcrumb items={breadcrumb} />}
          <div className="max-w-[760px]">
            <h1 className={T.display48}>{title}</h1>
            {body && <p className="mt-3 text-[17px] leading-[1.48] text-muted lg:mt-3.5 lg:text-[19px]">{body}</p>}
          </div>
        </Container>
      </section>
    );
  }
  return (
    <section className="bg-white pt-10 md:pt-14 lg:pt-[72px]">
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-[685px]">
          <h1 className={T.h40m}>{title}</h1>
          {body && <p className={`mt-4 lg:mt-5 ${T.bodyLg}`}>{body}</p>}
        </div>
        {action && (
          <Button href={action.href} icon={action.icon ?? "arrow_outward"} iconSize={22} className="self-start lg:self-center">
            {action.label}
          </Button>
        )}
      </Container>
    </section>
  );
}

function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-[13px] leading-[1.48] text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="flex items-center">
              {last ? (
                <span aria-current="page">{c.label}</span>
              ) : (
                <>
                  <SmartLink href={c.href} className="underline-offset-2 hover:text-ink hover:underline">
                    {c.label}
                  </SmartLink>
                  <span aria-hidden="true" className="whitespace-pre">
                    {"  /  "}
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
