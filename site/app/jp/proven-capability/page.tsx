import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Proven capability | ESR Japan — website prototype" };

/** /jp/proven-capability: Japan proven capability (local nav: About, Proven capability). Shell page; the page body is to come. */
export default function JapanProvenCapabilityPage() {
  return (
    <LocalPageShell>
      <PageIntro title="Proven capability" pb="lg" />
    </LocalPageShell>
  );
}
