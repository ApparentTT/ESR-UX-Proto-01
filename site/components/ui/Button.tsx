import { SmartLink } from "./SmartLink";
import { Icon } from "./Icon";

/**
 * Buttons from the wireframes (inventory A2). Render as a link when `href` is given
 * (null = inert, page not wireframed) or as a <button> otherwise.
 */
export type ButtonVariant = "primary" | "secondary" | "dark" | "outlineDark" | "pill" | "pillOutlineLg" | "heroCta";

const BASE = "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors";
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "h-[38px] gap-2 rounded-btn border border-muted bg-muted px-4 text-[16px] font-medium leading-5 text-white hover:border-[#4B5563] hover:bg-[#4B5563]",
  secondary: "h-[38px] gap-2 rounded-btn border border-muted bg-white px-4 text-[16px] font-medium leading-5 text-muted hover:border-ink hover:text-ink",
  dark: "min-h-[50px] gap-2 rounded-btn bg-ink px-7 py-3.5 text-[15px] font-medium leading-[1.45] text-white hover:bg-black",
  outlineDark: "min-h-[50px] gap-2 rounded-btn border border-ink bg-white px-7 py-3.5 text-[15px] font-medium leading-[1.45] text-ink hover:bg-surface",
  pill: "h-[38px] gap-2 rounded-full border border-muted bg-muted px-5 text-[16px] font-medium leading-5 text-white hover:bg-[#4B5563]",
  pillOutlineLg: "min-h-[46px] gap-3 rounded-full border border-black bg-transparent px-5 py-2.5 text-[17px] font-semibold leading-5 text-black hover:bg-white lg:text-[20px]",
  heroCta: "h-10 gap-2 rounded-[10px] border border-ink/15 bg-[#535353] px-4 text-[14px] font-medium leading-5 text-white shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-[#3f3f3f]",
};

type Common = {
  variant?: ButtonVariant;
  icon?: string;
  /** Icon before the label instead of after */
  iconLeading?: boolean;
  iconSize?: number;
  className?: string;
  children: React.ReactNode;
};

export function Button(
  props: Common &
    (
      | ({ href: string | null } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">)
      | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
    ),
) {
  const { variant = "primary", icon, iconLeading, iconSize = 18, className = "", children, ...rest } = props;
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      {icon && iconLeading && <Icon name={icon} size={iconSize} />}
      {children}
      {icon && !iconLeading && <Icon name={icon} size={iconSize} />}
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...a } = rest as { href: string | null } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <SmartLink href={href} className={cls} {...a}>
        {inner}
      </SmartLink>
    );
  }
  const b = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={cls} {...b}>
      {inner}
    </button>
  );
}
