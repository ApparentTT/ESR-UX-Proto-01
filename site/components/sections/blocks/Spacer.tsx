/**
 * B43 Spacer: an empty white block of fixed height (SGOV §2: 98px at desktop, 48 at 768, 24 at 390).
 * Heights are px per breakpoint.
 */
export function Spacer({ height = { base: 24, md: 48, lg: 98 } }: { height?: { base: number; md?: number; lg?: number } }) {
  const md = height.md ?? height.base;
  const lg = height.lg ?? md;
  return (
    <div
      aria-hidden="true"
      className="h-[var(--sp-base)] bg-white md:h-[var(--sp-md)] lg:h-[var(--sp-lg)]"
      style={{ "--sp-base": `${height.base}px`, "--sp-md": `${md}px`, "--sp-lg": `${lg}px` } as React.CSSProperties}
    />
  );
}
