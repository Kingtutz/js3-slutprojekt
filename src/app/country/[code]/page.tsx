import { Suspense } from "react";
import Link from "next/link";
import CountryDetail from "../../components/country-detail";
import { Spinner } from "@/components/ui/spinner";
import { homeHref } from "../../lib/home-href";

function DetailPage({ params, searchParams }: PageProps<"/country/[code]">) {
    return (
        <div className="m-4 flex flex-col gap-2 p-4 sm:p-6 md:mx-auto md:my-8 md:max-w-3xl bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
            <Suspense fallback={<Link href="/">← Back</Link>}>
                <BackLink searchParams={searchParams} />
            </Suspense>
            <Suspense
                fallback={
                    <>
                        <Spinner />
                        <p>Loading country...</p>
                    </>
                }>
                <CountryDetail params={params} showWikiIntro />
            </Suspense>
        </div>
    );
}

// Returns to the search, region and page the country was opened from.
// Reads searchParams at request time, so it must render inside <Suspense>
async function BackLink({
    searchParams,
}: Pick<PageProps<"/country/[code]">, "searchParams">) {
    const { q, region, page } = await searchParams;
    const href = homeHref({
        query: typeof q === "string" ? q : "",
        region: typeof region === "string" ? region : "",
        page: Number(page) || 1,
    });
    return <Link href={href}>← Back</Link>;
}
export default DetailPage;
