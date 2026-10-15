import { Country } from "../types/country.type";
import Link from "next/link";

type CountryListProps = {
    countries: Country[];
};

function CountryList({ countries }: CountryListProps) {
    return (
        <div className="grid grid-cols-3 gap-1 p-2">
            {countries.map((c) => (
                <div key={c.names.common} className="border rounded-2xl p-2">
                    <Link
                        href={`/detailpage/${encodeURIComponent(c.names.common)}`}>
                        <h2>{c.names.common}</h2>
                        {(c.flag.url_svg || c.flag.url_png) && (
                            <img
                                src={c.flag.url_svg || c.flag.url_png}
                                alt={c.flag.description || c.names.common}
                                className="max-w-25 max-h-25"
                            />
                        )}
                        <p>{c.region}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default CountryList;
