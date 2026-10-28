import { cacheLife } from "next/cache";

type WikiSummary = {
    type: string;
    title: string;
    description?: string;
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    content_urls: {
        desktop: { page: string };
    };
};

async function fetchSummary(title: string): Promise<WikiSummary | null> {
    "use cache";
    cacheLife("days");

    const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(" ", "_"))}`,
        // Wikipedia asks API users to identify themselves
        { headers: { "Api-User-Agent": "js3-slutprojekt (school project)" } },
    );
    if (!res.ok) return null;

    const summary: WikiSummary = await res.json();
    // Names like "Georgia" lead to a disambiguation page instead of the country
    if (summary.type !== "standard") return null;

    return summary;
}

type WikiMediaItem = {
    title: string;
    type: string;
    showInGallery: boolean;
    caption?: { text: string };
    srcset?: { src: string; scale: string }[];
};

type WikiImage = {
    title: string;
    caption: string;
    src: string;
    srcSet: string;
};

// How many extra pictures to show below the intro
const GALLERY_SIZE = 6;

async function fetchImages(title: string): Promise<WikiImage[]> {
    "use cache";
    cacheLife("days");

    const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replaceAll(" ", "_"))}`,
        { headers: { "Api-User-Agent": "js3-slutprojekt (school project)" } },
    );
    // The pictures are extra info, so a failed request just means no gallery
    if (!res.ok) return [];

    const { items }: { items: WikiMediaItem[] } = await res.json();
    return (
        items
            // SVGs are mostly flags, maps and coats of arms, photos are jpg/png.
            // Images without a caption tend to be portraits or icons.
            .filter(
                (i) =>
                    i.type === "image" &&
                    i.showInGallery &&
                    i.srcset?.length &&
                    i.caption?.text &&
                    !i.title.toLowerCase().endsWith(".svg"),
            )
            .slice(0, GALLERY_SIZE)
            .map((i) => ({
                title: i.title,
                caption: i.caption!.text,
                // The API returns protocol-relative URLs ("//thumb.wikimedia.org/...")
                src: `https:${i.srcset![0].src}`,
                srcSet: i
                    .srcset!.map((s) => `https:${s.src} ${s.scale}`)
                    .join(", "),
            }))
    );
}

async function findSummary(names: string[]) {
    for (const name of names) {
        const summary = await fetchSummary(name);
        if (summary) return summary;
    }
    return null;
}

type WikiIntroProps = {
    commonName: string;
    officialName: string;
};

async function WikiIntro({ commonName, officialName }: WikiIntroProps) {
    const summary = await findSummary([
        commonName,
        `${commonName} (country)`,
        officialName,
    ]);

    // The intro is extra info, so a missing article shouldn't break the country page
    if (!summary) return null;

    const articleUrl = summary.content_urls.desktop.page;
    const images = await fetchImages(summary.title);

    return (
        <>
            <section className="flex flex-col gap-3 border border-[#3a2f24] rounded-xs p-4 sm:flex-row sm:items-start">
                {summary.thumbnail && (
                    <img
                        src={summary.thumbnail.source}
                        width={summary.thumbnail.width}
                        height={summary.thumbnail.height}
                        alt={`Bild från Wikipedia-artikeln om ${summary.title}${summary.description ? ` – ${summary.description}` : ""}`}
                        className="w-full max-w-40 h-auto border border-[#d6b56e] sm:shrink-0"
                    />
                )}
                <div className="flex flex-col gap-2">
                    <p>{summary.extract}</p>
                    <p className="text-sm text-[#8a7a66]">
                        Källa:{" "}
                        <a
                            href={articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[#d6b56e]">
                            “{summary.title}” på Wikipedia
                        </a>{" "}
                        (CC BY-SA 4.0)
                    </p>
                    <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline">
                        Läs hela artikeln på Wikipedia →
                    </a>
                </div>
            </section>
            {images.length > 0 && (
                <section className="flex flex-col gap-2 border border-[#3a2f24] rounded-xs p-4">
                    <h2 className="font-semibold">Bilder</h2>
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {images.map((image) => (
                            <li key={image.title}>
                                <figure className="flex flex-col gap-1">
                                    <img
                                        src={image.src}
                                        srcSet={image.srcSet}
                                        alt={image.caption}
                                        loading="lazy"
                                        className="w-full aspect-4/3 object-cover border border-[#3a2f24]"
                                    />
                                    <figcaption className="text-sm text-[#8a7a66]">
                                        {image.caption}
                                    </figcaption>
                                </figure>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}

export default WikiIntro;
