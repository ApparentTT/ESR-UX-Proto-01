import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Our leadership | ESR Japan — website prototype" };

/** /jp/leadership: Japan leadership (local nav: About, Our leadership). Shell page; the page body is to come. */
export default function JapanLeadershipPage() {
  return (
    <LocalPageShell>
      <PageIntro title="Our leadership" pb="lg" />
    </LocalPageShell>
  );
}
