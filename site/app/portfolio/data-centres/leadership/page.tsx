import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { LeaderList } from "@/components/sections/blocks/LeaderList";
import { ContactCtaBand } from "@/components/sections/forms/ContactCtaBand";
import { DC_LEAD_CONTACT_CTA, DC_LEAD_INTRO, DC_LEADERS } from "@/data/site/pages/data-centres-leadership";

export const metadata: Metadata = { title: "Data centre leadership | ESR — website prototype" };

/** /portfolio/data-centres/leadership: DataCentre_Leadership. Header active item: Our portfolio. */
export default function DataCentreLeadershipPage() {
  return (
    <PageShell>
      {/* §1 display intro, as on Our leadership */}
      <PageIntro variant="display" subSize={20} pb="md" title={DC_LEAD_INTRO.title} body={DC_LEAD_INTRO.body} />
      {/* §2 the data centre leaders (Our leadership card pattern; LinkedIn is inert) */}
      <LeaderList leaders={DC_LEADERS} />
      {/* §3 contact band */}
      <ContactCtaBand {...DC_LEAD_CONTACT_CTA} />
    </PageShell>
  );
}
