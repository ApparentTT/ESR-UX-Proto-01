"use client";

/** A nav link outside the search flow. Looks and focuses like a link but goes nowhere in this prototype. */
export function InertLink({
  children,
  className = "",
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      title="Not part of this prototype"
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}
