import type { Metadata } from "next";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = { title: "Japan | ESR Japan — website prototype" };

/**
 * /jp: the Japan local market homepage. Shell page; the page body is to come. The heading is the Japan
 * homepage hero as drawn (R2_Local_homepage_>10Properties 1347:52640), placeholder included.
 */
export default function JapanHomePage() {
  return (
    <LocalPageShell>
      <PageIntro title="[Japan heading] Global new economy assets, REITS and asset management" pb="lg" />
    </LocalPageShell>
  );
}
