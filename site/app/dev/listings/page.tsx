import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CaseStudyListing } from "@/components/sections/listings/CaseStudyListing";
import { FundList } from "@/components/sections/listings/FundList";
import { Accordion } from "@/components/sections/listings/Accordion";
import { DocumentList } from "@/components/sections/listings/DocumentList";
import { SCS_LISTING, CAP_LISTING } from "@/data/site/caseStudies";
import { FUND_LIST } from "@/data/site/funds";
import { CGOV_DOCUMENTS, SGOV_POLICIES, SGOV_PAST_DISCLOSURES, PORTFOLIO_FAQ } from "@/data/site/documents";

export const metadata: Metadata = { title: "Listings | ESR prototype" };

/** Dev label between previews. Not part of any page. */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="border-y border-line bg-white px-6 py-2 font-mono text-[12px] leading-5 text-muted md:px-10 lg:px-20">{children}</p>;
}

/** Developer gallery of the "listings" section components with real wireframe copy. Not linked from the site. */
export default function ListingsGallery() {
  return (
    <PageShell>
      <div className="bg-white px-6 pb-4 pt-8 md:px-10 lg:px-20">
        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">Listings gallery</h1>
        <p className="mt-1 text-[14px] leading-5 text-muted">B32 CaseStudyListing (caseStudies, capCaseStudies), B30 FundList, B17 Accordion, B36 DocumentList.</p>
      </div>

      <Label>B32 CaseStudyListing variant=&quot;caseStudies&quot; (SCS §2). Country filter, count, Load more</Label>
      <CaseStudyListing variant="caseStudies" {...SCS_LISTING} />

      <Label>B32 CaseStudyListing variant=&quot;capCaseStudies&quot; (CAP §2–3). Theme / Market / Asset type, chips, Clear all, Sort</Label>
      <CaseStudyListing variant="capCaseStudies" {...CAP_LISTING} />

      <Label>B30 FundList (INV §6). Strategy / Market / Sector / Status filter the table in place</Label>
      <FundList {...FUND_LIST} />

      <Label>B17 Accordion, single-open (PROP §10 / DEV §10 FAQ)</Label>
      <Accordion {...PORTFOLIO_FAQ} />

      <Label>B17 Accordion, multiple (SGOV §6 &quot;Past disclosures by year&quot;, 2025 open)</Label>
      <Accordion {...SGOV_PAST_DISCLOSURES} multiple />

      <Label>B36 DocumentList variant=&quot;dottedLeader&quot; (SGOV §7)</Label>
      <DocumentList variant="dottedLeader" {...SGOV_POLICIES} />

      <Label>B36 DocumentList variant=&quot;downloadRows&quot; (CGOV §3)</Label>
      <DocumentList variant="downloadRows" {...CGOV_DOCUMENTS} />
    </PageShell>
  );
}
