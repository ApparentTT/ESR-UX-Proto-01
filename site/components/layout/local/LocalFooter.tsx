import { Container } from "@/components/layout/Container";
import { InertLink } from "@/components/ui/InertLink";
import { Logo } from "@/components/ui/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { SOCIAL_LINKS, SocialIcon } from "@/components/ui/SocialIcon";
import { GROUP_SITE_SUFFIX, LOCAL_FOOTER, LOCAL_FOOTER_COPY, type LocalFooterGroup } from "@/config/local-nav";

/** Block heading Bold 16 #374151, -0.32 tracking; links Medium 14/20 muted, 16 below the heading and 12 apart. */
const HEADING = "text-[16px] font-bold tracking-[-0.02em] text-body";
const LINKS = "mt-4 space-y-3 text-[14px] font-medium leading-5 text-muted";
const LINK = "hover:text-ink hover:underline";

function FooterLink({ link }: { link: LocalFooterGroup["links"][number] }) {
  return (
    <SmartLink href={link.href} className={LINK}>
      {link.label}
      {link.external && <span className="sr-only"> {GROUP_SITE_SUFFIX}</span>}
    </SmartLink>
  );
}

function Column({ group }: { group: LocalFooterGroup }) {
  return (
    <div>
      <h2 className={HEADING}>{group.title}</h2>
      <ul className={LINKS}>
        {group.links.map((l) => (
          <li key={l.label}>
            <FooterLink link={l} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Local footer (Figma Components "Local footer / Full listing" 192:9837; mobile "Local-Footer / mob" 311:6622).
 * From 768 it is the group footer's layout (logo cell and four link columns at 1280+, logo row over the
 * columns below that), with the social glyphs drawn in Figma. Below 768, as drawn: the full listing in two
 * columns (Our portfolio | Investors, Sustainability | About, News and insights | the legal links), with no
 * accordions and no social links, then the copyright under a line.
 */
export function LocalFooter() {
  const F = LOCAL_FOOTER;
  return (
    <footer className="border-t border-line bg-white">
      {/* Bottom padding keeps the last row clear of the fixed Prototype badge. */}
      <Container className="pb-20 pt-[30px] md:pt-16">
        <div className="hidden gap-x-10 gap-y-10 md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-x-4 xl:grid-cols-[400fr_210.5fr_210.5fr_210.5fr_210.5fr]">
          <div className="md:col-span-2 lg:col-span-4 xl:col-span-1">
            <Logo />
          </div>
          <div className="space-y-12">
            <Column group={F.portfolio} />
            <Column group={F.investors} />
          </div>
          <div className="space-y-12">
            <Column group={F.sustainability} />
            <Column group={F.news} />
          </div>
          <Column group={F.about} />
          <div>
            <h2 className={HEADING}>{LOCAL_FOOTER_COPY.connect}</h2>
            <ul className={LINKS}>
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <InertLink className={`inline-flex items-center gap-2 ${LINK}`}>
                    <SocialIcon brand={s.brand} className="text-ink" />
                    {s.label}
                  </InertLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile (311:6622): logo, then the listing in two columns 30 apart, rows 24 apart */}
        <div className="md:hidden">
          <Logo />
          <div className="mt-8 grid grid-cols-2 gap-x-[30px] gap-y-6 [&>*]:pb-4">
            <Column group={F.portfolio} />
            <Column group={F.investors} />
            <Column group={F.sustainability} />
            <Column group={F.about} />
            <Column group={F.news} />
            <ul aria-label="Legal" className="space-y-3 text-[14px] font-medium leading-5 text-muted">
              {LOCAL_FOOTER_COPY.legal.map((l) => (
                <li key={l}>
                  <InertLink className={LINK}>{l}</InertLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-5 text-sm text-muted md:mt-16 md:flex-row md:items-center md:justify-between md:pt-8">
          <p>{LOCAL_FOOTER_COPY.copyright}</p>
          <ul className="hidden gap-x-8 md:flex">
            {LOCAL_FOOTER_COPY.legal.map((l) => (
              <li key={l}>
                <InertLink className={LINK}>{l}</InertLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
