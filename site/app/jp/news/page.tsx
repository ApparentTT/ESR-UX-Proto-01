import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "News and insights | ESR Japan — website prototype" };

/** /jp/news: Japan news (local nav: News and insights, All stories). Shell page; the page body is to come. */
export default function JapanNewsPage() {
  return (
    <LocalPageShell>
      <PageIntro title="News and insights" pb="lg" />
    </LocalPageShell>
  );
}
