import { Suspense } from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SearchExperience } from "@/components/search/SearchExperience";

export const metadata: Metadata = {
  title: "Property search | ESR — website prototype",
};

export default function SearchPage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="min-h-[60vh] bg-surface" />}>
        <SearchExperience />
      </Suspense>
    </PageShell>
  );
}
