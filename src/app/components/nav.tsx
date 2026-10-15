import React, { Suspense } from "react";
import Search, { SearchForm } from "./search";
import Link from "next/link";

export const Nav = () => {
    return (
        <nav className="flex flex-wrap items-center justify-between gap-4 px-10 py-4">
            <Link href={"/"}>
                <h1 className="font-serif italic font-normal text-[36px] text-[#d6b56e] mb-1.5">
                    Var vill du resa?
                </h1>
            </Link>
            <Suspense fallback={<SearchForm query="" region="" />}>
                <Search />
            </Suspense>
            <Link href={"/testglobe"}>
                <button className="text-sm font-medium tracking-[0.22em] uppercase text-[#d6b56e] bg-transparent border border-[#3a2f24] rounded-xs px-5 py-3 min-h-11 cursor-pointer hover:border-[#d6b56e] aria-pressed:bg-[#d6b56e] aria-pressed:text-[#0b0908] aria-pressed:border-[#d6b56e] focus-visible:outline-2 focus-visible:outline-[#d6b56e] focus-visible:outline-offset-2">
                    Globe
                </button>
            </Link>
        </nav>
    );
};
