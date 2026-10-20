# Var vill du resa?

A travel inspiration app built as the final project (slutprojekt) for JS3. Browse every country in the world, search and filter by region, read facts about each country, and see the current weather in its capital. You can do all of this from a list or from an interactive 3D globe.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS 4**.

## Features

- **Country list.** The start page shows all countries as cards with flag, name, region and capital, 24 per page.
- **Search.** Filter countries by name from the search bar in the navigation.
- **Region filter.** Show only countries in one region (Africa, Americas, Asia, Europe, Oceania…). Search, region and page live in the URL (`/?q=swe&region=Europe&page=2`), so you can share or bookmark any view.
- **Country page.** `/country/SWE` shows the flag, official and native names, a description, capital, area, currencies, languages and alternate names.
- **Live weather.** Every country page shows current temperature, feels-like, humidity and wind in the capital.
- **3D globe.** `/globe` shows a rotatable globe with every country's flag and its current temperature. Clicking a flag opens the country as a popup on top of the globe. If you reload that URL, you get the normal country page.

## Getting started

### 1. Install

```bash
npm install
```

### 2. Add an API key

Country data comes from [REST Countries](https://restcountries.com), which requires a free API key. Sign up at https://restcountries.com/sign-up, then copy `.env.example` to `.env.local` and add your key:

```
RESTCOUNTRIES_API_KEY=your_key_here
```

Without a key, every request returns **401 Unauthorized** and no countries will load. Restart the dev server after you change `.env.local`.

The weather API ([Open-Meteo](https://open-meteo.com)) needs no key.

### 3. Run

```bash
npm run dev
```

Open http://localhost:3000.

| Script          | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server             |
| `npm run build` | Build for production             |
| `npm start`     | Run the production build         |
| `npm run lint`  | Run ESLint                       |

## How it works

### Data sources

| API | Used for | Caching |
| --- | --- | --- |
| REST Countries v5 | All countries (list and globe) and single-country details | Cached for days, because country data rarely changes |
| Open-Meteo | Current weather for a country page | Cached for minutes, because Open-Meteo updates every 15 min |
| Open-Meteo (batched) | Temperatures for every flag on the globe | Cached for hours, to stay inside the free tier's 10,000 calls/day |

All fetching happens in **Server Components**, so the API key never reaches the browser. Caching uses Next.js's `"use cache"` directive with `cacheLife(...)` (enabled through `cacheComponents: true` in [next.config.ts](next.config.ts)).

The REST Countries API returns at most 100 countries per request. [get-all.tsx](src/app/components/get-all.tsx) keeps requesting with a growing `offset` until `meta.more` is false. It also asks only for the fields the list needs, through `response_fields`.

The globe needs weather for about 250 places. [globe-weather.ts](src/app/globe/components/globe-weather.ts) sends them to Open-Meteo in chunks of 100 coordinates per request. If a chunk fails, those flags just show no temperature, and the rest of the globe still works.

### Routing

```
src/app/
├── page.tsx                      /               Country list (search, region, pagination)
├── country/[code]/page.tsx       /country/SWE    Full country page
├── globe/
│   ├── page.tsx                  /globe          3D globe
│   ├── layout.tsx                Renders the page plus the @modal slot
│   └── @modal/(..)country/[code] Intercepts /country/[code] and shows it as a popup
└── not-found.tsx                 404 page
```

The globe popup uses Next.js **parallel routes** (`@modal`) together with **intercepting routes** (`(..)country`). When you click a flag on the globe, the URL changes to `/country/XXX`, but Next.js renders the country inside a modal instead of leaving the globe. Both the popup and the full page use the same [CountryDetail](src/app/components/country-detail.tsx) component.

Countries are identified by their three-letter code (`alpha_3`). A few disputed territories have no code, so they use their name instead (see [country-href.ts](src/app/lib/country-href.ts)).

### Weather location

[weather-location.ts](src/app/lib/weather-location.ts) chooses where to get weather for. It uses the country's primary capital if it has one, and otherwise the country's geographic centre. The country page and the globe share this logic, so they always show the same temperature.

### Loading states

Pages that depend on the URL or on slow requests are wrapped in `<Suspense>`, so the layout shows immediately with a "Loading…" fallback. The globe uses WebGL, which only exists in the browser, so it is loaded with `next/dynamic` and `ssr: false`.

## Project structure

```
src/app/
├── components/
│   ├── get-all.tsx          Fetches all countries (paginated API calls)
│   ├── country-detail.tsx   Fetches and shows one country
│   ├── country-list.tsx     Grid of country cards
│   ├── weather.tsx          Current weather box
│   ├── search.tsx           Search form (keeps the selected region)
│   ├── region-sorting.tsx   Region filter buttons
│   ├── pagination.tsx       Previous/next links
│   └── nav.tsx              Top navigation
├── lib/
│   ├── country-href.ts      Builds /country/... links
│   ├── home-href.ts         Builds / links with q, region and page
│   └── weather-location.ts  Picks the coordinates for weather
├── globe/components/        Globe (react-globe.gl), popup modal, batched weather
└── types/country.type.ts    TypeScript types for the REST Countries API
```

## Deployment

The project is deployed on Vercel. Add `RESTCOUNTRIES_API_KEY` under **Project → Settings → Environment Variables**, then redeploy.
