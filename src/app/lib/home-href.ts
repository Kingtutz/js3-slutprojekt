type HomeHrefOptions = {
    query?: string;
    region?: string;
    page?: number;
};

// Builds a link to the home page that keeps search, region and page together
export function homeHref({ query, region, page }: HomeHrefOptions) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (region) params.set("region", region);
    if (page && page > 1) params.set("page", String(page));

    const search = params.toString();
    return search ? `/?${search}` : "/";
}
