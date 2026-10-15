import { Breadcrumb, type Crumb } from "@/components/sections/local/LocalIntro";
import { Icon } from "@/components/ui/Icon";
import { SmartLink } from "@/components/ui/SmartLink";
import type { DistanceStat, FeatureCard, JP_PROPERTY_DETAIL, PropertyContact } from "@/data/site/local/property-detail";
import { PropertyAccordions } from "./PropertyAccordions";

/**
 * Static parts of the Japan property detail page (Figma 1273:90948 desktop, 1273:90949 mobile). Server components;
 * the interactive parts (media and gallery, share, downloads, accordions, table, map, carousel, sticky bar) are
 * their own client components in this folder.
 */

/** The page's content column: 67px sides at 1440 as drawn (40 at 768, 24 at 390) */
export const GUTTER = "mx-auto w-full max-w-(--page-max) px-6 md:px-10 lg:px-[67px]";

/** Section headings (Features and amenities, Available space, Related properties): Bold 36/1.15, 28/1.18 at 390 */
export const SECTION_H2 = "text-[28px] font-bold leading-[1.18] text-ink md:text-[32px] lg:text-[36px] lg:leading-[1.15]";

/**
 * "DetailIntro" (1507:52095): breadcrumb, outline tag pills (Medium 13), Bold 52/1.15 name and the muted 17
 * address with a location pin, Share at the bottom right. 390 (1507:58976): Bold 34/1.18 name, 15 address,
 * tags wrap and Share sits under the address. The breadcrumb is drawn at 390 too.
 */
export function PropertyIntro({
  crumbs,
  tags,
  name,
  address,
  actions,
}: {
  crumbs: Crumb[];
  tags: string[];
  name: string;
  address: string;
  actions: React.ReactNode;
}) {
  return (
    <div className={`${GUTTER} flex flex-col gap-3 pb-6 pt-9 md:gap-3.5 md:pb-7 lg:pt-12`}>
      <Breadcrumb items={crumbs} />
      <ul aria-label="Property details" className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t} className="rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium leading-[1.5] text-ink">
            {t}
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:gap-2.5">
          <h1 className="text-[34px] font-bold leading-[1.18] text-ink md:text-[42px] lg:text-[52px] lg:leading-[1.15]">{name}</h1>
          <p className="flex items-start gap-2 text-[15px] leading-[1.5] text-muted md:items-center lg:text-[17px]">
            <Icon name="location_on" size={20} className="mt-px md:mt-0" />
            <span className="min-w-0 flex-1">{address}</span>
          </p>
        </div>
        {actions}
      </div>
    </div>
  );
}

/**
 * Key distances (1507:52126): four columns, Bold 30/1.15 value over a muted 14 label, 24px padding (the first
 * column flush left, as drawn). 390 (1507:59000): label left, Bold 18 value right, line rules between rows.
 */
export function KeyDistances({ stats }: { stats: DistanceStat[] }) {
  return (
    <dl className="flex flex-col md:grid md:grid-cols-4 md:gap-5">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex items-center gap-3 py-3.5 md:flex-col-reverse md:items-start md:justify-end md:gap-1.5 md:py-6 md:pr-6 ${
            i > 0 ? "border-t border-line md:border-t-0 md:pl-6" : ""
          }`}
        >
          <dt className="min-w-0 flex-1 text-[15px] leading-[1.5] text-muted md:flex-none md:text-[14px]">{s.label}</dt>
          <dd className="whitespace-nowrap text-[18px] font-bold leading-[1.5] text-ink md:text-[26px] md:leading-[1.15] lg:text-[30px]">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Key facts beside About (1507:52151): muted 14 label left, Medium 15 value right, 14px padding, line rules */
export function KeyFacts({ facts, label }: { facts: { label: string; value: string }[]; label: string }) {
  return (
    <dl aria-label={label} className="flex w-full flex-col lg:w-[440px] lg:shrink-0">
      {facts.map((f, i) => (
        <div key={f.label} className={`flex items-center gap-3 py-3.5 leading-[1.5] ${i > 0 ? "border-t border-line" : ""}`}>
          <dt className="min-w-0 flex-1 text-[14px] text-muted">{f.label}</dt>
          <dd className="text-right text-[15px] font-medium text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Contact cards beside the enquiry form (1507:52338): white, radius 12, 20/18 padding (18/16 at 390), a 52px
 * (48) grey circle, Medium 16 name over muted 13 lines. The email is a mailto link when it is a real address.
 */
export function EnquiryContacts({ contacts }: { contacts: PropertyContact[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {contacts.map((c) => (
        <li key={c.name} className="flex items-center gap-3.5 rounded-card bg-white px-[18px] py-4 md:px-5 md:py-[18px]">
          <span aria-hidden="true" className="size-12 shrink-0 rounded-full bg-line md:size-[52px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.5]">
            <p className="text-[16px] font-medium text-ink">{c.name}</p>
            <p lang={c.secondLang} className="text-[13px] text-muted">
              {c.second}
            </p>
            {c.email.includes("@") ? (
              <a href={`mailto:${c.email}`} className="self-start text-[13px] text-muted underline-offset-2 hover:text-ink hover:underline">
                {c.email}
              </a>
            ) : (
              <p className="text-[13px] text-muted">{c.email}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Looking in another market?" (1507:52412): surface band, Medium 20 heading, white outline pills (Medium 14,
 * arrow_outward), 48px padding (40 at 390, Medium 13 pills).
 */
export function MarketChips({ title, markets }: { title: string; markets: { label: string; href: string | null }[] }) {
  return (
    <section aria-labelledby="other-markets" className="bg-surface py-10 lg:py-12">
      <div className={`${GUTTER} flex flex-col gap-3.5 md:gap-4`}>
        <h2 id="other-markets" className="text-[19px] font-medium leading-[1.5] text-ink lg:text-[20px]">
          {title}
        </h2>
        <ul className="flex flex-wrap gap-2 md:gap-2.5">
          {markets.map((m) => (
            <li key={m.label}>
              <SmartLink
                href={m.href}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-line bg-white py-[11px] pl-[17px] pr-[15px] text-[13px] font-medium leading-[1.5] text-ink transition-colors hover:border-ink md:min-h-[46px] md:pl-[18px] md:pr-4 md:text-[14px]"
              >
                {m.label}
                <Icon name="arrow_outward" size={18} />
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Amenity / sustainability cards (1507:52181): surface, radius 12, 24px padding (20 at 390), 28px icon square */
function FeatureCards({ cards }: { cards: FeatureCard[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
      {cards.map((c) => (
        <li key={c.title} className="flex flex-col gap-2 rounded-card bg-surface p-5 lg:p-6">
          <span aria-hidden="true" className="size-7 rounded-btn bg-line" />
          <p className="text-[17px] font-medium leading-[1.5] text-ink lg:text-[18px]">{c.title}</p>
          <p className="text-[14px] leading-[1.5] text-muted-surface">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}

type FeaturesCopy = (typeof JP_PROPERTY_DETAIL)["features"];

/**
 * "Features and amenities" (1507:52171): Bold 36 heading over the three groups, all drawn open. Sustainability:
 * a 72px (56 at 390) rating placeholder beside Medium 20 / muted 14 copy, "Awards and certifications" (Medium 12
 * muted) over four 96 x 56 (78 x 48) logo placeholders, then the four cards. Property features: a check list in
 * two columns 48px apart (one at 390) with line rules between rows.
 */
export function FeaturesAndAmenities({ copy }: { copy: FeaturesCopy }) {
  const s = copy.sustainability;
  const items = copy.property.items;
  const half = Math.ceil(items.length / 2);
  const list = (rows: string[], className = "") => (
    <ul className={`flex min-w-0 flex-1 flex-col ${className}`}>
      {rows.map((f, i) => (
        <li key={f} className={`flex items-start gap-3 py-3 text-[15px] leading-[1.5] text-ink ${i > 0 ? "border-t border-line" : ""}`}>
          <Icon name="check" size={18} className="mt-0.5" />
          <span className="min-w-0 flex-1">{f}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-labelledby="features-amenities" className="py-14 lg:py-[72px]">
      <div className={`${GUTTER} flex flex-col gap-4 lg:gap-5`}>
        <h2 id="features-amenities" className={SECTION_H2}>
          {copy.title}
        </h2>
        <PropertyAccordions
          items={[
            { label: copy.amenities.label, content: <FeatureCards cards={copy.amenities.cards} /> },
            {
              label: s.label,
              content: (
                <div className="flex flex-col gap-3.5 lg:gap-5">
                  <div className="flex items-center gap-3.5 py-4 md:gap-4 lg:max-w-[589px] lg:py-5">
                    <span aria-hidden="true" className="size-14 shrink-0 rounded-control bg-line lg:size-[72px]" />
                    <div className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.5] lg:gap-1">
                      <p className="text-[17px] font-medium text-ink lg:text-[20px]">{s.rating.title}</p>
                      <p className="text-[13px] text-muted lg:text-[14px]">{s.rating.body}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-[12px] font-medium leading-[1.5] text-muted">{s.awardsLabel}</h4>
                    <ul className="grid grid-cols-4 gap-2.5 md:flex md:gap-3">
                      {Array.from({ length: s.awards }, (_, i) => (
                        <li key={i}>
                          <span role="img" aria-label={`[Award or certification logo ${i + 1}]`} className="block h-12 rounded-btn bg-line md:h-14 md:w-24" />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <FeatureCards cards={s.cards} />
                </div>
              ),
            },
            {
              label: copy.property.label,
              content: (
                <div className="flex flex-col md:flex-row md:gap-12">
                  {list(items.slice(0, half))}
                  {list(items.slice(half), "max-md:border-t max-md:border-line")}
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  );
}
