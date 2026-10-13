import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Our portfolio | ESR Japan — website prototype" };

/** /jp/portfolio: Japan portfolio overview (local nav: Our portfolio). Shell page; the page body is to come. */
export default function JapanPortfolioPage() {
  return (
    <LocalPageShell>
      <PageIntro title="Our portfolio" pb="lg" />
    </LocalPageShell>
  );
}
