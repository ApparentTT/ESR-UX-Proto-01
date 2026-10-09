"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Section } from "@/components/ui/Section";
import { T, PAD } from "@/components/ui/type";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { Tag, AppliedChip, FilterPills } from "@/components/ui/Tag";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { TextField, SelectField, TextAreaField, CheckboxField } from "@/components/ui/FormControls";
import { useCarousel, ChevronArrow, LineArrow, CircleArrow, PagerDots, PagerBars, PagerFraction } from "@/components/ui/Carousel";
import { Footnotes, ProgressBar, Legend } from "@/components/ui/DataBits";
import { SearchField } from "@/components/ui/SearchField";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { PageIntro } from "@/components/sections/PageIntro";
import { SectionHeading } from "@/components/sections/SectionHeading";

/** Developer gallery of the shared primitives. Not linked from the site. */
export default function PrimitivesGallery() {
  const [market, setMarket] = useState<string | null>(null);
  const [sort, setSort] = useState<string | null>("recent");
  const [region, setRegion] = useState<"all" | "asia" | "oceania">("all");
  const [q, setQ] = useState("");
  const car = useCarousel(3);
  return (
    <PageShell>
      <PageIntro title="Primitives" body="Shared building blocks for the full-site prototype." />
      <SectionHeading title="Section heading" sub="Quis nis ullarper vestibulum eros." link={{ label: "Explore the latest", href: "/news" }} />
      <Section className={PAD.block} containerClassName="space-y-10">
        <div className="space-y-3">
          <h2 className={T.h40m}>h40m heading</h2>
          <h2 className={T.h40b}>h40b heading</h2>
          <p className={T.eyebrow24}>Eyebrow 24</p>
          <p className={T.bodyLg}>Body large 18/28 in body grey.</p>
          <p className={T.sub18}>Sub 18 muted.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/investors">Learn more</Button>
          <Button href={null} variant="secondary">Explore our capabilities</Button>
          <Button variant="dark" icon="arrow_forward">Go to Japan news</Button>
          <Button variant="outlineDark">Load more articles</Button>
          <Button variant="pill">Contact us</Button>
          <Button href={null} variant="pillOutlineLg" icon="arrow_outward" iconSize={24}>Explore the market</Button>
          <Button href="/portfolio" variant="heroCta">Explore our portfolio</Button>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <TextLink href="/news" variant="section">Explore the latest</TextLink>
          <TextLink href={null} variant="card">Learn more</TextLink>
          <TextLink href={null}>Read the article</TextLink>
          <TextLink href={null} variant="underline" size={15}>Download the fund factsheet</TextLink>
          <TextLink href={null} variant="external" size={14} iconBefore>LinkedIn profile</TextLink>
          <TextLink href={null} variant="explore">Explore</TextLink>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Tag>Oceania</Tag>
          <Tag size="md">Industrial and logistics</Tag>
          <Tag variant="filled">Press release</Tag>
          <AppliedChip label="Press release" onRemove={() => {}} />
          <AppliedChip label="Japan" shape="pill" onRemove={() => {}} />
        </div>
        <FilterPills label="Region" value={region} onChange={setRegion} options={[{ id: "all", label: "All" }, { id: "asia", label: "Asia" }, { id: "oceania", label: "Oceania" }]} />
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown label="Market" value={market} onChange={setMarket} allLabel="All markets" options={[{ id: "jp", label: "Japan" }, { id: "au", label: "Australia and New Zealand" }]} />
          <FilterDropdown label="Sort" sortLabel value={sort} onChange={setSort} options={[{ id: "recent", label: "Newest first" }, { id: "old", label: "Oldest first" }]} />
        </div>
        <SearchField value={q} onChange={setQ} onSubmit={() => {}} />
        <div className="grid max-w-[638px] gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="First name" placeholder="Enter your first name" />
            <TextField label="Last name" placeholder="Enter your last name" />
          </div>
          <SelectField label="Country of interest" placeholder="Select country" options={["Japan", "China"]} />
          <TextAreaField label="Message" placeholder="Enter your message" />
          <CheckboxField label="By checking this box, I agree to receive marketing communications." />
          <TextField family="contact" label="Company" />
          <SelectField family="contact" label="Enquiry type" placeholder="Select an enquiry type" options={["Leasing"]} />
          <CheckboxField family="contact" label="I agree to the privacy policy" />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <ChevronArrow dir="prev" onClick={car.prev} disabled={!car.canPrev} />
          <ChevronArrow dir="next" onClick={car.next} disabled={!car.canNext} />
          <ChevronArrow dir="next" size="sm" onClick={car.next} />
          <LineArrow dir="prev" onClick={car.prev} />
          <CircleArrow dir="prev" onClick={car.prev} disabled={!car.canPrev} />
          <CircleArrow dir="next" onClick={car.next} disabled={!car.canNext} />
          <PagerDots count={3} index={car.index} onGo={car.go} />
          <div className="bg-placeholder p-2"><PagerBars count={3} index={car.index} onGo={car.go} /></div>
          <PagerFraction index={car.index} count={11} />
        </div>
        <div className="max-w-xl space-y-4">
          <ProgressBar segments={[40, 25]} label="Secured 40%, under development 25%" />
          <Legend items={[{ label: "Secured", tone: "dark" }, { label: "Under development", tone: "mid" }, { label: "Future pipeline", tone: "track" }]} />
          <Footnotes items={["Total AUM is comprised of Third-Party AUM plus Balance Sheet Real Estate.", "Third-party AUM excludes AUM from Associates."]} />
        </div>
        <ImagePlaceholder className="aspect-[5/3] w-full max-w-[638px] rounded-control" />
      </Section>
    </PageShell>
  );
}
