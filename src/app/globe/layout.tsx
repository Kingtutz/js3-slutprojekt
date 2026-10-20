// The modal slot shows a country popup on top of the globe
function GlobeLayout({ children, modal }: LayoutProps<"/globe">) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
export default GlobeLayout;
