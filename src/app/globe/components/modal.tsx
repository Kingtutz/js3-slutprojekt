"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type ModalProps = {
    children: React.ReactNode;
};

// Closing goes back in history, so the URL returns to /globe
function Modal({ children }: ModalProps) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement>(null);

    // showModal() gives us Esc to close, focus trapping and the backdrop
    useEffect(() => {
        if (!dialogRef.current?.open) dialogRef.current?.showModal();
    }, []);

    return (
        <dialog
            ref={dialogRef}
            onClose={() => router.back()}
            // A click on the backdrop lands on the dialog itself, not its content
            onClick={(e) => {
                if (e.target === e.currentTarget) dialogRef.current?.close();
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-3xl max-h-[85dvh] p-0 bg-[#0b0908] text-[#f1e6d2] border border-[#3a2f24] rounded-xs backdrop:bg-black/60 backdrop:backdrop-blur-xs">
            <div className="flex flex-col gap-2 p-4 sm:p-6">
                <button
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                    className="self-end text-sm font-medium tracking-[0.12em] sm:tracking-[0.22em] uppercase text-[#d6b56e] border border-[#3a2f24] rounded-xs px-4 py-2 min-h-11 cursor-pointer hover:border-[#d6b56e] focus-visible:outline-2 focus-visible:outline-[#d6b56e] focus-visible:outline-offset-2">
                    Stäng
                </button>
                {children}
            </div>
        </dialog>
    );
}

export default Modal;
