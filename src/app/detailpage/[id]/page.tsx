import { Suspense } from "react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountriesResponse } from "../../types/country.type";

async function fetchCountry(code: string): Promise<CountriesResponse> {
    "use cache";
    cacheLife("days");

    const res = await fetch(
        `https://api.restcountries.com/countries/v5/codes.alpha_3/${encodeURIComponent(code)}`,
        {
            headers: {
                Authorization: `Bearer rc_live_c28990d38d7d45e59ccc844a2cec566c`,
            },
        },
    );
    // Unknown codes come back as 404, which the page turns into notFound()
    if (res.status === 404) {
        return { data: { objects: [], meta: { count: 0, more: false } } };
    }
    if (!res.ok) {
        throw new Error(`Failed to fetch country: ${res.status}`);
    }

    return res.json();
}

function DetailPage({ params }: PageProps<"/detailpage/[id]">) {
    return (
        <Suspense fallback={<p className="p-4">Loading country...</p>}>
            <CountryDetail params={params} />
        </Suspense>
    );
}

// Reads params at request time, so it must render inside <Suspense>
async function CountryDetail({
    params,
}: Pick<PageProps<"/detailpage/[id]">, "params">) {
    const { id } = await params;
    const code = id.toUpperCase();

    const json = await fetchCountry(code);
    const country = json.data.objects[0];

    if (!country) {
        notFound();
    }

    const { names, flag, capitals, area, currencies, languages, descriptions } =
        country;
    const flagUrl = flag.url_svg || flag.url_png;
    const capital =
        capitals.find((c) => c.attributes.primary)?.name ?? capitals[0]?.name;

    return (
        <div className="p-4 flex flex-col gap-2">
            <Link href="/">← Back</Link>
            {flagUrl && (
                <img
                    src={flagUrl}
                    alt={flag.description || names.common}
                    className="max-w-60"
                />
            )}
            <h1 className="font-serif italic font-normal text-[36px] mb-1.5">{names.common}</h1>
            <p>{names.official}</p>

            {descriptions.long && <p>{descriptions.long}</p>}

            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                {capital && (
                    <>
                        <dt className="font-semibold">Capital</dt>
                        <dd>{capital}</dd>
                    </>
                )}
                <dt className="font-semibold">Area</dt>
                <dd>{area.kilometers.toLocaleString("sv-SE")} km²</dd>
                {currencies.length > 0 && (
                    <>
                        <dt className="font-semibold">Currencies</dt>
                        <dd>
                            {currencies
                                .map((c) => `${c.name} (${c.symbol})`)
                                .join(", ")}
                        </dd>
                    </>
                )}
                {languages.length > 0 && (
                    <>
                        <dt className="font-semibold">Languages</dt>
                        <dd>{languages.map((l) => l.name).join(", ")}</dd>
                    </>
                )}
            </dl>

            {names.alternates?.length > 0 && (
                <p>Also known as: {names.alternates.join(", ")}</p>
            )}

            {names.native && (
                <div>
                    <h2 className="font-semibold">Native names</h2>
                    <ul>
                        {Object.entries(names.native).map(([lang, n]) => (
                            <li key={lang}>
                                {n.common} ({n.official})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
export default DetailPage;
