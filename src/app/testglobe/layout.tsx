// The modal slot shows a country popup on top of the globe
function TestGlobeLayout({ children, modal }: LayoutProps<"/testglobe">) {
    return (
        <>
            {children}
            {modal}
        </>
    );
}
export default TestGlobeLayout;
