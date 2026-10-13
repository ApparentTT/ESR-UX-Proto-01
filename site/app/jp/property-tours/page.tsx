import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Property tours | ESR Japan — website prototype" };

/** /jp/property-tours: Japan property tours (the Property tours section of the local Properties page, 1297:81059). Shell page; the page body is to come. */
export default function JapanPropertyToursPage() {
  return (
    <LocalPageShell>
      <PageIntro title="Property tours" pb="lg" />
    </LocalPageShell>
  );
}
