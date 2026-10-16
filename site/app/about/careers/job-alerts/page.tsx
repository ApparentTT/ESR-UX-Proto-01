import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { JobAlertsForm } from "@/components/sections/forms/JobAlertsForm";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { JOB_ALERTS_INTRO, JOB_ALERTS_OPEN_ROLES } from "@/data/site/pages/job-alerts";

export const metadata: Metadata = { title: "Stay up to date on vacancies | ESR — website prototype" };

/**
 * /about/careers/job-alerts: "Stay up to date on vacancies" from the group and local Our portfolio menus.
 * Not wireframed (added from review feedback). Header active item: About.
 */
export default function JobAlertsPage() {
  const { title, cta } = JOB_ALERTS_OPEN_ROLES;
  return (
    <PageShell>
      <PageIntro title={JOB_ALERTS_INTRO.title} body={JOB_ALERTS_INTRO.body} pb="lg" />
      <JobAlertsForm id="job-alerts" />
      {/* Slim band: the external jobs board (inert), as "See all open roles" on Our people */}
      <Section bg="white" aria-labelledby="open-roles-heading" className="py-8 md:py-10" containerClassName="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <h2 id="open-roles-heading" className="text-[22px] font-medium leading-[1.3] text-ink md:text-[24px]">
          {title}
        </h2>
        <Button variant="dark" href={cta.href} icon="open_in_new" iconSize={18} className="self-start pr-6 md:self-auto">
          {cta.label}
          <span className="sr-only">(external site)</span>
        </Button>
      </Section>
    </PageShell>
  );
}
