/**
 * Type scale from the R2 wireframes (inventory §3.1), mobile first: 390 → 768 → 1440.
 * Use these class strings on headings and text so every page shares one scale.
 */
export const T = {
  heroH1: "text-[32px] leading-[1.2] md:text-[40px] lg:text-[48px] lg:leading-[1.2] font-medium tracking-[-0.02em] text-ink",
  display48: "text-[32px] md:text-[40px] lg:text-[48px] leading-[1.18] font-bold text-ink",
  /** Default H1/H2: Medium 40, -0.8 */
  h40m: "text-[28px] md:text-[34px] lg:text-[40px] leading-[1.2] font-medium tracking-[-0.02em] text-ink",
  h40b: "text-[28px] md:text-[34px] lg:text-[40px] leading-[1.2] font-bold text-ink",
  h36b: "text-[26px] md:text-[30px] lg:text-[36px] leading-[1.2] font-bold text-ink",
  h36m: "text-[26px] md:text-[30px] lg:text-[36px] leading-[1.2] font-medium text-ink",
  h32b: "text-[26px] md:text-[28px] lg:text-[32px] leading-[1.2] font-bold text-ink",
  h32r: "text-[24px] md:text-[28px] lg:text-[32px] leading-[1.12] font-normal text-ink",
  quote32: "text-[22px] md:text-[28px] lg:text-[32px] leading-[1.4] font-normal text-black",
  stat48: "text-[32px] leading-[40px] md:text-[36px] md:leading-[44px] lg:text-[48px] lg:leading-[56px] font-medium tracking-[-0.02em] text-ink",
  stat40m: "text-[32px] leading-[40px] lg:text-[40px] lg:leading-[56px] font-medium tracking-[-0.02em] text-ink",
  stat40b: "text-[30px] md:text-[34px] lg:text-[40px] leading-[1.2] font-bold text-ink",
  stat36b: "text-[28px] md:text-[32px] lg:text-[36px] leading-[1.2] font-bold text-ink",
  name28b: "text-[24px] md:text-[26px] lg:text-[28px] leading-[1.5] font-bold text-ink",
  eyebrow24: "text-[20px] lg:text-[24px] font-semibold tracking-[-0.02em] text-ink",
  h24m: "text-[20px] lg:text-[24px] font-medium tracking-[-0.02em] text-ink",
  h24b: "text-[20px] lg:text-[24px] font-bold leading-[1.18] text-ink",
  card24m: "text-[20px] lg:text-[24px] leading-[1.2] font-medium text-ink",
  title22b: "text-[20px] lg:text-[22px] leading-[1.45] font-bold text-ink",
  title20b: "text-[18px] lg:text-[20px] leading-[1.5] font-bold text-ink",
  title20m: "text-[18px] lg:text-[20px] leading-[1.45] font-medium text-ink",
  market20sb: "text-[18px] lg:text-[20px] leading-[1.6] font-semibold text-ink",
  /** Intros, band bodies, SplitBlock bodies */
  bodyLg: "text-[16px] leading-[24px] lg:text-[18px] lg:leading-[28px] text-body",
  /** Subs under headings */
  sub18: "text-[16px] lg:text-[18px] leading-[1.45] text-muted",
  lead20: "text-[17px] md:text-[18px] lg:text-[20px] leading-[1.5] text-muted",
  body17: "text-[16px] lg:text-[17px] leading-[1.48] text-muted",
  body16: "text-[16px] leading-[24px] text-muted",
  body16m: "text-[16px] font-medium tracking-[-0.02em] text-ink",
  body15: "text-[15px] leading-[1.45] text-muted",
  ui15m: "text-[15px] leading-[1.45] font-medium text-ink",
  ui14m: "text-[14px] leading-[20px] font-medium text-ink",
  small14: "text-[14px] leading-[20px] text-muted",
  caption13: "text-[13px] leading-[1.45] text-muted",
  tag12: "text-[12px] leading-[1.45] font-medium text-muted",
} as const;

/**
 * Gives a small inline control a tap target at least 40px tall (centred, full width) through an
 * ::after box, so neither the layout nor the focus ring changes. Do not combine with another ::after.
 */
export const HIT = "relative after:absolute after:inset-x-0 after:top-1/2 after:h-[max(100%,40px)] after:-translate-y-1/2 after:content-['']";

/** Section vertical rhythm (inventory §3.3), ~0.6x on mobile. */
export const PAD = {
  /** "Blocks - Structure" text/media blocks: 72 / 72 */
  block: "py-12 md:py-16 lg:py-[72px]",
  /** Data and surface blocks: 80 / 80 */
  data: "py-12 md:py-16 lg:py-20",
  /** Mid-size blocks: 64 / 64 */
  mid: "py-10 md:py-14 lg:py-16",
} as const;
