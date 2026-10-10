import { SmartLink } from "./SmartLink";
import { Icon } from "./Icon";
import { HIT } from "./type";

/**
 * Text links (inventory A3).
 * - section: Bold 20/32 underlined, top right of a heading row
 * - card: Regular 14 underlined, inside cards
 * - arrow: label + arrow_forward, underline and arrow nudge on hover
 * - underline: Medium 15 underlined
 * - external: label + open_in_new (icon before or after)
 * - explore: Bold 13 underlined + small arrow
 * Every variant gets a 40px-tall tap target (HIT) without changing its size on the page.
 */
export type TextLinkVariant = "section" | "card" | "arrow" | "underline" | "external" | "explore";

export function TextLink({
  href,
  variant = "arrow",
  size = 16,
  icon,
  iconBefore,
  tone = "ink",
  className = "",
  children,
  ...rest
}: {
  href: string | null;
  variant?: TextLinkVariant;
  /** Label size in px for arrow, external and underline links */
  size?: 13 | 14 | 15 | 16 | 18;
  /** Override the icon (e.g. mail, call, location_on, download) */
  icon?: string;
  iconBefore?: boolean;
  tone?: "ink" | "white" | "muted";
  className?: string;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">) {
  const color = tone === "white" ? "text-white" : tone === "muted" ? "text-muted hover:text-ink" : "text-ink";
  const sizeCls = { 13: "text-[13px]", 14: "text-[14px]", 15: "text-[15px]", 16: "text-[16px]", 18: "text-[17px] lg:text-[18px]" }[size];
  const iconSize = size >= 18 ? 22 : size === 16 ? 20 : 18;

  if (variant === "section")
    return (
      <SmartLink href={href} className={`${HIT} shrink-0 text-[17px] font-bold leading-8 text-ink/80 underline underline-offset-4 hover:text-ink lg:text-[20px] ${className}`} {...rest}>
        {children}
      </SmartLink>
    );
  if (variant === "card")
    return (
      <SmartLink href={href} className={`${HIT} text-[14px] leading-[28.8px] text-ink/80 underline underline-offset-2 hover:text-ink ${className}`} {...rest}>
        {children}
      </SmartLink>
    );
  if (variant === "underline")
    return (
      <SmartLink href={href} className={`${HIT} ${sizeCls} font-medium leading-[1.45] ${color} underline underline-offset-4 ${className}`} {...rest}>
        {children}
      </SmartLink>
    );
  if (variant === "explore")
    return (
      <SmartLink href={href} className={`${HIT} group inline-flex items-center gap-3 text-[13px] font-bold leading-5 text-[#393939] underline underline-offset-2 ${className}`} {...rest}>
        {children}
        <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" />
      </SmartLink>
    );
  const ic = icon ?? (variant === "external" ? "open_in_new" : "arrow_forward");
  const before = iconBefore ?? false;
  return (
    <SmartLink href={href} className={`${HIT} group inline-flex items-center gap-2 ${sizeCls} font-medium leading-[1.45] ${color} hover:underline underline-offset-4 ${className}`} {...rest}>
      {before && <Icon name={ic} size={iconSize} />}
      {children}
      {!before && <Icon name={ic} size={iconSize} className={variant === "arrow" ? "transition-transform group-hover:translate-x-1" : ""} />}
    </SmartLink>
  );
}
