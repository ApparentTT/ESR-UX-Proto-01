import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { FirstVisit } from "@/components/firstvisit/FirstVisit";

export const metadata: Metadata = {
  title: "Find properties | ESR Japan — search prototype",
};

export default function FirstVisitPage() {
  return (
    <PageShell>
      <FirstVisit />
    </PageShell>
  );
}
