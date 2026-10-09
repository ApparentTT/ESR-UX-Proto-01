import { Section, type SectionBg } from "@/components/ui/Section";
import { Footnotes } from "@/components/ui/DataBits";
import { T } from "@/components/ui/type";

/**
 * StatRow family (inventory B6). One component, nine variants.
 *
 * Section variants (render their own full-bleed band, white by default):
 * - home:   HOME §3b. 64/64, 64px gap to the footnotes (with rule).
 * - dev:    DEV §3. 32/32, labels reserve 2 lines, 1 footnote with rule.
 * - dc:     DC §5. 0/64, 32px gap, 1 footnote with rule.
 * - sus:    SUS §5b. 0/64, 64px gap, centre-aligned row, 1 footnote with rule.
 * - people: PEOPLE §3. 0/64, no footnotes, full-width #858585 divider after the stats.
 * - about:  ABOUT §3. 0/64, 40px values with per-stat underlines, `rows` (2), footnotes without rule.
 *
 * Inner variants (render only the list; the parent block supplies the band):
 * - bold5: inside TrackRecord (INV §3b). 5 columns, Bold 40 values, stat 5 carries a `sideLabel`.
 * - bold4: inside PowerPipeline (DC §3b). 4 columns, Bold 36 values.
 * - map:   inside InteractiveMap (PORT §2a, DEV §4a). Right-aligned group of 146px items, #393939.
 *
 * Responsive: 2 x 2 at 390 with no inset; 4-up from 1024 (bold5: 2 cols with stat 5 spanning,
 * then 3 + 2, then 5-up from 1280). The Figma inset (stats 2-4 padded 24px) only applies once the
 * columns are wide enough for it (>= 1400).
 */

export type StatItem = {
  value: string;
  label: string;
  /** Footnote marker rendered as a superscript after the label, e.g. 1 */
  sup?: string | number;
  /** bold5 only: the SemiBold 14 label beside the value ("Top global limited partners") */
  sideLabel?: string;
};

export type StatRowVariant = "home" | "dev" | "dc" | "sus" | "people" | "about" | "bold5" | "bold4" | "map";

type Stat48Variant = "home" | "dev" | "dc" | "sus" | "people";
type SectionVariant = Stat48Variant | "about";

const SECTION_VARIANTS: SectionVariant[] = ["home", "dev", "dc", "sus", "people", "about"];

/** Section padding per variant (desktop values from inventory B6, ~0.6x on mobile). */
const SECTION_PAD: Record<SectionVariant, string> = {
  home: "py-10 md:py-14 lg:py-16",
  dev: "py-6 md:py-8",
  dc: "pt-6 pb-10 md:pb-14 lg:pt-0 lg:pb-16",
  sus: "pt-6 pb-10 md:pb-14 lg:pt-0 lg:pb-16",
  people: "pt-6 pb-10 md:pb-14 lg:pt-0 lg:pb-16",
  about: "pb-10 md:pb-14 lg:pb-16",
};

/** Gap between the stats block and the footnotes. */
const FOOT_GAP: Record<SectionVariant, string> = {
  home: "mt-10 lg:mt-16",
  dev: "mt-6 lg:mt-0",
  dc: "mt-8",
  sus: "mt-10 lg:mt-16",
  people: "mt-6 lg:mt-[19px]",
  about: "mt-6 lg:mt-[30px]",
};

const DEFAULT_RULE: Record<SectionVariant, boolean> = {
  home: true,
  dev: true,
  dc: true,
  sus: true,
  people: true,
  about: false,
};

/** Vertical alignment of the stats within the row at desktop (as drawn). */
const ALIGN: Record<Stat48Variant, string> = {
  home: "lg:items-start",
  dev: "lg:items-center",
  dc: "lg:items-center",
  sus: "lg:items-center",
  people: "lg:items-start",
};

/** Medium 48/56 at 1280+, 36 between 768 and 1279, 32 at 390. */
const VALUE_48 =
  "text-[clamp(26px,8.2vw,32px)] leading-[1.25] md:text-[36px] md:leading-[44px] xl:text-[48px] xl:leading-[56px] font-medium tracking-[-0.02em] text-ink";
/** Medium 40/56 (about) */
const VALUE_40 =
  "text-[clamp(26px,8.2vw,32px)] leading-[1.25] md:text-[36px] md:leading-[48px] xl:text-[40px] xl:leading-[56px] font-medium tracking-[-0.02em] text-ink";
const LABEL_16 = "text-[14px] leading-5 md:text-[16px] md:leading-6";

function Label({ stat }: { stat: StatItem }) {
  return (
    <>
      {stat.label}
      {stat.sup !== undefined && <sup className="text-[10px]">{stat.sup}</sup>}
    </>
  );
}

/**
 * The stats list on its own, without the section band. StatRow renders this inside its band for
 * the section variants and on its own for bold5, bold4 and map.
 */
export function StatList({
  stats,
  variant,
  inset = "figma",
  surface,
  className = "",
  label,
}: {
  stats: StatItem[];
  variant: StatRowVariant;
  /** figma: stats 2-4 inset 24px at wide desktop (stat48 variants only) */
  inset?: "figma" | "none";
  /** Muted text sits on the surface grey: use the darker muted-surface grey. Default true for bold5 / bold4. */
  surface?: boolean;
  className?: string;
  /** Optional accessible name for the list */
  label?: string;
}) {
  const onSurface = surface ?? (variant === "bold5" || variant === "bold4");
  const muted = onSurface ? "text-muted-surface" : "text-muted";

  if (variant === "map") {
    return (
      <ul
        role="list"
        aria-label={label}
        className={`grid grid-cols-2 gap-x-4 gap-y-6 md:flex md:justify-end md:gap-6 xl:gap-[72px] ${className}`}
      >
        {stats.map((s) => (
          <li key={s.label} className="flex min-w-0 flex-col gap-2.5 md:w-[146px] md:shrink">
            <span className="text-[24px] font-bold leading-[25.6px] text-[#393939] lg:text-[26.9px]">{s.value}</span>
            <span className="text-[14px] leading-[1.2] text-[#393939] lg:text-[14.1px]">
              <Label stat={s} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "bold5") {
    return (
      <ul
        role="list"
        aria-label={label}
        className={`grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 md:gap-x-6 md:gap-y-8 xl:grid-cols-5 xl:gap-0 ${className}`}
      >
        {stats.map((s, i) => (
          <li
            key={s.label}
            className={`flex min-w-0 flex-col gap-1.5 ${i === 4 && stats.length === 5 ? "col-span-2 md:col-span-1" : ""}`}
          >
            <span className="flex items-center gap-1.5">
              <span className={`${T.stat40b} whitespace-nowrap`}>{s.value}</span>
              {s.sideLabel && (
                <span className="w-[109px] shrink-0 text-[14px] font-semibold leading-none text-black">{s.sideLabel}</span>
              )}
            </span>
            <span className={`text-[14px] leading-[1.45] ${muted}`}>
              <Label stat={s} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "bold4") {
    return (
      <ul role="list" aria-label={label} className={`grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-0 ${className}`}>
        {stats.map((s) => (
          <li key={s.label} className="flex min-w-0 flex-col gap-1.5">
            <span className={`${T.stat36b} md:whitespace-nowrap`}>{s.value}</span>
            <span className={`text-[14px] leading-[1.45] ${muted}`}>
              <Label stat={s} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "about") {
    return (
      <ul
        role="list"
        aria-label={label}
        className={`grid grid-cols-2 gap-x-4 lg:grid-cols-4 lg:gap-x-[30px] ${className}`}
      >
        {stats.map((s, i) => (
          <li key={`${s.label}-${i}`} className="flex min-w-0 flex-col border-b border-[#858585] py-4 lg:py-6">
            <span className={VALUE_40}>{s.value}</span>
            <span className={`${LABEL_16} ${muted}`}>
              <Label stat={s} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // stat48 family: home, dev, dc, sus, people
  const insetCls = inset === "figma" ? "min-[1400px]:px-6" : "";
  return (
    <ul
      role="list"
      aria-label={label}
      className={`grid grid-cols-2 items-start gap-x-4 gap-y-6 md:gap-x-[30px] md:gap-y-8 lg:grid-cols-4 lg:gap-y-0 ${ALIGN[variant]} ${className}`}
    >
      {stats.map((s, i) => (
        <li key={`${s.label}-${i}`} className={`flex min-w-0 flex-col gap-2 lg:gap-3 lg:py-6 ${i > 0 ? insetCls : ""}`}>
          <span className={VALUE_48}>{s.value}</span>
          <span className={`${LABEL_16} ${muted} ${variant === "dev" ? "lg:min-h-12" : ""}`}>
            <Label stat={s} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export type StatRowProps = {
  variant: StatRowVariant;
  /** One row of stats */
  stats?: StatItem[];
  /** Several rows (about: row 2 duplicates row 1 as drawn). Takes precedence over `stats`. */
  rows?: StatItem[][];
  /** Footnote list under the stats (section variants only) */
  footnotes?: React.ReactNode[];
  /** Top rule over the footnotes. Default: true, except about. */
  footnoteRule?: boolean;
  /** Full-width #858585 divider after the stats. Default: true for people only. */
  divider?: boolean;
  /** stat48 variants: stats 2-4 inset 24px at wide desktop, as drawn ("figma"), or flush ("none") */
  inset?: "figma" | "none";
  /** Band colour for the section variants (default white) */
  bg?: SectionBg;
  /** Extra classes on the band (section variants) or the list (inner variants) */
  className?: string;
  /** Optional accessible name for the stats list */
  label?: string;
  id?: string;
};

/**
 * Stat row (inventory B6). The section variants render a full-bleed band with the variant's own
 * padding; bold5, bold4 and map render only the list, for use inside TrackRecord, PowerPipeline
 * and InteractiveMap.
 */
export function StatRow({
  variant,
  stats = [],
  rows,
  footnotes,
  footnoteRule,
  divider,
  inset = "figma",
  bg = "white",
  className = "",
  label,
  id,
}: StatRowProps) {
  const allRows = rows && rows.length ? rows : [stats];

  if (!(SECTION_VARIANTS as string[]).includes(variant)) {
    return <StatList stats={allRows[0]} variant={variant} inset={inset} className={className} label={label} />;
  }

  const v = variant as SectionVariant;
  const rule = footnoteRule ?? DEFAULT_RULE[v];
  const showDivider = divider ?? v === "people";
  const surface = bg === "surface";

  return (
    <Section as="div" bg={bg} id={id} className={`${SECTION_PAD[v]} ${className}`}>
      <div className={v === "about" ? "flex flex-col gap-6 lg:gap-[30px]" : undefined}>
        {allRows.map((row, i) => (
          <StatList key={i} stats={row} variant={v} inset={inset} surface={surface} label={label} />
        ))}
      </div>
      {showDivider && <div aria-hidden="true" className={`h-[31px] border-t border-[#858585] ${FOOT_GAP[v]}`} />}
      {footnotes && footnotes.length > 0 && (
        <Footnotes items={footnotes} rule={rule} className={FOOT_GAP[v]} />
      )}
    </Section>
  );
}
