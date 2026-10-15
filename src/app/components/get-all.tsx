import { cacheLife } from "next/cache";
import {
    CountriesResponse,
    CountrySummary,
} from "../types/country.type";

async function fetchAllCountries(): Promise<CountrySummary[]> {
    "use cache";
    cacheLife("days");

    const all: CountrySummary[] = [];
    let offset = 0,
        more = true;
    while (more) {
        const url =
            `https://api.restcountries.com/countries/v5?limit=100&offset=${offset}` +
            `&response_fields=names.common,codes.alpha_2,codes.alpha_3,flag.emoji,flag.url_svg,flag.url_png,region,capitals,coordinates`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}`,
            },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data }: CountriesResponse<CountrySummary> = await res.json();
        all.push(...data.objects);
        more = data.meta.more;
        offset += data.meta.count;
    }
    return all;
}
export default fetchAllCountries;
