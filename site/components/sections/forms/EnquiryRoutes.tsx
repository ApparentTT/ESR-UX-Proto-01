import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { TextLink } from "@/components/ui/TextLink";

export type EnquiryRoute = {
  /** Material Symbols ligature, 26px */
  icon: string;
  title: string;
  description: string;
  /** Email or site link. href null = inert (not wireframed); icon "mail" or "open_in_new" */
  link: { label: string; icon: string; href: string | null };
};

/**
 * B40 EnquiryRoutes (CONTACT §2). White band directly under the page intro (no top padding,
 * 72 bottom). Surface cards (radius 12, padding 26, 10px gaps): icon, Medium 20 title,
 * 14/1.5 description, then a Medium 14 link with a trailing icon. Equal fluid columns with a
 * 20px gap: 1 at 390, 2 at 768, 3 at 1024+ (the last row stays left-aligned).
 */
export function EnquiryRoutes({ routes, headingLevel: H = "h2" }: { routes: EnquiryRoute[]; headingLevel?: "h2" | "h3" }) {
  return (
    <Section bg="white" className="pb-12 md:pb-16 lg:pb-[72px]">
      <ul className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {routes.map((r) => (
          <li key={r.title} className="flex flex-col items-start gap-2.5 rounded-card bg-surface p-5 md:p-[26px]">
            <Icon name={r.icon} size={26} className="text-ink" />
            <H className="text-[18px] font-medium leading-[1.5] text-ink lg:text-[20px]">{r.title}</H>
            <p className="text-[14px] leading-[1.5] text-muted-surface">{r.description}</p>
            <div className="pt-1">
              <TextLink href={r.link.href} variant="external" icon={r.link.icon} size={14}>
                {r.link.label}
              </TextLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
