import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalPageShell } from "@/components/layout/local/LocalPageShell";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/sections/local/LocalIntro";
import { FormBlock } from "@/components/sections/forms/FormBlock";
import { PropertyMedia } from "@/components/sections/property/PropertyMedia";
import { PropertyActions } from "@/components/sections/property/PropertyActions";
import { DownloadsMenu } from "@/components/sections/property/DownloadsMenu";
import { EnquireButton } from "@/components/sections/property/EnquireButton";
import { PropertyAccordions } from "@/components/sections/property/PropertyAccordions";
import { AvailableSpace } from "@/components/sections/property/AvailableSpace";
import { LocationMap } from "@/components/sections/property/LocationMap";
import { RelatedProperties } from "@/components/sections/property/RelatedProperties";
import { StickyEnquire } from "@/components/sections/property/StickyEnquire";
import { ENQUIRY_ID } from "@/components/sections/property/enquire";
import { DistanceStats, MarketChips, PropertyContacts, PropertyTitle, SharingSpace } from "@/components/sections/property/PropertyBlocks";
import {
  JP_PROPERTIES,
  JP_PROPERTY_DETAIL as D,
  PROPERTY_ACCORDIONS as ACC,
  jpPropertyBySlug,
  propertyAbout,
  propertyFeatures,
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
 * 1273:90949 (390). The drawn page is Higashi-Ogishima Distribution Centre 2; the others share its wireframe content
 * with their own name, address and TBC figures. Local Japan shell; local nav active item: Our portfolio.
 * Not drawn, added at the client's request: Share, Export page as PDF (print stylesheet in app/globals.css),
 * Downloads (in place of the two drawn download buttons) and the sticky "Enquire now" bar.
 */
export default async function JapanPropertyDetailPage({ params }: Params) {
  const { slug } = await params;
  const p = jpPropertyBySlug(slug);
  if (!p) notFound();

  const features = propertyFeatures(p);

  return (
    <LocalPageShell>
      <div data-property-detail>
        {/* Breadcrumb bar (1138:10621); not drawn at 390 */}
        <Container className="hidden pb-1 pt-4 md:block">
          <Breadcrumb items={[...D.breadcrumb, { label: p.name, href: null }]} />
        </Container>

        {/* Media column beside the property details (1138:10623) */}
        <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-2" data-print-flow>
          <div className="px-6 pt-6 md:px-10 lg:px-[35.5px] lg:pb-12 lg:pt-12" data-print-hide>
            <PropertyMedia items={D.media} name={p.name} />
          </div>

          <div className="flex min-w-0 flex-col gap-10 px-6 pb-12 pt-10 md:px-10 lg:gap-12 lg:pb-16 lg:pl-8 lg:pr-10 lg:pt-12 xl:pr-[30px]">
            <div className="flex flex-col gap-6">
              <PropertyTitle name={p.name} address={p.address} tags={propertyTags(p)} />
              <PropertyActions name={p.name} address={p.address} share={D.share} exportLabel={D.actions.exportPdf} />
            </div>
            <DistanceStats stats={D.distances} />

            <PropertyContacts title={D.contactTitle} contacts={D.contacts}>
              <div className="py-4">
                <EnquireButton label={D.contactCta} />
              </div>
            </PropertyContacts>

            {/* About (1138:10701) */}
            <section aria-labelledby="property-about" className="flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                <h2 id="property-about" className="text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-ink md:text-[34px] lg:text-[40px]">
                  {D.aboutTitle}
                </h2>
                <p className="text-[16px] leading-6 text-body lg:text-[18px] lg:leading-7">{propertyAbout(p)}</p>
                <DownloadsMenu label={D.actions.downloads} files={D.actions.files} property={p.name} />
              </div>
              <PropertyAccordions
                items={[
                  { label: ACC.amenities.label, content: <p>{ACC.amenities.body}</p> },
                  { label: ACC.sustainability.label, content: <p>{ACC.sustainability.body}</p> },
                  {
                    label: ACC.features.label,
                    content: (
                      <dl className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2">
                        {features.map((f) => (
                          <div key={f.label} className="contents">
                            <dt className="text-muted">{f.label}</dt>
                            <dd className="text-ink">{f.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ),
                  },
                ]}
              />
            </section>

            <SharingSpace title={D.sharingTitle} count={D.sharingLogos} />
            <AvailableSpace copy={D.space} property={p.name} />
          </div>
        </div>

        <StickyEnquire name={p.name} label={D.sticky.cta} />

        {/* LocationDeepDive (1478:49678) */}
        <LocationMap map={D.map} name={p.name} />

        {/* Enquiry form the designer added above Related properties (1469:46857) */}
        <div data-print-hide>
          <FormBlock
            variant="dcEnquiry"
            id={ENQUIRY_ID}
            title={D.enquiry.title}
            body={D.enquiry.body}
            submitLabel={D.enquiry.submitLabel}
            success={D.enquiry.success}
          />
        </div>

        <RelatedProperties title={D.relatedTitle} cards={relatedProperties(p)} />
        <MarketChips title={D.marketsTitle} markets={D.markets} />
      </div>
    </LocalPageShell>
  );
}
