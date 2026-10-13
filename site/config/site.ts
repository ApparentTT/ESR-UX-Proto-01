/** Navigation content (header menus, markets) lives in config/nav.ts. */

/** Every built page, for the Prototype panel. */
export const PAGES: { group: string; label: string; href: string }[] = [
  { group: "Home", label: "Homepage", href: "/" },
  { group: "Our portfolio", label: "Portfolio overview", href: "/portfolio" },
  { group: "Our portfolio", label: "Properties", href: "/portfolio/properties" },
  { group: "Our portfolio", label: "Developments", href: "/portfolio/developments" },
  { group: "Our portfolio", label: "Data centres", href: "/portfolio/data-centres" },
  { group: "Investor", label: "Invest with ESR", href: "/investors" },
  { group: "Sustainability", label: "Sustainability overview", href: "/sustainability" },
  { group: "Sustainability", label: "Governance and management", href: "/sustainability/governance" },
  { group: "Sustainability", label: "Sustainability case studies", href: "/sustainability/case-studies" },
  { group: "News and insights", label: "News and insights", href: "/news" },
  { group: "News and insights", label: "News search results", href: "/news/search" },
  { group: "About", label: "About us", href: "/about" },
  { group: "About", label: "Our leadership", href: "/about/leadership" },
  { group: "About", label: "Proven capability", href: "/about/proven-capability" },
  { group: "About", label: "Corporate governance", href: "/about/corporate-governance" },
  { group: "About", label: "Our people", href: "/about/our-people" },
  { group: "Contact", label: "Contact us", href: "/contact" },
];

/** Which top-level group a path belongs to, for the active nav state. */
export function activeGroup(pathname: string): string | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/portfolio") || pathname.startsWith("/properties")) return "Our portfolio";
  if (pathname.startsWith("/investors")) return "Investor";
  if (pathname.startsWith("/sustainability")) return "Sustainability";
  if (pathname.startsWith("/news")) return "News and insights";
  if (pathname.startsWith("/about")) return "About";
  return null;
}
