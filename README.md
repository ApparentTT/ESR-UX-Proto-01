# ESR property search — wireframe prototype

Clickable greyscale prototype of the ESR Japan property search, built from the Figma wireframes for client review. Search only; every other nav link is inert.

Content and imagery are placeholder, figures are indicative and the map is simulated. Only Higashi-Ogishima Distribution Centre 2 carries published figures; every other card shows `[GFA TBC]` / `[Status TBC]`.

## States

Use the **Prototype** badge (bottom right) to jump to any of these:

| State | URL |
| --- | --- |
| 1. First visit | `/properties` |
| 2. All filters panel | `/properties/search?…&panel=all` |
| 3. Results | `/properties/search` |
| 4. Results with filters applied | `/properties/search?pref=kanagawa,tokyo&type=logistics,business-park&min=5000&max=20000&avail=12m` |
| 5. Results scrolled | `/properties/search?pref=kanagawa&demo=scrolled` |
| 6. No results | `/properties/search?q=aomori&type=cold-storage&min=20000` |

Filter panels open with `panel=location|type|size|avail`; the mobile map with `view=map`. These helper params are stripped after opening, so the URL only ever carries the search.

## URL parameters

`q` place or estate text · `pref` prefectures · `type` property types · `min` / `max` sqm · `avail` `now|6m|12m` · `pre=1` include pre-lease and build to suit · `sus` / `amen` sustainability and amenity · `bbox` map area · `sort` `size|availability`

## Editing

- **Properties:** `data/properties.ts`, one record per line. Regenerate with `node --experimental-strip-types scripts/generate-properties.ts` (this overwrites hand edits).
- **Market and region label:** `config/market.ts`. Switch `MARKET` to change "prefecture" to state, province or district.
- **Prototype switches:** `config/prototype.ts`. `SHOW_INDICATIVE_FIGURES` shows the indicative sizes behind the filters instead of `[GFA TBC]`. `PAGE_SIZE` sets the batch size (12), and `LOAD_DELAY_MS` the simulated loading delay.
- **Design tokens:** `app/globals.css`.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000/properties.

## Deploy

Import this repository at https://vercel.com/new. Vercel detects Next.js, so leave every setting at its default and press **Deploy**. Every push to the default branch then redeploys automatically.

Stack: Next.js (App Router), TypeScript, Tailwind CSS. No backend, CMS, database or API keys.
