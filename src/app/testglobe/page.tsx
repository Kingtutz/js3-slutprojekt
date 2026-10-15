import { Suspense } from "react";
import fetchAllCountries from "../components/get-all";
import CountryGlobe from "./components/country-globe";

function TestGlobePage() {
    return (
        <Suspense fallback={<p className="p-4 text-[#d6b56e]">Loading globe...</p>}>
            <GlobeWithCountries />
        </Suspense>
    );
}

async function GlobeWithCountries() {
    const countries = await fetchAllCountries();

    return <CountryGlobe countries={countries} />;
}
export default TestGlobePage;
