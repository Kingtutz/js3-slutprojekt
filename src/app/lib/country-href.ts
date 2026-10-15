import { CountrySummary } from "../types/country.type";

// A few disputed countries (e.g. Abkhazia) have no alpha_3 code, so they use their name instead
export function countryId(country: CountrySummary) {
    return country.codes.alpha_3 || country.names.common;
}

export function countryHref(country: CountrySummary) {
    return `/country/${encodeURIComponent(countryId(country))}`;
}
