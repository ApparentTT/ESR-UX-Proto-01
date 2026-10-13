import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Developments | ESR Japan — website prototype" };

/** /jp/developments: Japan developments (local nav: Our portfolio, Developments). Shell page; the page body is to come. */
export default function JapanDevelopmentsPage() {
  return (
    <LocalPageShell>
      <PageIntro title="Developments" pb="lg" />
    </LocalPageShell>
  );
}
