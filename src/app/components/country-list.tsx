import { CountrySummary } from "../types/country.type";
import Link from "next/link";
import { countryHref, countryId } from "../lib/country-href";

type CountryListProps = {
    countries: CountrySummary[];
    // Current search, region and page, kept in the links so Back returns here
    homeSearch: string;
};

function CountryList({ countries, homeSearch }: CountryListProps) {
    if (countries.length === 0) {
        return (
            <p className="p-4 text-center text-[#d6b56e]">
                Inga länder hittades
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 sm:gap-1 sm:p-2 lg:grid-cols-3">
            {countries.map((c) => {
                const capital =
                    c.capitals?.find((cap) => cap.attributes.primary)?.name ??
                    c.capitals?.[0]?.name;

                return (
                    <div
                        key={countryId(c)}
                        className="px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
                        <Link
                            className="grid grid-cols-[96px_1fr] items-center gap-4 sm:grid-cols-2 sm:items-start sm:gap-0"
                            href={countryHref(c, homeSearch)}>
                            <div>
                                {(c.flag.url_svg || c.flag.url_png) && (
                                    <img
                                        src={c.flag.url_svg || c.flag.url_png}
                                        alt={`Flag of ${c.names.common}`}
                                        className="max-w-25 max-h-25 border border-[#d6b56e]"
                                    />
                                )}
                            </div>
                            <div>
                                <h2 className="text-[#d6b56e]">
                                    Name: {c.names.common}
                                </h2>
                                <p>Region: {c.region}</p>
                                {capital && <p>Capital: {capital}</p>}
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

export default CountryList;
