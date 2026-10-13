import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageIntro } from "@/components/sections/PageIntro";
import { SiteSearch } from "./SiteSearch";
import { SITE_SEARCH_COPY } from "./copy";

export const metadata: Metadata = { title: "Search results | ESR — website prototype" };

/**
 * /search: whole-site search results (the header search lands here). Laid out on the News search results
 * wireframe (Primary wireframes 1301:86500 results, 1064:46008 no results): the search field over type
 * filters with counts on white, then the results head, the result rows and "Load more" on grey.
 * Reads ?q= and ?type= on the client. Not in a header section, so no header item is active.
 */
export default function SearchPage() {
  return (
    <PageShell>
      <PageIntro title={SITE_SEARCH_COPY.title} />
      <SiteSearch />
    </PageShell>
  );
}
