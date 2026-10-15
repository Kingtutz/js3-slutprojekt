import Link from "next/link";
import { homeHref } from "../lib/home-href";

type RegionSortingProps = {
    regions: string[];
    activeRegion: string;
    query: string;
};

const buttonClass =
    "shrink-0 whitespace-nowrap text-xs sm:text-sm font-medium tracking-[0.12em] sm:tracking-[0.22em] uppercase text-[#d6b56e] bg-transparent border border-[#3a2f24] rounded-xs px-4 sm:px-5 py-3 min-h-11 hover:border-[#d6b56e] aria-[current=true]:bg-[#d6b56e] aria-[current=true]:text-[#0b0908] aria-[current=true]:border-[#d6b56e] focus-visible:outline-2 focus-visible:outline-[#d6b56e] focus-visible:outline-offset-2";

function RegionSorting({ regions, activeRegion, query }: RegionSortingProps) {
    return (
        <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:m-2 sm:flex-wrap sm:overflow-visible sm:p-0">
            <Link
                href={homeHref({ query })}
                aria-current={!activeRegion}
                className={buttonClass}>
                All
            </Link>
            {regions.map((region) => (
                <Link
                    key={region}
                    href={homeHref({ query, region })}
                    aria-current={region === activeRegion}
                    className={buttonClass}>
                    {region}
                </Link>
            ))}
        </div>
    );
}

export default RegionSorting;
