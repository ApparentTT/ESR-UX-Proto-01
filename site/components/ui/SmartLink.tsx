import Link from "next/link";
import { InertLink } from "./InertLink";

/** A link to a built page, or an inert link when the page is not wireframed (href null). */
export function SmartLink({
  href,
  children,
  className = "",
  ...rest
}: { href: string | null; children: React.ReactNode; className?: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  if (!href) return <InertLink className={className} {...rest}>{children}</InertLink>;
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
