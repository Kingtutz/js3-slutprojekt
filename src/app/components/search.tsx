"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";

type SearchFormProps = {
    query: string;
    region: string;
};

// Reads the current URL so a new search keeps the selected region
function Search() {
    const searchParams = useSearchParams();
    return (
        <SearchForm
            query={searchParams.get("q") ?? ""}
            region={searchParams.get("region") ?? ""}
        />
    );
}

export function SearchForm({ query, region }: SearchFormProps) {
    return (
        <Form
            action="/"
            className="order-last flex w-full items-center gap-2 md\:order-none md:m-2 md:w-auto">
            {region && <input type="hidden" name="region" value={region} />}
            <input
                key={query}
                className="min-w-0 flex-1 md:w-100 md:flex-none min-h-11 px-4 py-3 bg-transparent text-[#d6b56e] caret-[#d6b56e] placeholder:text-[#8a7a66] border border-[#3a2f24] rounded-xs hover:border-[#d6b56e] focus:border-[#d6b56e] focus-visible:outline-2 focus-visible:outline-[#d6b56e] focus-visible:outline-offset-2 autofill:shadow-[inset_0_0_0_1000px_#0b0908] autofill:[-webkit-text-fill-color:#d6b56e]"
                type="text"
                autoComplete="off"
                name="q"
                defaultValue={query}
                placeholder="Sök land..."
            />
            <button
                type="submit"
                className="text-sm font-medium shrink-0 tracking-[0.12em] sm:tracking-[0.22em] uppercase text-[#d6b56e] bg-transparent border border-[#3a2f24] rounded-xs px-4 sm:px-5 py-3 min-h-11 cursor-pointer hover:border-[#d6b56e] aria-pressed:bg-[#d6b56e] aria-pressed:text-[#0b0908] aria-pressed:border-[#d6b56e] focus-visible:outline-2 focus-visible:outline-[#d6b56e] focus-visible:outline-offset-2">
                Sök
            </button>
        </Form>
    );
}

export default Search;
