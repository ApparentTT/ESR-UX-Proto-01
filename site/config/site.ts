/**
 * Site map for the full-site wireframe prototype, from the Global IA and the designer's user flow.
 * href: null means the page is not wireframed yet, so links to it render inert.
 */
export type NavLink = { label: string; href: string | null; external?: boolean };
export type NavGroup = { label: string; href: string | null; children: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: "Our portfolio",
    href: "/portfolio",
    children: [
      { label: "Portfolio overview", href: "/portfolio" },
      { label: "Properties", href: "/portfolio/properties" },
      { label: "Property search", href: "/properties" },
      { label: "Developments", href: "/portfolio/developments" },
      { label: "Data centres", href: "/portfolio/data-centres" },
      { label: "Infrastructure", href: null },
    ],
  },
  {
    label: "Investor",
    href: "/investors",
    children: [
      { label: "Investors overview", href: "/investors" },
      { label: "Fund pages on local market sites", href: null, external: true },
    ],
  },
  {
    label: "Sustainability",
    href: "/sustainability",
    children: [
      { label: "Sustainability overview", href: "/sustainability" },
      { label: "Governance and management", href: "/sustainability/governance" },
      { label: "Sustainability case studies", href: "/sustainability/case-studies" },
    ],
  },
  {
    label: "News and insights",
    href: "/news",
    children: [
      { label: "All news and insights", href: "/news" },
      { label: "Press releases", href: "/news/search?type=press-release" },
      { label: "Thought leadership", href: "/news/search?type=thought-leadership" },
      { label: "Case studies", href: "/news/search?type=case-study" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About us", href: "/about" },
      { label: "Our leadership", href: "/about/leadership" },
      { label: "Our customers", href: null },
      { label: "Proven capability", href: "/about/proven-capability" },
      { label: "Corporate governance", href: "/about/corporate-governance" },
      { label: "Our people", href: "/about/our-people" },
    ],
  },
];

/** Markets listed on the homepage. Market sites are not part of this prototype. */
export const MARKETS = ["Japan", "Australia and New Zealand", "South Korea", "China", "India"];

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
