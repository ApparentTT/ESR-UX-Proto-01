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
const SOCIAL = ["Instagram", "LinkedIn", "WeChat", "YouTube"];
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

function Column({ group }: { group: Group }) {
  return (
    <div>
      <h2 className="text-sm font-semibold">{group.title}</h2>
      <ul className="mt-4 space-y-3 text-sm text-muted">
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
        {/* Tablet and desktop: columns */}
        <div className="hidden gap-10 md:grid md:grid-cols-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div className="md:col-span-4 lg:col-span-1">
            <Logo />
          </div>
          <div className="space-y-10">
            <Column group={PORTFOLIO} />
            <Column group={INVESTORS} />
          </div>
          <div className="space-y-10">
            <Column group={SUSTAINABILITY} />
            <Column group={NEWS} />
          </div>
          <Column group={ABOUT} />
          <div>
            <h2 className="text-sm font-semibold">Connect with us</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {SOCIAL.map((s) => (
                <li key={s}>
                  <InertLink className="inline-flex items-center gap-2 hover:text-ink hover:underline">
                    <Icon name="open_in_new" size={16} />
                    {s}
                  </InertLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile: accordion groups */}
        <div className="md:hidden">
          <Logo />
          <div className="mt-6 border-t border-line">
            <Accordion group={PORTFOLIO} defaultOpen />
            <Accordion group={INVESTORS} />
            <Accordion group={ABOUT} />
            <Accordion group={SUSTAINABILITY} />
            <Accordion group={NEWS} />
          </div>
          <h2 className="mt-6 text-sm font-semibold">Connect with us</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {SOCIAL.map((s) => (
              <li key={s}>
                <InertLink className="inline-flex h-11 items-center rounded-full bg-surface px-4 text-sm">{s}</InertLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:mt-16 md:flex-row md:items-center md:justify-between">
          <p>© 2026 ESR. All Rights Reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l}>
                <InertLink className="hover:text-ink hover:underline">{l}</InertLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
