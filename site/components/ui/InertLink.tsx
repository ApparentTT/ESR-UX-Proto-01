"use client";

import { INERT_EVENT } from "@/components/prototype/InertNotice";

/** A nav link outside the search flow. Looks and focuses like a link but goes nowhere in this prototype. */
export function InertLink({
  children,
  className = "",
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href="#"
      title="Not part of this prototype"
      className={className}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        window.dispatchEvent(new Event(INERT_EVENT));
      }}
    >
      {children}
    </a>
  );
}
