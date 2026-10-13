import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "About us | ESR Japan — website prototype" };

/** /jp/about: Japan about (local nav: About, About us). Shell page; the page body is to come. */
export default function JapanAboutPage() {
  return (
    <LocalPageShell>
      <PageIntro title="About us" pb="lg" />
    </LocalPageShell>
  );
}
