import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Properties | ESR Japan — website prototype" };

/** /jp/properties: Japan properties (local nav: Our portfolio, Properties). Shell page; the page body is to come. */
export default function JapanPropertiesPage() {
  return (
    <LocalPageShell>
      <PageIntro title="Properties" pb="lg" />
    </LocalPageShell>
  );
}
