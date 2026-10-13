type IconProps = {
  name: string;
  size?: number;
  filled?: boolean;
  /** Heavier stroke, for icons drawn bold (the icon font is loaded at weight 400 only, so this thickens the outline) */
  bold?: boolean;
  /** Optical size (the font is loaded at 20 to 24). Defaults to 20; the nav passes 24 for its 24px icons, as drawn in Figma. */
  opsz?: number;
  className?: string;
};

/** Google Material Symbols Rounded. Always decorative: pair with visible text or an aria-label on the control. */
export function Icon({ name, size = 20, filled, bold, opsz, className = "" }: IconProps) {
  const style: React.CSSProperties = { fontSize: size };
  if (bold) style.WebkitTextStroke = "0.045em currentColor";
  if (opsz) style.fontVariationSettings = `"FILL" ${filled ? 1 : 0}, "wght" 400, "GRAD" 0, "opsz" ${opsz}`;
  return (
    <span aria-hidden="true" className={`icon ${filled ? "icon-fill" : ""} ${className}`} style={style}>
      {name}
    </span>
  );
}
