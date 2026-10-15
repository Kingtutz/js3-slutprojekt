import { CountrySummary } from "../types/country.type";
import Link from "next/link";

type CountryListProps = {
    countries: CountrySummary[];
};

function CountryList({ countries }: CountryListProps) {
    if (countries.length === 0) {
        return (
            <p className="p-4 text-center text-[#d6b56e]">
                Inga länder hittades
            </p>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1 p-2">
            {countries.map((c) => {
                const capital =
                    c.capitals?.find((cap) => cap.attributes.primary)?.name ??
                    c.capitals?.[0]?.name;

                return (
                    <div
                        key={c.codes.alpha_3}
                        className="px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
                        <Link
                            className="grid grid-cols-2"
                            href={`/detailpage/${c.codes.alpha_3}`}>
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
