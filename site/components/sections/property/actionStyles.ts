/**
 * Button looks shared by the property page's actions (Share, Save as PDF, the downloads) in their three places:
 * - "outline": the title block (Share 1507:52111: white, 1px line border, radius 8, Medium 14, icon)
 * - "compact": the sticky bar at 768+ (a borderless text-and-icon button, 40 tall)
 * - "icon": the sticky bar below 768 (a 48px outlined icon button; the label is for screen readers only)
 */
export type ActionVariant = "outline" | "compact" | "icon";

export const ACTION_BUTTON: Record<ActionVariant, string> = {
  outline:
    "inline-flex min-h-[46px] items-center gap-2 rounded-control border border-line bg-white px-4 py-[11px] text-[14px] font-medium leading-[1.5] text-ink transition-colors hover:border-ink aria-expanded:border-ink",
  compact:
    "inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-btn px-2.5 text-[14px] font-medium leading-5 text-ink transition-colors hover:bg-surface aria-expanded:bg-surface",
  icon: "inline-flex size-12 shrink-0 items-center justify-center rounded-btn border border-line bg-white text-ink transition-colors hover:border-ink aria-expanded:border-ink",
};
