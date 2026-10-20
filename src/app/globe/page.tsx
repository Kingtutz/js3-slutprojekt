import { Suspense } from "react";
import fetchAllCountries from "../components/get-all";
import CountryGlobe from "./components/country-globe";
import { fetchGlobeWeather, GlobeWeather } from "./components/globe-weather";
import { countryId } from "../lib/country-href";
import { weatherLocation } from "../lib/weather-location";

function GlobePage() {
    return (
        <Suspense fallback={<p className="p-4 text-[#d6b56e]">Loading globe...</p>}>
            <GlobeWithCountries />
        </Suspense>
    );
}

async function GlobeWithCountries() {
    const countries = await fetchAllCountries();

    // Same place as the weather in the country popup, so the numbers match
    const located = countries.flatMap((c) => {
        const point = weatherLocation(c.capitals, c.coordinates);
        return point ? [{ id: countryId(c), point }] : [];
    });
    const results = await fetchGlobeWeather(located.map((l) => l.point));

    const weather: Record<string, GlobeWeather> = {};
    located.forEach((l, i) => {
        const result = results[i];
        if (result) weather[l.id] = result;
    });

    return <CountryGlobe countries={countries} weather={weather} />;
}
export default GlobePage;
