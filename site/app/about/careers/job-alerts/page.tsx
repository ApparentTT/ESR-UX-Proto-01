import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JobAlertsForm } from "@/components/sections/forms/JobAlertsForm";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { JOB_ALERTS_OPEN_ROLES } from "@/data/site/pages/job-alerts";

export const metadata: Metadata = { title: "Stay up to date on vacancies | ESR — website prototype" };

/**
 * /about/careers/job-alerts: StayUpToDate_Vacancies (Wireframes 1590:9435, mobile 1590:78286), reached from
 * "Stay up to date on vacancies" in the group and local navs. Header active item: About.
 */
export default function JobAlertsPage() {
  const { title, cta } = JOB_ALERTS_OPEN_ROLES;
  return (
    <PageShell>
      {/* Title, intro and the sign-up form side by side */}
      <JobAlertsForm id="job-alerts" />
      {/* Grey band: "Looking for open roles now?" + the external jobs board (inert) */}
      <Section
        bg="surface"
        aria-labelledby="open-roles-heading"
        className="border-y border-line py-8 md:py-7"
        containerClassName="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-8"
      >
        <h2 id="open-roles-heading" className="text-[18px] font-medium leading-[1.4] text-ink md:text-[20px]">
          {title}
        </h2>
        <TextLink href={cta.href} variant="explore" icon="open_in_new">
          {cta.label}
          <span className="sr-only"> (external site)</span>
        </TextLink>
      </Section>
    </PageShell>
  );
}
