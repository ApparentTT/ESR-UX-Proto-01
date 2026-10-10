import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { EnquiryRoutes } from "@/components/sections/forms/EnquiryRoutes";
import { ContactEnquiryForm } from "@/components/sections/forms/ContactEnquiryForm";
import { OfficeLocations } from "@/components/sections/forms/OfficeLocations";
import { CONTACT_ENQUIRY_FORM, ENQUIRY_ROUTES, OFFICE_LOCATIONS } from "@/data/site/offices";
import { CONTACT_INTRO } from "@/data/site/pages/contact";

export const metadata: Metadata = { title: "Contact us | ESR — website prototype" };

/**
 * /contact (CONTACT): Group_ContactUs. Header active item: none (the wireframe's About state is a
 * copy-paste artefact); the header "Contact us" button carries aria-current="page".
 */
export default function ContactPage() {
  return (
    <PageShell>
      {/* §1 display intro: Bold 48 H1 + 19px muted sub (max 760) */}
      <PageIntro variant="display" subSize={19} title={CONTACT_INTRO.title} body={CONTACT_INTRO.body} />
      {/* §2 five enquiry route cards (emails and jobs.esr.com are inert). The routes band has no top
          padding, so the hero's 48px bottom padding (32 at 390, per the responsive notes) sits here:
          the PageIntro pb steps are 40 or 56, neither of which matches. Both bands are white. */}
      <div className="bg-white pt-8 md:pt-10 lg:pt-12">
        <EnquiryRoutes routes={ENQUIRY_ROUTES} />
      </div>
      {/* §3 "Send us a message": prototype-only submit, validates Email, inline confirmation */}
      <ContactEnquiryForm {...CONTACT_ENQUIRY_FORM} id="send-us-a-message" />
      {/* §4 "Office locations": region pills filter the six drawn offices; Show all offices is inert */}
      <OfficeLocations {...OFFICE_LOCATIONS} id="office-locations" />
    </PageShell>
  );
}
