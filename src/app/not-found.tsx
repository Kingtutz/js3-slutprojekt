import Link from "next/link";

// Shown for unknown URLs and when a page calls notFound() (e.g. /country/XYZ)
function NotFound() {
    return (
        <div className="m-4 flex flex-col items-start gap-4 p-4 sm:p-6 md:mx-auto md:my-8 md:max-w-3xl text-[#d6b56e] border border-[#3a2f24] rounded-xs">
            <h1 className="font-serif italic font-normal text-[28px] sm:text-[36px]">
                Landet hittades inte
            </h1>
            <Link
                href="/"
                className="text-sm font-medium tracking-[0.12em] sm:tracking-[0.22em] uppercase text-[#d6b56e] bg-transparent border border-[#3a2f24] rounded-xs px-4 sm:px-5 py-3 min-h-11 hover:border-[#d6b56e] focus-visible:outline-2 focus-visible:outline-[#d6b56e] focus-visible:outline-offset-2">
                ← Tillbaka till alla länder
            </Link>
        </div>
    );
}

export default NotFound;
