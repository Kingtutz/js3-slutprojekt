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
    0: { label: "Clear sky", icon: "☀️" },
    1: { label: "Mainly clear", icon: "🌤️" },
    2: { label: "Partly cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Fog", icon: "🌫️" },
    48: { label: "Rime fog", icon: "🌫️" },
    51: { label: "Light drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Dense drizzle", icon: "🌦️" },
    56: { label: "Freezing drizzle", icon: "🌧️" },
    57: { label: "Freezing drizzle", icon: "🌧️" },
    61: { label: "Light rain", icon: "🌧️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy rain", icon: "🌧️" },
    66: { label: "Freezing rain", icon: "🌧️" },
    67: { label: "Freezing rain", icon: "🌧️" },
    71: { label: "Light snow", icon: "🌨️" },
    73: { label: "Snow", icon: "🌨️" },
    75: { label: "Heavy snow", icon: "❄️" },
    77: { label: "Snow grains", icon: "🌨️" },
    80: { label: "Light showers", icon: "🌦️" },
    81: { label: "Showers", icon: "🌧️" },
    82: { label: "Violent showers", icon: "⛈️" },
    85: { label: "Snow showers", icon: "🌨️" },
    86: { label: "Heavy snow showers", icon: "❄️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm with hail", icon: "⛈️" },
    99: { label: "Thunderstorm with hail", icon: "⛈️" },
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
        return <p className="text-[#8a7a66]">Weather is unavailable right now.</p>;
    }

    const code = WEATHER_CODES[weather.weather_code] ?? {
        label: "Unknown",
        icon: "🌡️",
    };
    const icon = weather.weather_code <= 1 && !weather.is_day ? "🌙" : code.icon;

    return (
        <section className="flex flex-col gap-2 border border-[#3a2f24] rounded-xs p-4">
            <h2 className="font-semibold">Weather in {place} right now</h2>
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
                <dt className="font-semibold">Feels like</dt>
                <dd>{Math.round(weather.apparent_temperature)}°C</dd>
                <dt className="font-semibold">Humidity</dt>
                <dd>{weather.relative_humidity_2m}%</dd>
                <dt className="font-semibold">Wind</dt>
                <dd>{Math.round(weather.wind_speed_10m / 3.6)} m/s</dd>
            </dl>
        </section>
    );
}

export default Weather;
