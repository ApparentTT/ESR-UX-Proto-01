/** Navigation content (header menus, markets) lives in config/nav.ts. */

/** Every built page, for the Prototype panel. */
export const PAGES: { group: string; label: string; href: string }[] = [
  { group: "Home", label: "Homepage", href: "/" },
  { group: "Our portfolio", label: "Portfolio overview", href: "/portfolio" },
  { group: "Our portfolio", label: "Properties", href: "/portfolio/properties" },
  { group: "Our portfolio", label: "Developments", href: "/portfolio/developments" },
  { group: "Our portfolio", label: "Data centres", href: "/portfolio/data-centres" },
  { group: "Investor", label: "Invest with ESR", href: "/investors" },
  { group: "Investor", label: "Fund detail", href: "/investors/funds/flagship-fund-1" },
  { group: "Sustainability", label: "Sustainability overview", href: "/sustainability" },
  { group: "Sustainability", label: "Governance and management", href: "/sustainability/governance" },
  { group: "Sustainability", label: "Sustainability case studies", href: "/sustainability/case-studies" },
  { group: "News and insights", label: "News and insights", href: "/news" },
  { group: "News and insights", label: "News search results", href: "/news/search" },
  { group: "News and insights", label: "Article detail", href: "/news/esr-announces-strategic-expansion-into-the-middle-east" },
  { group: "About", label: "About us", href: "/about" },
  { group: "About", label: "Our leadership", href: "/about/leadership" },
  { group: "About", label: "Proven capability", href: "/about/proven-capability" },
  { group: "About", label: "Corporate governance", href: "/about/corporate-governance" },
  { group: "About", label: "Our people", href: "/about/our-people" },
  { group: "About", label: "Our customers", href: "/about/our-customers" },
  { group: "About", label: "Stay up to date on vacancies", href: "/about/careers/job-alerts" },
  { group: "Contact", label: "Contact us", href: "/contact" },
  { group: "Search", label: "Site search results", href: "/search" },
  // The Japan local market site (local header and footer, components/layout/local)
  { group: "Local market (Japan)", label: "Japan homepage", href: "/jp" },
  { group: "Local market (Japan)", label: "Our portfolio", href: "/jp/portfolio" },
  { group: "Local market (Japan)", label: "Properties", href: "/jp/properties" },
  { group: "Local market (Japan)", label: "Developments", href: "/jp/developments" },
  { group: "Local market (Japan)", label: "Property tours", href: "/jp/property-tours" },
  { group: "Local market (Japan)", label: "News and insights", href: "/jp/news" },
  { group: "Local market (Japan)", label: "Article detail (press release)", href: "/jp/news/esr-appoints-reini-otter-as-ceo-of-australia-and-new-zealand-business" },
  { group: "Local market (Japan)", label: "Article detail (media)", href: "/jp/news/jp-news-02" },
  { group: "Local market (Japan)", label: "About us", href: "/jp/about" },
  { group: "Local market (Japan)", label: "Our leadership", href: "/jp/leadership" },
  { group: "Local market (Japan)", label: "Property detail", href: "/jp/properties/higashi-ogishima-distribution-centre-2" },
  { group: "Local market (Japan)", label: "Our people", href: "/jp/our-people" },
  { group: "Local market (Japan)", label: "Our customers", href: "/jp/our-customers" },
  { group: "Local market (Japan)", label: "Proven capability", href: "/jp/proven-capability" },
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
