import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { EnquiryRoutes } from "@/components/sections/forms/EnquiryRoutes";
import { ContactEnquiryForm } from "@/components/sections/forms/ContactEnquiryForm";
import { OfficeLocations } from "@/components/sections/forms/OfficeLocations";
import { ContactPersonBand } from "@/components/sections/forms/ContactPersonBand";
import { ContactCtaBand } from "@/components/sections/forms/ContactCtaBand";
import { CAP_CONTACT_CTA, CONTACT_ENQUIRY_FORM, DC_CONTACT_PERSON, ENQUIRY_ROUTES, OFFICE_LOCATIONS } from "@/data/site/offices";

export const metadata: Metadata = { title: "Forms | ESR prototype" };

/** Dev label between previews. Not part of any page. */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="border-y border-line bg-white px-6 py-2 font-mono text-[12px] leading-5 text-muted md:px-10 lg:px-20">{children}</p>;
}

/** Developer gallery of the "forms" section components with real wireframe copy. Not linked from the site. */
export default function FormsGallery() {
  return (
    <PageShell>
      <h1 className="sr-only">Forms gallery</h1>

      <Label>B18 FormBlock variant=&quot;newsletter&quot; (PORT §9, PROP §11: align center by default)</Label>
      <FormBlock variant="newsletter" />

      <Label>B18 FormBlock variant=&quot;newsletter&quot; align=&quot;start&quot; (DEV §11)</Label>
      <FormBlock variant="newsletter" align="start" />

      <Label>B18 FormBlock variant=&quot;dcEnquiry&quot; (DC §11)</Label>
      <FormBlock variant="dcEnquiry" />

      <Label>B18 FormBlock variant=&quot;investorEnquiry&quot; (INV §9)</Label>
      <FormBlock variant="investorEnquiry" />

      <Label>B18 FormBlock variant=&quot;mediaEnquiry&quot; (NEWS §6, NSR)</Label>
      <FormBlock variant="mediaEnquiry" />

      <Label>B18 FormBlock variant=&quot;careers&quot; (PEOPLE §7: white band by default)</Label>
      <FormBlock variant="careers" />

      <Label>B24 ContactPersonBand (DC §10)</Label>
      <ContactPersonBand {...DC_CONTACT_PERSON} />

      <Label>B39 ContactCtaBand (CAP §8)</Label>
      <ContactCtaBand {...CAP_CONTACT_CTA} />

      <Label>B40 EnquiryRoutes (CONTACT §2: no top padding, sits under the page intro)</Label>
      <div className="pt-12 md:pt-16 lg:pt-[72px]">
        <EnquiryRoutes routes={ENQUIRY_ROUTES} />
      </div>

      <Label>B41 ContactEnquiryForm (CONTACT §3)</Label>
      <ContactEnquiryForm {...CONTACT_ENQUIRY_FORM} />

      <Label>B42 OfficeLocations (CONTACT §4)</Label>
      <OfficeLocations {...OFFICE_LOCATIONS} />
    </PageShell>
  );
}
