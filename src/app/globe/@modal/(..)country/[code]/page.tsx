import { Suspense } from "react";
import CountryDetail from "../../../../components/country-detail";
import Modal from "../../../components/modal";

// Clicking a flag on the globe opens /country/[code] here as a popup.
// Reloading or opening the link directly shows the normal country page instead.
function CountryModal({ params }: PageProps<"/country/[code]">) {
    return (
        <Modal>
            <Suspense fallback={<p className="text-[#d6b56e]">Loading country...</p>}>
                <CountryDetail params={params} />
            </Suspense>
        </Modal>
    );
}
export default CountryModal;
