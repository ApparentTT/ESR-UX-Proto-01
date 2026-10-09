/**
 * Small group label above a card or tile grid (INV §4 "What we invest in" / "Our listed REITs",
 * PEOPLE §6 "Explore careers in our markets"): Medium 14 / 1.48 muted.
 * `on` picks a grey that keeps 4.5:1 contrast on the band behind it.
 */
export type GroupLabelOn = "white" | "surface" | "grey";

const TONE: Record<GroupLabelOn, string> = {
  white: "text-muted",
  surface: "text-muted-surface",
  /** #6B7280 and muted-surface both fall under 4.5:1 on the grey band (#E5E7EB) */
  grey: "text-[#4B5563]",
};

export function GroupLabel({
  id,
  as: L = "p",
  on = "white",
  className = "",
  children,
}: {
  id?: string;
  as?: "h3" | "h4" | "p";
  on?: GroupLabelOn;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <L id={id} className={`text-[14px] font-medium leading-[1.48] ${TONE[on]} ${className}`}>
      {children}
    </L>
  );
}

/** Muted text colour for copy sitting directly on a band of this background. */
export function mutedOn(on: GroupLabelOn) {
  return TONE[on];
}
