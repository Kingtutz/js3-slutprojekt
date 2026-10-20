import { cacheLife } from "next/cache";
import { Coordinates } from "../../types/country.type";

export type GlobeWeather = {
    temperature: number;
    windSpeed: number;
};

type ForecastResponse = {
    current: {
        temperature_2m: number;
        wind_speed_10m: number;
    };
};

// Keeps each request URL a reasonable length
const CHUNK_SIZE = 100;

async function fetchWeatherChunk(points: Coordinates[]): Promise<GlobeWeather[]> {
    "use cache";
    // Every location counts as one call on Open-Meteo's free tier (10,000/day),
    // so ~250 flags are refreshed hourly instead of every 15 minutes
    cacheLife("hours");

    const params = new URLSearchParams({
        latitude: points.map((p) => p.lat).join(","),
        longitude: points.map((p) => p.lng).join(","),
        current: "temperature_2m,wind_speed_10m",
        wind_speed_unit: "ms",
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    // Throwing (instead of returning) keeps a failed request out of the cache
    if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);

    const data: ForecastResponse | ForecastResponse[] = await res.json();
    // A single location comes back as an object, several as an array in the same order
    return (Array.isArray(data) ? data : [data]).map((d) => ({
        temperature: d.current.temperature_2m,
        windSpeed: d.current.wind_speed_10m,
    }));
}

// Weather for many places at once, in the same order as `points`
export async function fetchGlobeWeather(
    points: Coordinates[],
): Promise<(GlobeWeather | null)[]> {
    const chunks: Coordinates[][] = [];
    for (let i = 0; i < points.length; i += CHUNK_SIZE) {
        chunks.push(points.slice(i, i + CHUNK_SIZE));
    }

    // Weather is extra info, so the globe still works if a request fails
    const results = await Promise.all(
        chunks.map((chunk) =>
            fetchWeatherChunk(chunk).catch(() => chunk.map(() => null)),
        ),
    );
    return results.flat();
}
