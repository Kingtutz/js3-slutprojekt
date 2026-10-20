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

export type Coordinates = {
    lat: number;
    lng: number;
};

export type CountryCodes = {
    alpha_2: string;
    alpha_3: string;
    ccn3: string;
    cioc: string;
    fifa: string;
    fips: string;
    gec: string;
};

export type Capital = {
    name: string;
    coordinates: Coordinates;
    attributes: {
        administrative: boolean;
        constitutional: boolean;
        executive: boolean;
        judicial: boolean;
        legislative: boolean;
        primary: boolean;
    };
};

export type Flag = {
    colors: {
        dominant: string;
        palette: string[];
        prominent: string;
        swatches: Record<string, unknown>;
    };
    description: string;
    emoji: string;
    html_entity: string;
    unicode: string;
    url_png: string;
    url_svg: string;
};

export type Currency = {
    code: string;
    name: string;
    symbol: string;
};

export type Language = {
    bcp47: string;
    iso639_1: string;
    iso639_2b: string;
    iso639_2t: string;
    iso639_3: string;
    name: string;
    native_name: string;
};

export type Demonym = {
    f: string;
    m: string;
};

export type DayMonth = {
    day: number;
    month: number;
};

export type Country = {
    names: CountryNames;
    codes: CountryCodes;
    capitals: Capital[];
    flag: Flag;
    region: string;
    subregion: string;
    area: {
        kilometers: number;
        miles: number;
    };
    assets: unknown[];
    borders: string[];
    calling_codes: string[];
    cars: {
        driving_side: string;
        signs: string[];
    };
    classification: {
        dependency: boolean;
        dependency_type: string;
        disputed: boolean;
        iso_status: string;
        sovereign: boolean;
        un_member: boolean;
        un_observer: boolean;
    };
    continents: string[];
    coordinates: Coordinates;
    currencies: Currency[];
    date: {
        academic_year_start: DayMonth;
        fiscal_year_start: {
            corporate: DayMonth & { basis: string };
            government: DayMonth;
            personal: DayMonth;
        };
        start_of_week: string;
    };
    demonyms: Record<string, Demonym>;
    descriptions: {
        long: string;
        short: string;
    };
    economy: Record<string, unknown>;
    government_type: string;
    landlocked: boolean;
    languages: Language[];
};

export type CountrySummary = {
    names: Pick<CountryNames, "common">;
    codes: Pick<CountryCodes, "alpha_2" | "alpha_3">;
    flag: Pick<Flag, "emoji" | "url_svg" | "url_png">;
    region: string;
    capitals?: Capital[];
    coordinates?: Coordinates;
};

export type CountriesResponse<T = Country> = {
    data: {
        objects: T[];
        meta: {
            total: number;
            count: number;
            more: boolean;
        };
    };
};
