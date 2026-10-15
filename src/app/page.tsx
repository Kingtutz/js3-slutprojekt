import CountryList from "./components/country-list";
import { CountriesResponse } from "./types/country.type";

async function Home() {
    const res = await fetch(
        "https://api.restcountries.com/countries/v5?limit=25&offset=25",
        {
            headers: {
                Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}`,
            },
        },
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch countries: ${res.status}`);
    }

    const json: CountriesResponse = await res.json();
    const countries = json.data.objects;
    const { names, ...rest } = countries[0];
    console.log(JSON.stringify(rest, null, 2).slice(0, 3000));

    return (
        <>
            <CountryList countries={countries} />
        </>
    );
}
export default Home;
