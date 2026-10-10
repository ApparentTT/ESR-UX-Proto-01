import Link from "next/link";
import { Container } from "./Container";
import { Icon } from "@/components/ui/Icon";
import { InertLink } from "@/components/ui/InertLink";
import { Logo } from "@/components/ui/Logo";

type Group = { title: string; links: { label: string; href?: string }[] };

const PORTFOLIO: Group = {
  title: "Our portfolio",
  links: [
    { label: "Our global portfolio", href: "/portfolio" },
    { label: "Properties", href: "/portfolio/properties" },
    { label: "Developments", href: "/portfolio/developments" },
    { label: "Data centres", href: "/portfolio/data-centres" },
    { label: "Infrastructure" },
  ],
};
const INVESTORS: Group = { title: "Investors", links: [{ label: "Investing with ESR", href: "/investors" }, { label: "Funds" }] };
const SUSTAINABILITY: Group = {
  title: "Sustainability",
  links: [
    { label: "Overview", href: "/sustainability" },
    { label: "Sustainability case studies", href: "/sustainability/case-studies" },
    { label: "Sustainability governance", href: "/sustainability/governance" },
  ],
};
const NEWS: Group = {
  title: "News and insights",
  links: [
    { label: "All stories", href: "/news" },
    { label: "Thought leadership", href: "/news/search?type=thought-leadership" },
    { label: "Press releases", href: "/news/search?type=press-release" },
    { label: "Case studies", href: "/news/search?type=case-study" },
  ],
};
const ABOUT: Group = {
  title: "About",
  links: [
    { label: "About us", href: "/about" },
    { label: "Our leadership", href: "/about/leadership" },
    { label: "Our customers" },
    { label: "Proven capability", href: "/about/proven-capability" },
    { label: "Resources" },
    { label: "Corporate governance", href: "/about/corporate-governance" },
    { label: "Our people", href: "/about/our-people" },
  ],
};
/** Generic Material Symbols stand in for the brand glyphs (greyscale wireframe; WeChat is drawn as a paper plane). */
const SOCIAL: { label: string; icon: string }[] = [
  { label: "Instagram", icon: "photo_camera" },
  { label: "LinkedIn", icon: "work" },
  { label: "WeChat", icon: "send" },
  { label: "YouTube", icon: "smart_display" },
];
const LEGAL = ["Terms & Conditions", "Privacy", "Cookies Policy"];

function FooterLink({ label, href, className = "" }: { label: string; href?: string; className?: string }) {
  return href ? (
    <Link href={href} className={`hover:text-ink hover:underline ${className}`}>
      {label}
    </Link>
  ) : (
    <InertLink className={`hover:text-ink hover:underline ${className}`}>{label}</InertLink>
  );
}

/** Block heading Bold 16 #374151, -0.32 tracking; links Medium 14/20 muted, 16 below the heading and 12 apart. */
const HEADING = "text-[16px] font-bold tracking-[-0.02em] text-body";
const LINKS = "mt-4 space-y-3 text-[14px] font-medium leading-5 text-muted";

function Column({ group }: { group: Group }) {
  return (
    <div>
      <h2 className={HEADING}>{group.title}</h2>
      <ul className={LINKS}>
        {group.links.map((l) => (
          <li key={l.label}>
            <FooterLink {...l} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Accordion({ group, defaultOpen }: { group: Group; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="focus-inset flex min-h-14 cursor-pointer list-none items-center justify-between text-base font-medium [&::-webkit-details-marker]:hidden">
        {group.title}
        <Icon name="keyboard_arrow_down" size={24} className="transition-transform group-open:rotate-180" />
      </summary>
      <ul className="space-y-1 pb-4 text-[15px] text-muted">
        {group.links.map((l) => (
          <li key={l.label}>
            <FooterLink {...l} className="block py-2.5" />
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      {/* Bottom padding keeps the last row clear of the fixed Prototype badge. */}
      <Container className="pt-10 pb-20 md:pt-16">
        {/* Tablet: logo row, then the four link columns as a 2x2 grid. 1024: logo row, then 4 columns.
            1280+: as drawn, a ~400/1306 logo cell and four equal columns 16px apart. */}
        <div className="hidden gap-x-10 gap-y-10 md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-x-4 xl:grid-cols-[400fr_210.5fr_210.5fr_210.5fr_210.5fr]">
          <div className="md:col-span-2 lg:col-span-4 xl:col-span-1">
            <Logo />
          </div>
          <div className="space-y-12">
            <Column group={PORTFOLIO} />
            <Column group={INVESTORS} />
          </div>
          <div className="space-y-12">
            <Column group={SUSTAINABILITY} />
            <Column group={NEWS} />
          </div>
          <Column group={ABOUT} />
          <div>
            <h2 className={HEADING}>Connect with us</h2>
            <ul className={LINKS}>
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <InertLink className="inline-flex items-center gap-2 hover:text-ink hover:underline">
                    <Icon name={s.icon} size={18} className="text-ink" />
                    {s.label}
                  </InertLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile: accordion groups, in the desktop column order */}
        <div className="md:hidden">
          <Logo />
          <div className="mt-6 border-t border-line">
            <Accordion group={PORTFOLIO} defaultOpen />
            <Accordion group={INVESTORS} />
            <Accordion group={SUSTAINABILITY} />
            <Accordion group={NEWS} />
            <Accordion group={ABOUT} />
          </div>
          <h2 className={`mt-6 ${HEADING}`}>Connect with us</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <InertLink className="inline-flex h-11 items-center gap-2 rounded-full bg-surface px-4 text-sm font-medium text-body">
                  <Icon name={s.icon} size={18} />
                  {s.label}
                </InertLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:mt-16 md:flex-row md:items-center md:justify-between">
          <p>© 2026 ESR. All Rights Reserved.</p>
          <ul className="-my-3 flex flex-wrap gap-x-4 md:my-0 md:gap-x-8">
            {LEGAL.map((l) => (
              <li key={l}>
                {/* 390: a 40px-tall tap target; the row's negative margin keeps the drawn spacing */}
                <InertLink className="inline-flex min-h-10 items-center hover:text-ink hover:underline md:min-h-0">{l}</InertLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
