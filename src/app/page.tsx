import CountryList from "./components/country-list";
import Search from "./components/search";
import fetchAllCountries from "./components/get-all";
import Pagination from "./components/pagination";
import RegionSorting from "./components/region-sorting";

const PAGE_SIZE = 24;

async function Home({ searchParams }: PageProps<"/">) {
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
            <CountryList countries={countries} />
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
