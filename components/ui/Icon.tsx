type IconProps = {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
};

/** Google Material Symbols Rounded. Always decorative: pair with visible text or an aria-label on the control. */
export function Icon({ name, size = 20, filled, className = "" }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${filled ? "icon-fill" : ""} ${className}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}
