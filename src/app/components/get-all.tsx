import { cacheLife } from "next/cache";
import {
    CountriesResponse,
    CountrySummary,
} from "../types/country.type";

// The free plan caps each request at 100 countries
const PAGE_SIZE = 100;

async function fetchPage(offset: number) {
    const url =
        `https://api.restcountries.com/countries/v5?limit=${PAGE_SIZE}&offset=${offset}` +
        `&response_fields=names.common,codes.alpha_2,codes.alpha_3,flag.emoji,flag.url_svg,flag.url_png,region,capitals,coordinates`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}`,
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data }: CountriesResponse<CountrySummary> = await res.json();
    return data;
}

async function fetchAllCountries(): Promise<CountrySummary[]> {
    "use cache";
    cacheLife("days");

    // The first page tells us the total, so the rest can be fetched in parallel.
    // Fetching them one by one is slow enough to trip Next's dev hang detection.
    const first = await fetchPage(0);
    const offsets: number[] = [];
    for (let o = first.meta.count; o < first.meta.total; o += PAGE_SIZE) {
        offsets.push(o);
    }
    const rest = await Promise.all(offsets.map(fetchPage));
    return [first, ...rest].flatMap((page) => page.objects);
}
export default fetchAllCountries;
