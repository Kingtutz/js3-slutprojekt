import { CountrySummary } from "../types/country.type";

// A few disputed countries (e.g. Abkhazia) have no alpha_3 code, so they use their name instead
export function countryId(country: CountrySummary) {
    return country.codes.alpha_3 || country.names.common;
}

// homeSearch is the home page's query string (e.g. "?q=sw&region=Europe"),
// passed along so the Back link can return to the same search
export function countryHref(country: CountrySummary, homeSearch = "") {
    return `/country/${encodeURIComponent(countryId(country))}${homeSearch}`;
}
