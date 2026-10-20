import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { ContactEnquiryForm } from "@/components/sections/forms/ContactEnquiryForm";
import { PropertyMedia } from "@/components/sections/property/PropertyMedia";
import { ShareMenu } from "@/components/sections/property/ShareMenu";
import { DownloadButtons } from "@/components/sections/property/Downloads";
import { SavePdfButton } from "@/components/sections/property/SavePdfButton";
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
 * 1273:90949 (390), with the photo gallery (grid 1507:59463 / 1507:59568, lightbox 1507:59500 / 1507:59592). The
 * drawn page is Higashi-Ogishima Distribution Centre 2; the others share its wireframe content with their own name,
 * address and TBC figures. Local Japan shell; local nav active item: Our portfolio. Not drawn, added at the
 * client's request: the Share menu and the sticky bar. Presentation feedback: Save as PDF beside Share (prints;
 * see the "Print" block in app/globals.css), the three downloads stepped out after Enquire now, and the sticky bar
 * stays to the bottom of the page. data-print="hide" marks what the printout leaves out.
 */
export default async function JapanPropertyDetailPage({ params }: Params) {
  const { slug } = await params;
  const p = jpPropertyBySlug(slug);
  if (!p) notFound();
  const shareText = `${p.name}, ${p.address}`;

  return (
    <LocalPageShell>
      <PropertyIntro
        crumbs={[...D.breadcrumb, { label: p.name, href: null }]}
        tags={propertyTags(p)}
        name={p.name}
        address={p.address}
        actions={
          <div data-print="hide" className="flex shrink-0 flex-wrap gap-2 self-start md:self-auto">
            <ShareMenu title={`${p.name} | ESR Japan`} text={shareText} copy={D.share} panelClassName="left-0 md:left-auto md:right-0" />
            <SavePdfButton label={D.savePdf} />
          </div>
        }
      />

      <PropertyMedia gallery={D.gallery} name={p.name} />

      {/* "Overview" (1507:52125): key distances, then About with Enquire now and the three downloads beside the key facts */}
      <section aria-labelledby="property-about" className={`${GUTTER} flex flex-col pb-14 pt-2 md:gap-7 md:pb-16 lg:pb-[72px]`}>
        <KeyDistances stats={D.distances} />
        <div data-print="stack" className="flex flex-col gap-5 pt-[72px] md:pt-4 lg:flex-row lg:items-start lg:gap-16 lg:pt-0">
          <div className="flex min-w-0 flex-1 flex-col gap-5 lg:gap-3">
            <h2 id="property-about" className="text-[28px] font-bold leading-[1.18] text-ink md:text-[30px] lg:text-[32px] lg:leading-[1.15]">
              {D.aboutTitle}
            </h2>
            <p className="text-[15px] leading-[1.5] text-muted lg:text-[17px]">{propertyAbout(p)}</p>
            {/* CTA row: one row at 1440; Enquire now above the downloads at 768 and 1280; all stacked at 390 and 1024 (narrow column) */}
            <div data-print="hide" className="flex flex-col gap-3 md:items-start lg:items-stretch lg:pt-2 xl:items-start min-[1440px]:flex-row">
              <EnquireButton label={D.enquireNow} />
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap lg:flex-col xl:flex-row">
                <DownloadButtons files={D.downloads.files} property={p.name} />
              </div>
            </div>
          </div>
          <KeyFacts facts={propertyKeyFacts(p)} label={`Key facts: ${p.name}`} />
        </div>
      </section>

      <FeaturesAndAmenities copy={D.features} />
      <AvailableSpace copy={D.space} property={p.name} />
      <StickyEnquire
        name={p.name}
        shareText={shareText}
        copy={{ cta: D.sticky.cta, savePdf: D.savePdf, downloads: D.downloads, share: D.share }}
      />
      <LocationMap map={D.map} name={p.name} />

      <div data-print="hide">
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
      </div>

      <RelatedProperties title={D.relatedTitle} cards={relatedProperties(p)} />
      <MarketChips title={D.marketsTitle} markets={D.markets} />
    </LocalPageShell>
  );
}
