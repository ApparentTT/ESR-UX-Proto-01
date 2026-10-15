import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { ContactEnquiryForm } from "@/components/sections/forms/ContactEnquiryForm";
import { PropertyMedia } from "@/components/sections/property/PropertyMedia";
import { ShareMenu } from "@/components/sections/property/ShareMenu";
import { DownloadsMenu } from "@/components/sections/property/DownloadsMenu";
import { EnquireButton } from "@/components/sections/property/EnquireButton";
import { AvailableSpace } from "@/components/sections/property/AvailableSpace";
import { LocationMap } from "@/components/sections/property/LocationMap";
import { RelatedProperties } from "@/components/sections/property/RelatedProperties";
import { StickyEnquire } from "@/components/sections/property/StickyEnquire";
import { ENQUIRY_ID } from "@/components/sections/property/enquire";
import {
  EnquiryContacts,
  FeaturesAndAmenities,
  GUTTER,
  KeyDistances,
  KeyFacts,
  MarketChips,
  PropertyIntro,
} from "@/components/sections/property/PropertyBlocks";
import {
  JP_PROPERTIES,
  JP_PROPERTY_DETAIL as D,
  jpPropertyBySlug,
  propertyAbout,
  propertyKeyFacts,
  propertyTags,
  relatedProperties,
} from "@/data/site/local/property-detail";

type Params = { params: Promise<{ slug: string }> };

/** One static page per Japan property in data/site/local/property-detail.ts; any other slug is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return JP_PROPERTIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = jpPropertyBySlug(slug);
  return { title: `${p?.name ?? "Property"} | ESR Japan — website prototype` };
}

/**
 * /jp/properties/[slug]: Japan property detail, Figma "Property detail " 1273:90948 (1440) and "Property detail  mob"
 * 1273:90949 (390), with the Downloads menu (1507:59421) and the photo gallery (grid 1507:59463 / 1507:59568,
 * lightbox 1507:59500 / 1507:59592). The drawn page is Higashi-Ogishima Distribution Centre 2; the others share its
 * wireframe content with their own name, address and TBC figures. Local Japan shell; local nav active item:
 * Our portfolio. Not drawn, added at the client's request: the Share menu and the sticky "Enquire now" bar.
 */
export default async function JapanPropertyDetailPage({ params }: Params) {
  const { slug } = await params;
  const p = jpPropertyBySlug(slug);
  if (!p) notFound();

  return (
    <LocalPageShell>
      <PropertyIntro
        crumbs={[...D.breadcrumb, { label: p.name, href: null }]}
        tags={propertyTags(p)}
        name={p.name}
        address={p.address}
        actions={<ShareMenu title={`${p.name} | ESR Japan`} text={`${p.name}, ${p.address}`} copy={D.share} panelClassName="left-0 md:left-auto md:right-0" />}
      />

      <PropertyMedia gallery={D.gallery} name={p.name} />

      {/* "Overview" (1507:52125): key distances, then About with Downloads / Enquire now beside the key facts */}
      <section aria-labelledby="property-about" className={`${GUTTER} flex flex-col pb-14 pt-2 md:gap-7 md:pb-16 lg:pb-[72px]`}>
        <KeyDistances stats={D.distances} />
        <div className="flex flex-col gap-5 pt-[72px] md:pt-4 lg:flex-row lg:items-start lg:gap-16 lg:pt-0">
          <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-3">
            <h2 id="property-about" className="text-[28px] font-bold leading-[1.18] text-ink md:text-[30px] lg:text-[32px] lg:leading-[1.15]">
              {D.aboutTitle}
            </h2>
            <p className="text-[15px] leading-[1.5] text-muted lg:text-[17px]">{propertyAbout(p)}</p>
            <div className="flex flex-col gap-3 md:flex-row md:items-start lg:pt-2">
              <DownloadsMenu label={D.downloads.label} groups={D.downloads.groups} all={D.downloads.all} property={p.name} />
              <EnquireButton label={D.enquireNow} />
            </div>
          </div>
          <KeyFacts facts={propertyKeyFacts(p)} label={`Key facts: ${p.name}`} />
        </div>
      </section>

      <FeaturesAndAmenities copy={D.features} />
      <AvailableSpace copy={D.space} property={p.name} />
      <StickyEnquire name={p.name} label={D.sticky.cta} />
      <LocationMap map={D.map} name={p.name} />

      <ContactEnquiryForm
        id={ENQUIRY_ID}
        title={D.enquiry.title}
        body={D.enquiry.body}
        company={false}
        phone
        optIn={D.enquiry.optIn}
        submitLabel={D.enquiry.submitLabel}
        success={D.enquiry.success}
        aside={<EnquiryContacts contacts={D.enquiry.contacts} />}
        padClassName="py-14 lg:py-[72px]"
        gutterClassName={GUTTER}
      />

      <RelatedProperties title={D.relatedTitle} cards={relatedProperties(p)} />
      <MarketChips title={D.marketsTitle} markets={D.markets} />
    </LocalPageShell>
  );
}
