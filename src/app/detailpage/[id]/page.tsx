async function DetailPage({ params }: PageProps<"/detailpage/[id]">) {
    const { id } = await params;

    return <h1>{id}</h1>;
}
export default DetailPage;
