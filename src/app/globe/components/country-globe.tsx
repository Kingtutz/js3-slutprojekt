"use client";

import dynamic from "next/dynamic";
import { CountrySummary } from "../../types/country.type";
import { GlobeWeather } from "./globe-weather";

// The globe uses WebGL, which only exists in the browser, so skip server rendering
const GlobeView = dynamic(() => import("./globe-view"), {
    ssr: false,
    loading: () => <p className="p-4 text-[#d6b56e]">Laddar glob...</p>,
});

type CountryGlobeProps = {
    countries: CountrySummary[];
    weather: Record<string, GlobeWeather>;
};

function CountryGlobe({ countries, weather }: CountryGlobeProps) {
    return <GlobeView countries={countries} weather={weather} />;
}

export default CountryGlobe;
