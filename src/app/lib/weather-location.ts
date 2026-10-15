import { Capital, Coordinates } from "../types/country.type";

// Weather for the capital where most people are, otherwise the country's centre
export function weatherLocation(
    capitals: Capital[] | undefined,
    coordinates: Coordinates | undefined,
) {
    const capital =
        capitals?.find((c) => c.attributes.primary) ?? capitals?.[0];
    return capital?.coordinates ?? coordinates;
}
