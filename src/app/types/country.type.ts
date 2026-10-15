export type NameVariant = {
    common: string;
    official: string;
};

export type CountryNames = {
    common: string;
    official: string;
    alternates: string[];
    native: Record<string, NameVariant>;
    translations: Record<string, NameVariant>;
};

export type Currency = {
    name: string;
    symbol: string;
};

export type Country = {
    names: CountryNames;
    cca2: string;
    cca3: string;
    capital?: string[];
    region: string;
    subregion?: string;
    population: number;
    area: number;
    languages?: Record<string, string>;
    currencies?: Record<string, Currency>;
    borders?: string[];
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
};

export type CountriesResponse = {
    data: {
        objects: Country[];
    };
};
