import { Suspense } from "react";
import Link from "next/link";
import CountryDetail from "../../components/country-detail";

function DetailPage({ params }: PageProps<"/country/[code]">) {
    return (
        <div className="m-4 flex flex-col gap-2 p-4 sm:p-6 md:mx-auto md:my-8 md:max-w-3xl bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
            <Link href="/">← Back</Link>
            <Suspense fallback={<p>Loading country...</p>}>
                <CountryDetail params={params} />
            </Suspense>
        </div>
    );
}
export default DetailPage;
