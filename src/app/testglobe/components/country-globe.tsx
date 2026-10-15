"use client";

import dynamic from "next/dynamic";
import { CountrySummary } from "../../types/country.type";

// The globe uses WebGL, which only exists in the browser, so skip server rendering
const GlobeView = dynamic(() => import("./globe-view"), {
    ssr: false,
    loading: () => <p className="p-4 text-[#d6b56e]">Loading globe...</p>,
});

type CountryGlobeProps = {
    countries: CountrySummary[];
};

function CountryGlobe({ countries }: CountryGlobeProps) {
    return <GlobeView countries={countries} />;
}

export default CountryGlobe;
