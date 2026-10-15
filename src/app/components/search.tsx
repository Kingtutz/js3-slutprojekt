import Form from "next/form";

type SearchProps = {
    query: string;
};

function Search({ query }: SearchProps) {
    return (
        <Form action="/" className="flex items-center gap-2 m-2">
            <input
                className="border w-100 h-10 p-2 rounded-2xl"
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search..."
            />
            <button type="submit" className="border h-10 px-4 rounded-2xl">
                Search
            </button>
        </Form>
    );
}

export default Search;
