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
        <nav className="flex gap-4 items-center justify-center p-4">
            {currentPage > 1 && (
                <Link
                    href={pageHref(currentPage - 1)}
                    className="px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
                    Previous
                </Link>
            )}
            <span className="px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs ">
                Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
                <Link
                    href={pageHref(currentPage + 1)}
                    className="px-4 py-3 bg-transparent text-[#d6b56e] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e]">
                    Next
                </Link>
            )}
        </nav>
    );
}

export default Pagination;
