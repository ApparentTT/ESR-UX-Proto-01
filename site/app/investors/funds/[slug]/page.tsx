import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { BentoAccordion } from "@/components/sections/carousels/BentoAccordion";
import { ContactEnquiryForm } from "@/components/sections/forms/ContactEnquiryForm";
import { FUND_DETAIL, FUND_ENQUIRY_FORM, FUND_PAGES } from "@/data/site/funds";
import { FUND_EXPLORE_PORTFOLIO } from "@/data/site/bentoAccordion";

type Params = { params: Promise<{ slug: string }> };

/** One static page per flagship fund; any other slug is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return FUND_PAGES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const fund = FUND_PAGES.find((f) => f.slug === slug);
  return { title: `${fund?.name ?? "Fund"} | ESR — website prototype` };
}

/**
 * /investors/funds/[slug]: Figma "Fund Detail" (1289:101635 desktop, 1289:101636 mobile). Placeholder wireframe
 * content for every fund; only the name changes. Header active item: Investor.
 */
export default async function FundDetailPage({ params }: Params) {
  const { slug } = await params;
  const fund = FUND_PAGES.find((f) => f.slug === slug);
  if (!fund) notFound();
  const d = FUND_DETAIL;
  return (
    <PageShell>
      {/* FundOverview: tags, name + mandate, image 560 x 340 (342 x 220 on mobile) */}
      <Section className="py-12 md:py-16 lg:py-[72px]" containerClassName="flex flex-col gap-7 lg:gap-10">
        <ul role="list" aria-label="Fund details" className="flex flex-wrap gap-2">
          {d.tags.map((t) => (
            <li key={t} className="rounded-full bg-surface px-3 py-[7px] text-[13px] font-medium leading-[1.48] text-muted-surface">
              {t}
            </li>
          ))}
        </ul>
        <div className="grid gap-6 lg:grid-cols-[682fr_560fr] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] font-bold leading-[1.18] text-ink md:text-[38px] lg:text-[44px]">{fund.name}</h1>
            <p className="text-[15px] leading-[1.48] text-muted md:text-[17px] lg:text-[18px]">{d.mandate}</p>
          </div>
          <ImagePlaceholder className="h-[220px] w-full rounded-card md:h-[300px] lg:h-[340px]" iconSize={40} />
        </div>
      </Section>

      {/* KeyStats: four figures in a row (2 x 2 at 768); label / value rows with dividers at 390 */}
      <Section bg="surface" aria-labelledby="key-stats" className="py-12 md:py-16 lg:py-[72px]" containerClassName="flex flex-col gap-5 md:gap-7">
        <h2 id="key-stats" className="text-[28px] font-bold leading-[1.18] text-ink md:text-[18px]">
          {d.statsTitle}
        </h2>
        <dl className="flex flex-col md:grid md:grid-cols-2 md:gap-y-8 lg:grid-cols-4">
          {d.stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 border-line py-4 not-last:border-b md:flex-col-reverse md:items-start md:gap-1.5 md:py-0 md:not-last:border-b-0"
            >
              <dt className="min-w-0 flex-1 text-[15px] leading-[1.48] text-muted-surface md:flex-none md:text-[14px]">{s.label}</dt>
              <dd className="whitespace-nowrap text-[24px] font-bold leading-[1.48] text-ink md:text-[40px] md:leading-[1.18]">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[12px] leading-[1.48] text-muted-surface md:text-[13px]">{d.statsNote}</p>
      </Section>

      {/* "Our asset classes" bento */}
      <BentoAccordion {...FUND_EXPLORE_PORTFOLIO} />

      {/* InvestorEnquiryForm */}
      <ContactEnquiryForm {...FUND_ENQUIRY_FORM} id="investor-enquiry" />
    </PageShell>
  );
}
