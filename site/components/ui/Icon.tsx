type IconProps = {
  name: string;
  size?: number;
  filled?: boolean;
  /** Heavier stroke, for icons drawn bold (the icon font is loaded at weight 400 only, so this thickens the outline) */
  bold?: boolean;
  className?: string;
};

/** Google Material Symbols Rounded. Always decorative: pair with visible text or an aria-label on the control. */
export function Icon({ name, size = 20, filled, bold, className = "" }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${filled ? "icon-fill" : ""} ${className}`}
      style={bold ? { fontSize: size, WebkitTextStroke: "0.045em currentColor" } : { fontSize: size }}
    >
      {name}
    </span>
  );
}
