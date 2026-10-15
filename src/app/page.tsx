import Link from "next/link";
import CountryList from "./components/country-list";
import Search from "./components/search";
import { CountriesResponse } from "./types/country.type";

const PAGE_SIZE = 25;

async function Home({ searchParams }: PageProps<"/">) {
    const { page, q } = await searchParams;
    const query = typeof q === "string" ? q.trim() : "";
    const currentPage = Math.max(1, Number(page) || 1);
    const offset = (currentPage - 1) * PAGE_SIZE;

    const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
    });
    if (query) params.set("q", query);

    const pageHref = (p: number) =>
        query ? `/?q=${encodeURIComponent(query)}&page=${p}` : `/?page=${p}`;

    const res = await fetch(
        `https://api.restcountries.com/countries/v5?${params}`,
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
    const hasNextPage = countries.length === PAGE_SIZE;

    return (
        <>
            <Search query={query} />
            <CountryList countries={countries} />
            <nav className="flex gap-4 items-center justify-center p-4">
                {currentPage > 1 && (
                    <Link href={pageHref(currentPage - 1)}>Previous</Link>
                )}
                <span>Page {currentPage}</span>
                {hasNextPage && (
                    <Link href={pageHref(currentPage + 1)}>Next</Link>
                )}
            </nav>
        </>
    );
}
export default Home;
