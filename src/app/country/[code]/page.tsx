import { Suspense } from "react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountriesResponse } from "../../types/country.type";

async function fetchCountries(path: string): Promise<CountriesResponse> {
    "use cache";
    cacheLife("days");

    const res = await fetch(
        `https://api.restcountries.com/countries/v5${path}`,
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

// Most links use the alpha_3 code, but countries without one (e.g. Abkhazia) link by name
async function findCountry(id: string) {
    if (/^[a-z]{3}$/i.test(id)) {
        const byCode = await fetchCountries(
            `/codes.alpha_3/${encodeURIComponent(id.toUpperCase())}`,
        );
        if (byCode.data.objects[0]) return byCode.data.objects[0];
    }

    const byName = await fetchCountries(`?q=${encodeURIComponent(id)}`);
    return byName.data.objects.find(
        (c) => c.names.common.toLowerCase() === id.toLowerCase(),
    );
}

function DetailPage({ params }: PageProps<"/country/[code]">) {
    return (
        <Suspense fallback={<p className="p-4">Loading country...</p>}>
            <CountryDetail params={params} />
        </Suspense>
    );
}

// Reads params at request time, so it must render inside <Suspense>
async function CountryDetail({
    params,
}: Pick<PageProps<"/country/[code]">, "params">) {
    const { code } = await params;
    const country = await findCountry(decodeURIComponent(code));

    if (!country) {
        notFound();
    }

    const { names, flag, capitals, area, currencies, languages, descriptions } =
        country;
    const flagUrl = flag.url_svg || flag.url_png;
    const capital =
        capitals.find((c) => c.attributes.primary)?.name ?? capitals[0]?.name;

    return (
        <div className="m-4 flex flex-col gap-2 p-4 sm:p-6 md:mx-auto md:my-8 md:max-w-3xl bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
            <Link href="/">← Back</Link>
            {flagUrl && (
                <img
                    src={flagUrl}
                    alt={flag.description || names.common}
                    className="w-full max-w-60 border border-[#d6b56e]"
                />
            )}
            <h1 className="font-serif italic font-normal text-[28px] sm:text-[36px] mb-1.5">
                {names.common}
            </h1>
            <p>{names.official}</p>

            {descriptions.long && <p>{descriptions.long}</p>}

            <dl className="grid grid-cols-1 gap-y-1 sm:grid-cols-[auto_1fr] sm:gap-x-4">
                {capital && (
                    <>
                        <dt className="mt-2 font-semibold sm:mt-0">Capital</dt>
                        <dd>{capital}</dd>
                    </>
                )}
                <dt className="mt-2 font-semibold sm:mt-0">Area</dt>
                <dd>{area.kilometers.toLocaleString("sv-SE")} km²</dd>
                {currencies.length > 0 && (
                    <>
                        <dt className="mt-2 font-semibold sm:mt-0">
                            Currencies
                        </dt>
                        <dd>
                            {currencies
                                .map((c) => `${c.name} (${c.symbol})`)
                                .join(", ")}
                        </dd>
                    </>
                )}
                {languages.length > 0 && (
                    <>
                        <dt className="mt-2 font-semibold sm:mt-0">
                            Languages
                        </dt>
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
