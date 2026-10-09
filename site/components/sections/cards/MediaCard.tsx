import { SmartLink } from "@/components/ui/SmartLink";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/type";

/**
 * Card kinds (inventory B13). The grid variant names map onto these:
 * explore2 → explore, products3 → product, featured3 → featured, story3 → story, learnMore3 → learnMore, case3 → case.
 */
export type MediaCardVariant = "explore" | "product" | "featured" | "story" | "learnMore" | "case";

export type MediaCardData = {
  title: string;
  /** A built route, null for an inert link (page not wireframed), or omit for a static card (not a link) */
  href?: string | null;
  /** explore / product: the line(s) under the title */
  body?: string;
  /** story: muted 13px line above the title, verbatim (double spaces around "·" kept) */
  eyebrow?: string;
  /** case: Medium 16 meta line under the title, verbatim (double spaces kept) */
  meta?: string;
  /** story / learnMore: CTA label, e.g. "Read the story", "Learn more" */
  cta?: string;
};

/** Media aspect per kind. Tall portrait media drops to 4:3 on mobile where the specs ask for it. */
const MEDIA: Record<MediaCardVariant, string> = {
  explore: "aspect-[638/380]",
  product: "aspect-[415.33/248]",
  featured: "aspect-[4/3] md:aspect-[415.33/470]",
  story: "aspect-[415.33/470]",
  learnMore: "aspect-[415/330]",
  case: "aspect-[4/3] md:aspect-[415.33/470]",
};

/** Bold 20/32 ink card title (18/28 on mobile). */
const TITLE = "text-[18px] font-bold leading-7 text-ink lg:text-[20px] lg:leading-8";
const NUDGE = "transition-transform group-hover:translate-x-1";

/**
 * B13 MediaCard: a media block on top, text below, no card chrome. The whole card is the link unless static.
 * Hover (links only): title underline, arrow nudges 4px right, a 1px ink ring on the media.
 */
export function MediaCard({
  variant,
  title,
  href,
  body,
  eyebrow,
  meta,
  cta,
  headingLevel: H = "h3",
  onSurface = false,
}: MediaCardData & {
  variant: MediaCardVariant;
  headingLevel?: "h2" | "h3" | "h4";
  /** Set when the card sits on a surface band: muted text switches to the AA-safe muted-surface grey */
  onSurface?: boolean;
}) {
  const isLink = href !== undefined;
  const hoverTitle = isLink ? "underline-offset-4 group-hover:underline" : "";
  const muted = onSurface ? "text-muted-surface" : "text-muted";

  const media = (
    <ImagePlaceholder
      className={`w-full rounded-control ${MEDIA[variant]} ${isLink ? "transition-shadow group-hover:ring-1 group-hover:ring-ink" : ""}`}
      iconSize={40}
    />
  );

  let text: React.ReactNode;
  switch (variant) {
    case "explore":
      text = (
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <H className={`text-[18px] font-bold leading-[1.5] text-body lg:text-[20px] ${hoverTitle}`}>{title}</H>
            <Icon name="arrow_forward" size={24} className={`mt-0.5 text-ink ${NUDGE}`} />
          </div>
          {body && <p className={`leading-[1.2] ${T.body16m}`}>{body}</p>}
        </div>
      );
      break;
    case "product":
      text = (
        <div className="flex flex-col gap-2">
          <H className={`${TITLE} ${hoverTitle}`}>{title}</H>
          {body && <p className={`leading-[1.2] ${T.body16m}`}>{body}</p>}
        </div>
      );
      break;
    case "featured":
      text = (
        <div className="flex min-h-[42px] items-center justify-between gap-4">
          <H className={`${TITLE} ${hoverTitle}`}>{title}</H>
          <span className="flex h-[42px] w-10 shrink-0 items-center justify-center text-[#1F1F1F]">
            <Icon name="arrow_forward" size={28} className={NUDGE} />
          </span>
        </div>
      );
      break;
    case "story":
      text = (
        <div className="flex flex-col gap-4">
          {eyebrow && <p className={`whitespace-pre-wrap text-[13px] leading-[1.45] ${muted}`}>{eyebrow}</p>}
          <H className={`${TITLE} ${hoverTitle}`}>{title}</H>
          {cta && <CtaLine label={cta} />}
        </div>
      );
      break;
    case "learnMore":
      text = (
        <div className="flex flex-col gap-4">
          <H className={`${TITLE} ${hoverTitle}`}>{title}</H>
          {cta && <CtaLine label={cta} />}
        </div>
      );
      break;
    case "case":
      text = (
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <H className={`${TITLE} ${hoverTitle}`}>{title}</H>
            {meta && <p className={`whitespace-pre-wrap leading-[1.2] ${T.body16m}`}>{meta}</p>}
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center text-[#1F1F1F]">
            <Icon name="arrow_forward" size={30} className={NUDGE} />
          </span>
        </div>
      );
      break;
  }

  const cls = "group flex h-full flex-col gap-4";
  if (!isLink)
    return (
      <div className={cls}>
        {media}
        {text}
      </div>
    );
  return (
    <SmartLink href={href} className={cls}>
      {media}
      {text}
    </SmartLink>
  );
}

/** "Read the story →" / "Learn more →": ~18px Medium + 24px arrow, 10px gap, 5px top padding. Not a nested link. */
function CtaLine({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 self-start pt-[5px] text-[17px] font-medium leading-[1.45] text-ink lg:text-[18px]">
      <span className="underline-offset-4 group-hover:underline">{label}</span>
      <Icon name="arrow_forward" size={24} className={NUDGE} />
    </span>
  );
}
