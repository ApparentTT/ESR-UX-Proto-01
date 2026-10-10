# ESR global website — wireframe prototype

Clickable greyscale prototype of the ESR global website, built from the Figma key and primary wireframes and the designer's user flow, for client review. It includes the property search prototype, unchanged, under Our portfolio.

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
| Contact | Contact us | `/contact` |

Use the **Prototype** badge (bottom right) to jump to any page, or to any state of the property search.

## How it behaves

- Links to pages that are not wireframed yet (Infrastructure, Our customers, fund pages, articles, case study and property details, market sites, social links, PDFs) are inert. Clicking one shows a short "This page is not part of the prototype" notice.
- Filters on news, case studies and the fund table work over the sample records. Forms validate required fields and show a confirmation without sending anything.
- The header search goes to the news search results page.

## Editing

- **Navigation and the page list:** `config/site.ts`. Set a nav item's `href` to `null` to make it inert.
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
