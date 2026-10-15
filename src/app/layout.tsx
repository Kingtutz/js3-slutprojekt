import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/nav";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
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
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col font-sans">
                <header>
                    <Nav />
                </header>
                <main>{children}</main>
                <footer>Slutproject Javascript 3 2026 @Charlie</footer>
            </body>
        </html>
    );
}
