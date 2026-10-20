import { Suspense } from "react";
import CountryList from "./components/country-list";
import Search from "./components/search";
import fetchAllCountries from "./components/get-all";
import Pagination from "./components/pagination";
import RegionSorting from "./components/region-sorting";
import { homeHref } from "./lib/home-href";

const PAGE_SIZE = 24;

function Home({ searchParams }: PageProps<"/">) {
    return (
        <Suspense
            fallback={<p className="p-4 text-[#d6b56e]">Loading countries...</p>}>
            <Countries searchParams={searchParams} />
        </Suspense>
    );
}

// Reads searchParams at request time, so it must render inside <Suspense>
async function Countries({
    searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
    const { page, q, region } = await searchParams;
    const query = typeof q === "string" ? q.trim() : "";
    const activeRegion = typeof region === "string" ? region : "";

    const allCountries = await fetchAllCountries();
    const regions = [
        ...new Set(allCountries.map((c) => c.region).filter(Boolean)),
    ].sort();

    const matches = allCountries.filter(
        (c) =>
            (!activeRegion || c.region === activeRegion) &&
            c.names.common.toLowerCase().includes(query.toLowerCase()),
    );

    const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
    const currentPage = Math.min(totalPages, Math.max(1, Number(page) || 1));
    const offset = (currentPage - 1) * PAGE_SIZE;
    const countries = matches.slice(offset, offset + PAGE_SIZE);

    return (
        <>
            <RegionSorting
                regions={regions}
                activeRegion={activeRegion}
                query={query}
            />
            <CountryList
                countries={countries}
                // "/?q=...&region=..." → "?q=...&region=..."
                homeSearch={homeHref({
                    query,
                    region: activeRegion,
                    page: currentPage,
                }).slice(1)}
            />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                query={query}
                region={activeRegion}
            />
        </>
    );
}
export default Home;
