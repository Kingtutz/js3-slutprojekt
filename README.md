# Var vill du resa?

En reseapp byggd som slutprojekt i JavaScript 3 (HT26). Appen visar alla världens länder i en paginerad lista med sökfält och regionfilter. Varje land har en egen sida med basfakta, aktuellt väder i huvudstaden och en introtext med bild från Wikipedia. Det finns också en 3D-glob där man kan klicka på länder.

**Deployad app:** https://js3-slutprojekt-public.vercel.app

## Funktioner

- **Landlista.** Startsidan visar länderna som kort med flagga, namn, region och huvudstad, 24 per sida.
- **Sök.** Sökfältet i navbaren filtrerar länderna på namn.
- **Regionfilter.** Knappar för varje region plus *All*. Ny sökning eller ny region börjar om på sida 1.
- **URL-state.** Sida, sökord och region ligger i URL:en (`/?q=fin&region=Europe&page=2`), så en vy kan laddas om, delas och bläddras med bakåtknappen.
- **Detaljsida.** `/country/SWE` visar landets namn, namn på landets egna språk, huvudstad, yta, språk och valuta. En ogiltig kod (t.ex. `/country/XYZ`) visar "Landet hittades inte".
- **Väder.** Aktuell temperatur, vind, upplevd temperatur och luftfuktighet i huvudstaden.
- **Wikipedia.** Introtext med bild, källhänvisning och länk till hela artikeln.
- **Tillbaka-länk.** Tar dig tillbaka till listan med samma sökning, region och sida som innan.
- **3D-glob.** `/globe` visar en snurrbar glob med varje lands flagga och temperatur. Klickar man på en flagga öppnas landet i en popup ovanpå globen.

## Kom igång

### 1. Installera

```bash
npm install
```

### 2. Lägg in API-nyckel

Landdata kommer från [REST Countries v5](https://restcountries.com), som kräver en gratis API-nyckel. Skapa ett konto på https://restcountries.com/sign-up, kopiera `.env.example` till `.env.local` och lägg in nyckeln:

```
RESTCOUNTRIES_API_KEY=din_nyckel_här
```

Starta om dev-servern efter att du ändrat `.env.local`. Open-Meteo och Wikipedia kräver ingen nyckel.

### 3. Kör

```bash
npm run dev
```

Öppna http://localhost:3000.

| Skript          | Vad det gör                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Startar dev-servern          |
| `npm run build` | Bygger för produktion        |
| `npm start`     | Kör produktionsbygget        |
| `npm run lint`  | Kör ESLint                   |

## Ramverk: varför Next.js?

Jag valde **Next.js 16 (App Router)** med React 19, TypeScript och Tailwind CSS 4.

- **API-nyckeln stannar på servern.** All data hämtas i Server Components, så nyckeln till REST Countries skickas aldrig till webbläsaren. Med Vite hade nyckeln (`VITE_…`) gått att läsa i webbläsaren.
- **Inbyggd cache.** Next.js `"use cache"` och `cacheLife(...)` gör att samma data inte hämtas om i onödan, utan att jag behöver ett extra bibliotek.
- **Routing i filsystemet.** `/country/[code]`, en egen 404-sida (`not-found.tsx`) och felsida (`error.tsx`) följer med App Router. Parallel routes och intercepting routes gör det möjligt att visa ett land som popup på globen.

## Fördjupningar

### Obligatoriskt VG-krav: REST Countries v5

Appen använder REST Countries v5 med egen nyckel (se ovan). API:et ger högst 100 länder per anrop. [get-all.tsx](src/app/components/get-all.tsx) hämtar därför första sidan, läser hur många länder det finns totalt och hämtar resten parallellt med olika `offset`. Med `response_fields` hämtas bara de fält listan behöver.

Vädret använder huvudstadens koordinater från REST Countries. Om landet saknar huvudstad används landets mittpunkt ([weather-location.ts](src/app/lib/weather-location.ts)).

### Cache

Data hämtas inte om i onödan. Olika data har olika cache-tid beroende på hur ofta den ändras:

| API | Används till | Cache-tid | Varför |
| --- | --- | --- | --- |
| REST Countries v5 | Alla länder och enskilda länder | Dagar | Landdata ändras nästan aldrig |
| Wikipedia | Introtext och bild | Dagar | Artiklarnas sammanfattning ändras sällan |
| Open-Meteo | Aktuellt väder på detaljsidan | Minuter | Open-Meteo uppdaterar aktuellt väder var 15:e minut |
| Open-Meteo (batch) | Temperatur för alla flaggor på globen | Timmar | Ca 250 platser, så kortare cache skulle snabbt äta upp gratiskvoten |

Cachen ligger på servern (`cacheComponents: true` i [next.config.ts](next.config.ts)). Därför syns anropen till API:erna inte i webbläsarens Network-flik. Där syns bara Next.js egna förfrågningar mellan webbläsare och server.

## Hur appen fungerar

### Routing

```
src/app/
├── page.tsx                      /               Landlista (sök, region, paginering)
├── country/[code]/page.tsx       /country/SWE    Detaljsida
├── globe/
│   ├── page.tsx                  /globe          3D-glob
│   ├── layout.tsx                Visar sidan plus @modal-slotten
│   └── @modal/(..)country/[code] Fångar /country/[code] och visar landet som popup
├── error.tsx                     Felsida
└── not-found.tsx                 404-sida
```

Länder identifieras med sin trebokstavskod (`alpha_3`). Några omstridda områden saknar kod och använder därför namnet i stället ([country-href.ts](src/app/lib/country-href.ts)).

### Laddning och fel

Sidor som beror på URL:en eller långsamma anrop ligger i `<Suspense>`, så layouten visas direkt med en spinner eller laddningstext. Väder och Wikipedia ligger i egna `<Suspense>`-block och hämtas oberoende av landdatan. Om något av dem svarar med ett fel visas resten av detaljsidan ändå.

### Projektstruktur

```
src/app/
├── components/
│   ├── get-all.tsx          Hämtar alla länder (flera anrop med offset)
│   ├── country-detail.tsx   Hämtar och visar ett land
│   ├── country-list.tsx     Grid med landkort
│   ├── weather.tsx          Aktuellt väder
│   ├── wiki-intro.tsx       Introtext och bilder från Wikipedia
│   ├── search.tsx           Sökformulär (behåller vald region)
│   ├── region-sorting.tsx   Regionknappar
│   ├── pagination.tsx       Föregående/nästa
│   └── nav.tsx              Navbar
├── lib/
│   ├── country-href.ts      Bygger länkar till /country/...
│   ├── home-href.ts         Bygger länkar till / med q, region och page
│   └── weather-location.ts  Väljer koordinater för vädret
├── globe/components/        Globen (react-globe.gl), popup och väder i batch
└── types/country.type.ts    TypeScript-typer för REST Countries-svaret
```

## Deployment

Appen är deployad på Vercel: https://js3-slutprojekt-public.vercel.app

`RESTCOUNTRIES_API_KEY` ligger som miljövariabel under **Project → Settings → Environment Variables** i Vercel.

## AI-redovisning

<!-- TODO: Fyll i vilka AI-verktyg du har använt och till vad. -->

- **Claude (Claude Code):** gick igenom projektet mot uppgiftens krav och skrev ett utkast till denna README.
- *Fyll i övriga verktyg och vad du använde dem till, t.ex. felsökning, förklaringar eller kodförslag.*

Jag kan förklara all kod i projektet, även den jag fått hjälp med.

## Reflektion

<!-- TODO: Skriv 3–5 meningar med dina egna ord. -->

*Vad gick bra? Vad var svårast? Vad skulle du göra annorlunda nästa gång?*
