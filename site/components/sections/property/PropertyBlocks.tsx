import { Container } from "@/components/layout/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SmartLink } from "@/components/ui/SmartLink";
import type { DistanceStat, PropertyContact } from "@/data/site/local/property-detail";

/**
 * Static parts of the Japan property detail page (Figma 1273:90948 desktop, 1273:90949 mobile). Server components;
 * the interactive parts (media row, share, downloads, accordions, table, map, carousel, sticky bar) are their own
 * client components in this folder.
 */

/** Title block (1138:10641): Medium 40 (-0.8) name in a 466px column, 18/28 address, Bold 12/28 type line (20px gaps) */
export function PropertyTitle({ name, address, tags }: { name: string; address: string; tags: string[] }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5" data-print-avoid>
      <h1 className="max-w-[466px] text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-ink md:text-[36px] lg:text-[40px]">{name}</h1>
      <p className="text-[16px] leading-6 text-body lg:text-[18px] lg:leading-7">{address}</p>
      <ul aria-label="Property details" className="flex flex-wrap gap-x-5 text-[12px] font-bold leading-7 text-body">
        {tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

/** Distance stats (1138:10653): 2 x 2, Medium 32 (-0.64) / 56 values over 16/24 muted labels, 30px column gap */
export function DistanceStats({ stats }: { stats: DistanceStat[] }) {
  return (
    <dl className="grid max-w-[440px] grid-cols-2 gap-x-[30px] gap-y-2 md:gap-y-1" data-print-avoid>
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse">
          <dt className="text-[14px] leading-6 text-muted md:text-[16px]">{s.label}</dt>
          <dd className="text-[28px] font-medium leading-[1.6] tracking-[-0.02em] text-ink md:text-[32px] md:leading-[56px]">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * "Enquire about this property" contacts (1138:10668): Bold 24 heading, then each contact: an 88px round image
 * placeholder (muted border) beside (under, at 390) Bold 20 name over Regular 20 second line, then 16/24 muted
 * phone and email, 32px between contacts. The email is a mailto link when it is a real address.
 */
export function PropertyContacts({ title, contacts, children }: { title: string; contacts: PropertyContact[]; children?: React.ReactNode }) {
  return (
    <section aria-labelledby="property-contacts" className="flex flex-col gap-6 md:gap-[32px]">
      <h2 id="property-contacts" className="text-[22px] font-bold tracking-[-0.02em] text-ink lg:text-[24px]">
        {title}
      </h2>
      <ul className="flex flex-col gap-8">
        {contacts.map((c) => (
          <li key={c.name} className="flex flex-col gap-4 md:flex-row md:gap-6" data-print-avoid>
            <ImagePlaceholder className="size-[88px] shrink-0 rounded-full border border-muted" iconSize={40} />
            <div className="flex min-w-0 flex-col gap-4">
              <div className="text-[20px] tracking-[-0.02em] text-ink">
                <p className="font-bold">{c.name}</p>
                <p lang={c.secondLang}>{c.second}</p>
              </div>
              <div className="flex flex-col gap-1 text-[16px] leading-6 text-muted">
                <p>{c.phone}</p>
                {c.email.includes("@") ? (
                  <a href={`mailto:${c.email}`} className="self-start underline-offset-2 hover:text-ink hover:underline">
                    {c.email}
                  </a>
                ) : (
                  <p>{c.email}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {children}
    </section>
  );
}

/** "Sharing the space" (1138:10734): Bold 18 heading, four 136 x 92 logo placeholders (radius 8), 2 x 2 at 390 */
export function SharingSpace({ title, count }: { title: string; count: number }) {
  return (
    <section aria-labelledby="sharing-space" className="flex flex-col gap-[23px]" data-print-avoid>
      <h2 id="sharing-space" className="text-[18px] font-bold leading-[1.45] text-ink">
        {title}
      </h2>
      <ul className="grid max-w-[657px] grid-cols-2 gap-x-[20%] gap-y-8 md:grid-cols-4 md:gap-x-[5.7%]">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <ImagePlaceholder label={`[Customer logo ${i + 1}]`} className="aspect-[136/92] w-full rounded-control border border-muted" iconSize={30} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** "Looking in another market?" (1138:10930): surface band, Medium 18 heading, white outline pills (Medium 21 at 1440) */
export function MarketChips({ title, markets }: { title: string; markets: { label: string; href: string | null }[] }) {
  return (
    <section aria-labelledby="other-markets" className="bg-surface py-10" data-print-hide>
      <Container className="flex flex-col gap-6 md:gap-8">
        <h2 id="other-markets" className="text-[18px] font-medium leading-[1.45] text-ink">
          {title}
        </h2>
        <ul className="flex flex-wrap gap-3">
          {markets.map((m) => (
            <li key={m.label}>
              <SmartLink
                href={m.href}
                className="inline-flex min-h-11 items-center rounded-full border-[1.6px] border-line bg-white px-4 py-2 text-[17px] font-medium leading-[1.45] text-ink transition-colors hover:border-ink lg:px-[19px] lg:text-[21px]"
              >
                {m.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
