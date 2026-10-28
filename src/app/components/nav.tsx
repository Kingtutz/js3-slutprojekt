import React, { Suspense } from "react";
import Search, { SearchForm } from "./search";
import Link from "next/link";

export const Nav = () => {
    return (
        <nav className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:gap-4 md:px-10 md:py-4">
            <div>
                <Link href={"/"}>
                    <h1 className="font-serif italic font-normal text-[28px] md:text-[36px] text-[#d6b56e] mb-1.5">
                        Var vill du resa?
                    </h1>
                </Link>
            </div>
            <div>
                <Suspense fallback={<SearchForm query="" region="" />}>
                    <Search />
                </Suspense>
            </div>
            <Link href={"/globe"}>
                <button className="text-sm font-medium tracking-[0.12em] sm:tracking-[0.22em] uppercase text-[#d6b56e] bg-transparent border border-[#3a2f24] rounded-xs px-4 sm:px-5 py-3 min-h-11 cursor-pointer hover:border-[#d6b56e] aria-pressed:bg-[#d6b56e] aria-pressed:text-[#0b0908] aria-pressed:border-[#d6b56e] focus-visible:outline-2 focus-visible:outline-[#d6b56e] focus-visible:outline-offset-2">
                    Glob
                </button>
            </Link>
        </nav>
    );
};
