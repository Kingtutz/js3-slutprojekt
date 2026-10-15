import type { Metadata } from "next";
import { Geist_Mono, Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/nav";

const jost = Jost({
    variable: "--font-jost",
    subsets: ["latin"],
    weight: ["400", "500"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "JS3 Slutprojekt",
    description: "JS3 slutprojekt",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="sv"
            className={`${jost.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col font-sans bg-[#0b0908] text-[#f1e6d2]">
                <header className="sticky top-0 z-10 bg-[rgba(11,9,8,0.94)] border-b border-[#3a2f24]">
                    <Nav />
                </header>
                <main>{children}</main>
                <footer>
                    <h3 className="flex place-content-center text-center px-4 py-4 font-medium text-[18px] sm:text-[24px] text-[#d6b56e] mb-1.5">
                        Slutproject Javascript 3 2026 @Charlie
                    </h3>
                </footer>
            </body>
        </html>
    );
}
