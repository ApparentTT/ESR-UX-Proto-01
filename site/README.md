# ESR group website — wireframe prototype

Clickable greyscale prototype of the ESR group website, built from the Figma key and primary wireframes and the designer's user flow, for client review. It includes the property search prototype, unchanged, under Our portfolio.

Content and imagery are placeholder, figures are indicative and the map is simulated. Copy is taken word for word from the wireframes, including lorem ipsum and `[bracketed placeholders]`.

This app lives in `site/`. The repository root holds the original property search prototype, which is locked and deployed separately.

## Pages

| Section | Page | URL |
| --- | --- | --- |
| Home | Homepage | `/` |
| Our portfolio | Portfolio overview | `/portfolio` |
| | Properties | `/portfolio/properties` |
| | Property search | `/properties`, `/properties/search` |
| | Developments | `/portfolio/developments` |
| | Data centres | `/portfolio/data-centres` |
| Investor | Invest with ESR | `/investors` |
| Sustainability | Sustainability overview | `/sustainability` |
| | Governance and management | `/sustainability/governance` |
| | Sustainability case studies | `/sustainability/case-studies` |
| News and insights | News and insights | `/news` |
| | News search results | `/news/search` (`?q=`, `?type=press-release\|thought-leadership\|case-study`, `?market=`, `?topic=`) |
| About | About us | `/about` |
| | Our leadership | `/about/leadership` |
| | Proven capability | `/about/proven-capability` |
| | Corporate governance | `/about/corporate-governance` |
| | Our people | `/about/our-people` |
| | Our customers | `/about/our-customers` |
| Contact | Contact us | `/contact` |
| Search | Site search results | `/search?q=` |
| Funds | Fund detail (placeholder, same content for every fund) | `/investors/funds/<fund>` |

### Japan local market site

Every market in **Find your market** (and the homepage market cards) goes to the Japan local site for now, so the client can compare the group and local templates. It has its own local navigation and footer.

| Page | URL |
| --- | --- |
| Local homepage | `/jp` |
| Portfolio overview | `/jp/portfolio` |
| Properties | `/jp/properties` |
| Developments | `/jp/developments` |
| Proven capability | `/jp/proven-capability` |
| News and insights | `/jp/news` |
| About | `/jp/about` |
| Property detail (same content for every property) | `/jp/properties/<property>` |
| Our leadership | `/jp/leadership` |
| Our people | `/jp/our-people` |
| Our customers | `/jp/our-customers` |
| Property tours | `/jp/property-tours` |

Use the **Prototype** badge (bottom right) to jump to any page, or to any state of the property search.

## How it behaves

- Links to pages that are not wireframed yet (Infrastructure, articles, case study details, social links, PDFs and downloads) are inert. Clicking one shows a short "This page is not part of the prototype" notice.
- Filters on news, case studies and the fund table work over the sample records. Forms validate required fields and show a confirmation without sending anything.
- The header menus open on click (Enter or Space) and close on Escape, the overlay, or another menu. While one is open, resting the pointer on another section switches to it.
- The Japan property detail page has Share (copy link, email, LinkedIn, X, LINE), a Downloads menu (brochure and floor plans, placeholders), Export page as PDF (the browser's print dialog with a print layout), a sticky Enquire now bar, working unit filters, and an enquiry form that unit links pre-fill.
- "Industries we serve" on Our customers is interactive: hover or tap a segment or a sector to open its details.
- The header search covers the whole site (group and Japan pages, news, case studies, leaders, documents, funds): typing shows the top matches, and Enter opens the full results page at `/search`. `/news/search` stays as the news-only search.

## Editing

- **Navigation:** `config/nav.ts` holds the header menus, mobile menu and market list (`components/layout/nav/` renders them). Set a link's `href` to `null` to make it inert.
- **Page list** (Prototype badge, header search): `config/site.ts`.
- **Page copy:** `data/site/*.ts` (shared sets such as leaders, news, offices, funds) and `data/site/pages/*.ts` (page-specific copy).
- **Sections:** `components/sections/<family>/`. Pages in `app/<route>/page.tsx` assemble them.
- **Design tokens:** `app/globals.css`. Type scale: `components/ui/type.ts`.
- **Property search:** `components/search`, `components/firstvisit`, `lib` and `data/properties.ts`, as in the original prototype.

## Run locally

```bash
cd site
npm install
npm run dev   # http://localhost:3000
```

## Deploy on Vercel

Import the repository as a new Vercel project and set **Root Directory** to `site`. The framework preset (Next.js) and build settings are detected automatically. This gives the full-site prototype its own URL, separate from the locked search prototype at the repository root.
