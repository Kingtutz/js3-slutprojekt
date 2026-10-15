import fetchAllCountries from "../components/get-all";
import CountryGlobe from "./components/country-globe";

async function TestGlobePage() {
    const countries = await fetchAllCountries();

    return <CountryGlobe countries={countries} />;
}
export default TestGlobePage;
