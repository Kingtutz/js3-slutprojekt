"use client";
import { useState } from "react";
import { Country } from "../types/country.type";
import Link from "next/link";

type CountryListProps = {
    countries: Country[];
};

function CountryList({ countries }: CountryListProps) {
    const [search, setSearch] = useState("");

    const filtered = countries.filter((c) =>
        c.names.common.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <>
            <input
                className="border w-100 h-10 p-2 m-2 rounded-2xl"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
            />
            <div className="grid grid-cols-3 gap-1 p-2">
                {filtered.map((c) => (
                    <div key={c.cca3} className="border rounded-2xl p-2">
                        <Link href={`/detailpage/${c.cca3}`}>
                            <h2>{c.names.common}</h2>
                            {/* <img
                                src={c.flags.png}
                                alt={c.flags.alt ?? c.names.common}
                                className="max-w-25 max-h-25"
                            /> */}
                            <p>{c.region}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}

export default CountryList;
