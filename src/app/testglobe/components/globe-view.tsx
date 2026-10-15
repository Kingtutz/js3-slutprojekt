"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Globe, { GlobeMethods } from "react-globe.gl";
import { CountrySummary } from "../../types/country.type";

type GlobeViewProps = {
    countries: CountrySummary[];
};

function GlobeView({ countries }: GlobeViewProps) {
    const router = useRouter();
    const globeRef = useRef<GlobeMethods | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    // Only countries the API gave coordinates for can be placed on the globe
    const placed = countries.filter((c) => c.coordinates);

    // Keep the globe the same size as its container
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            setSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height,
            });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleGlobeReady = () => {
        const globe = globeRef.current;
        if (!globe) return;
        globe.pointOfView({ lat: 50, lng: 15, altitude: 2.2 });
        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
    };

    // The globe library places plain DOM elements, so the flags are built by hand
    const createFlag = (d: object) => {
        const country = d as CountrySummary;

        // The library positions the wrapper with an inline transform,
        // so hover scaling goes on the inner button instead
        const wrapper = document.createElement("div");
        wrapper.style.pointerEvents = "auto";

        const el = document.createElement("button");
        el.type = "button";
        el.className = "globe-flag";
        el.setAttribute("aria-label", country.names.common);
        wrapper.appendChild(el);

        const img = document.createElement("img");
        img.src = country.flag.url_svg || country.flag.url_png;
        img.alt = "";
        el.appendChild(img);

        const label = document.createElement("span");
        label.textContent = country.names.common;
        el.appendChild(label);

        // Pause the spin while hovering so the flag is easy to click
        const setAutoRotate = (on: boolean) => {
            const globe = globeRef.current;
            if (globe) globe.controls().autoRotate = on;
        };
        el.onmouseenter = () => setAutoRotate(false);
        el.onmouseleave = () => setAutoRotate(true);
        el.onclick = () =>
            router.push(`/detailpage/${country.codes.alpha_3}`);

        return wrapper;
    };

    return (
        <div ref={containerRef} className="w-full h-[calc(100vh-180px)]">
            {size.width > 0 && (
                <Globe
                    ref={globeRef}
                    width={size.width}
                    height={size.height}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="/earth-night.jpg"
                    atmosphereColor="#d6b56e"
                    atmosphereAltitude={0.15}
                    onGlobeReady={handleGlobeReady}
                    htmlElementsData={placed}
                    htmlLat={(d) => (d as CountrySummary).coordinates!.lat}
                    htmlLng={(d) => (d as CountrySummary).coordinates!.lng}
                    htmlAltitude={0.01}
                    htmlElement={createFlag}
                    // Hide flags on the far side of the globe
                    htmlElementVisibilityModifier={(el, isVisible) => {
                        el.style.opacity = isVisible ? "1" : "0";
                        el.style.pointerEvents = isVisible ? "auto" : "none";
                    }}
                />
            )}
        </div>
    );
}

export default GlobeView;
