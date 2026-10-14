import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { LocalIntro } from "@/components/sections/local/LocalIntro";
import { PropertyTours } from "@/components/sections/local/PropertyTours";
import { TourPropertyCards } from "@/components/sections/local/TourPropertyCards";
import { JP_TOURS, JP_TOURS_COPY, JP_TOURS_INTRO, JP_TOURS_NEWSLETTER, JP_TOURS_PROPERTIES } from "@/data/site/local/property-tours";

export const metadata: Metadata = { title: "Property tours | ESR Japan — website prototype" };

/**
 * /jp/property-tours: Local_PropertyTours (Primary wireframes 1340:77584, mobile 1340:77585) with its clicked
 * state and annotation (pins open a card and highlight the tour in the list). Local nav: Our portfolio.
 */
export default function JapanPropertyToursPage() {
  return (
    <LocalPageShell>
      <LocalIntro variant="display" breadcrumb={JP_TOURS_INTRO.breadcrumb} title={JP_TOURS_INTRO.title} body={JP_TOURS_INTRO.body} />
      {/* "Upcoming tours" map + "All tours" list, sharing the selected pin */}
      <PropertyTours tours={JP_TOURS} copy={JP_TOURS_COPY} />
      <TourPropertyCards {...JP_TOURS_PROPERTIES} />
      {/* "Hear about the next tour": name and email only, as drawn */}
      <FormBlock
        variant="newsletter"
        bg="white"
        align="start"
        title={JP_TOURS_NEWSLETTER.title}
        body={JP_TOURS_NEWSLETTER.body}
        submitLabel={JP_TOURS_NEWSLETTER.submitLabel}
        fields={["name", "email"]}
        required={["firstName", "lastName", "email"]}
      />
    </LocalPageShell>
  );
}
