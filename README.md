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

Filter panels open with `panel=location|type|size|avail`; the mobile map with `view=map`; drawing an area with `draw=1`. These helper params are stripped after opening, so the URL only ever carries the search.

## Draw your own area

Press **Draw your own area** on the map (or the option in the Location and All filters panels). Press and drag to draw freehand, or click to place points and click the first point, double-click or press **Done** to finish. From the keyboard: arrow keys move the map, Enter places a point at the centre cross, Backspace removes it, Escape cancels. The drawn area replaces any typed place or prefecture, appears as a removable **Drawn area** chip and is written to the URL.

## URL parameters

`q` place or estate text · `pref` prefectures · `type` property types · `min` / `max` sqm · `avail` `now|6m|12m` · `pre=1` include pre-lease and build to suit · `sus` / `amen` sustainability and amenity · `bbox` map area from Search this area · `area` drawn area as `lat_lng` points, comma separated (e.g. `area=35.620_139.600,35.600_139.830,35.450_139.830,35.300_139.690,35.380_139.520`) · `sort` `size|availability`

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
