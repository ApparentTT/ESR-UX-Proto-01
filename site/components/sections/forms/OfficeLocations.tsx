"use client";

import { useId, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FilterPills } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { T, PAD } from "@/components/ui/type";

export type OfficeRegionId = "all" | "asia" | "greater-china" | "oceania" | "southeast-asia";

export type Office = {
  country: string;
  city: string;
  address: string;
  phone: string;
  region: Exclude<OfficeRegionId, "all">;
  /** Optional tel: link; default null (inert) */
  phoneHref?: string | null;
  /** External maps link; default null (inert) */
  directionsHref?: string | null;
};

export type OfficeLocationsProps = {
  title: string;
  sub: string;
  regions: { id: OfficeRegionId; label: string }[];
  offices: Office[];
  directionsLabel: string;
  showAllLabel: string;
  /** Shown when a region has no drawn office (Oceania) */
  emptyMessage: string;
  /** "Show all offices" target; null = inert (no extra office data exists) */
  showAllHref?: string | null;
  defaultRegion?: OfficeRegionId;
  headingLevel?: "h2" | "h3";
  id?: string;
};

/**
 * B42 OfficeLocations (CONTACT §4). White band, 80/80, a 28px stack: Bold 36 head + 17/1.5
 * muted sub, single-select region pills that filter the cards in place, the office card grid
 * (fluid columns, 20px gap, top-aligned, no stretch: 1 at 390, 2 at 768, 3 at 1024+), then the
 * outline "Show all offices" button (inert).
 */
export function OfficeLocations({
  title,
  sub,
  regions,
  offices,
  directionsLabel,
  showAllLabel,
  emptyMessage,
  showAllHref = null,
  defaultRegion = "all",
  headingLevel: H = "h2",
  id,
}: OfficeLocationsProps) {
  const headingId = useId();
  const [region, setRegion] = useState<OfficeRegionId>(defaultRegion);
  const visible = region === "all" ? offices : offices.filter((o) => o.region === region);
  const regionLabel = regions.find((r) => r.id === region)?.label ?? "";
  const CityHeading = H === "h2" ? "h3" : "h4";

  return (
    <Section id={id} bg="white" aria-labelledby={headingId} className={PAD.data} containerClassName="flex flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <H id={headingId} className={`${T.h36b} lg:leading-[1.18]`}>
          {title}
        </H>
        <p className="text-[16px] leading-[1.5] text-muted lg:text-[17px]">{sub}</p>
      </div>

      <FilterPills options={regions} value={region} onChange={setRegion} label="Filter offices by region" />

      {/* Announces the result of a filter change */}
      <p className="sr-only" aria-live="polite">
        {`${regionLabel}: ${visible.length} ${visible.length === 1 ? "office" : "offices"}`}
      </p>

      {visible.length > 0 ? (
        <ul className="grid items-start gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {visible.map((o) => (
            <li key={o.city} className="anim-fade flex flex-col gap-2 rounded-card border border-line bg-white p-5 md:p-[26px]">
              <p className="text-[12px] leading-[1.5] text-muted">{o.country}</p>
              <CityHeading className="text-[18px] font-medium leading-[1.5] text-ink lg:text-[20px]">{o.city}</CityHeading>
              <address className="text-[14px] not-italic leading-[1.5] text-muted">{o.address}</address>
              <hr className="border-line" />
              <div className="flex flex-col items-start gap-2">
                <TextLink href={o.phoneHref ?? null} variant="external" icon="call" iconBefore size={14}>
                  {o.phone}
                </TextLink>
                <TextLink
                  href={o.directionsHref ?? null}
                  variant="external"
                  icon="location_on"
                  iconBefore
                  size={14}
                  aria-label={`${directionsLabel}, ${o.city}`}
                >
                  {directionsLabel}
                </TextLink>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-dashed border-line px-5 py-8 text-[15px] leading-[1.5] text-muted md:px-[26px]">{emptyMessage}</p>
      )}

      <div className="flex">
        <Button variant="outlineDark" href={showAllHref}>
          {showAllLabel}
        </Button>
      </div>
    </Section>
  );
}
