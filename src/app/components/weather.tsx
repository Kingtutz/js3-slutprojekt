import { cacheLife } from "next/cache";
import { Coordinates } from "../types/country.type";

type CurrentWeather = {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    is_day: number;
};

type ForecastResponse = {
    current: CurrentWeather;
};

// WMO weather codes used by Open-Meteo: https://open-meteo.com/en/docs
const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
    0: { label: "Klart", icon: "☀️" },
    1: { label: "Mestadels klart", icon: "🌤️" },
    2: { label: "Halvklart", icon: "⛅" },
    3: { label: "Mulet", icon: "☁️" },
    45: { label: "Dimma", icon: "🌫️" },
    48: { label: "Underkyld dimma", icon: "🌫️" },
    51: { label: "Lätt duggregn", icon: "🌦️" },
    53: { label: "Duggregn", icon: "🌦️" },
    55: { label: "Kraftigt duggregn", icon: "🌦️" },
    56: { label: "Underkylt duggregn", icon: "🌧️" },
    57: { label: "Underkylt duggregn", icon: "🌧️" },
    61: { label: "Lätt regn", icon: "🌧️" },
    63: { label: "Regn", icon: "🌧️" },
    65: { label: "Kraftigt regn", icon: "🌧️" },
    66: { label: "Underkylt regn", icon: "🌧️" },
    67: { label: "Underkylt regn", icon: "🌧️" },
    71: { label: "Lätt snöfall", icon: "🌨️" },
    73: { label: "Snöfall", icon: "🌨️" },
    75: { label: "Kraftigt snöfall", icon: "❄️" },
    77: { label: "Kornsnö", icon: "🌨️" },
    80: { label: "Lätta regnskurar", icon: "🌦️" },
    81: { label: "Regnskurar", icon: "🌧️" },
    82: { label: "Kraftiga regnskurar", icon: "⛈️" },
    85: { label: "Snöbyar", icon: "🌨️" },
    86: { label: "Kraftiga snöbyar", icon: "❄️" },
    95: { label: "Åska", icon: "⛈️" },
    96: { label: "Åska med hagel", icon: "⛈️" },
    99: { label: "Åska med hagel", icon: "⛈️" },
};

async function fetchWeather({
    lat,
    lng,
}: Coordinates): Promise<CurrentWeather | null> {
    "use cache";
    // Open-Meteo updates current conditions every 15 minutes
    cacheLife("minutes");

    const params = new URLSearchParams({
        latitude: String(lat),
        longitude: String(lng),
        current:
            "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day",
        timezone: "auto",
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    // Weather is extra info, so a failed request shouldn't break the country page
    if (!res.ok) return null;

    const data: ForecastResponse = await res.json();
    return data.current;
}

type WeatherProps = {
    coordinates: Coordinates;
    place: string;
};

async function Weather({ coordinates, place }: WeatherProps) {
    const weather = await fetchWeather(coordinates);

    if (!weather) {
        return <p className="text-[#8a7a66]">Vädret är inte tillgängligt just nu.</p>;
    }

    const code = WEATHER_CODES[weather.weather_code] ?? {
        label: "Okänt väder",
        icon: "🌡️",
    };
    const icon = weather.weather_code <= 1 && !weather.is_day ? "🌙" : code.icon;

    return (
        <section className="flex flex-col gap-2 border border-[#3a2f24] rounded-xs p-4">
            <h2 className="font-semibold">Vädret i {place} just nu</h2>
            <div className="flex items-center gap-4">
                <span className="text-4xl" aria-hidden="true">
                    {icon}
                </span>
                <div>
                    <p className="text-3xl">
                        {Math.round(weather.temperature_2m)}°C
                    </p>
                    <p>{code.label}</p>
                </div>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="font-semibold">Känns som</dt>
                <dd>{Math.round(weather.apparent_temperature)}°C</dd>
                <dt className="font-semibold">Luftfuktighet</dt>
                <dd>{weather.relative_humidity_2m}%</dd>
                <dt className="font-semibold">Vind</dt>
                <dd>{Math.round(weather.wind_speed_10m / 3.6)} m/s</dd>
            </dl>
        </section>
    );
}

export default Weather;
