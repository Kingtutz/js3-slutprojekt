import Link from "next/link";
import { homeHref } from "../lib/home-href";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    query: string;
    region: string;
};

function Pagination({
    currentPage,
    totalPages,
    query,
    region,
}: PaginationProps) {
    const pageHref = (page: number) => homeHref({ query, region, page });

    return (
        <nav className="flex gap-2 items-center justify-center p-4 text-sm sm:gap-4 sm:text-base">
            {currentPage > 1 && (
                <Link
                    href={pageHref(currentPage - 1)}
                    className="px-3 sm:px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
                    Föregående
                </Link>
            )}
            <span className="px-3 sm:px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs ">
                Sida {currentPage} av {totalPages}
            </span>
            {currentPage < totalPages && (
                <Link
                    href={pageHref(currentPage + 1)}
                    className="px-3 sm:px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
                    Nästa
                </Link>
            )}
        </nav>
    );
}

export default Pagination;
