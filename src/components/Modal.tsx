import { PropsWithChildren, useEffect, useState } from "react";
import { CrossIcon } from "../assets/Icons";
import clsx, { ClassValue } from "clsx";
import Container from "../layouts/Container";
import ContainerTopbar from "../layouts/ContainerTopbar";

export function showModal(id: string, show: boolean = true) {
    const dialog = document.getElementById(id);
    if (dialog instanceof HTMLDialogElement) {
        if (show) dialog.showModal();
        else dialog.close();
    }
}


interface Props extends PropsWithChildren {
    id: string;
    title: string;
    closeOnClickOut?: boolean;
    hideCloseBtn?: boolean;
    className?: ClassValue;
}

export function Modal({ id, title, closeOnClickOut, hideCloseBtn, className, children }: Props) {
    const [isMouseOut, setIsMouseOut] = useState(false);

    // close on click out
    useEffect(() => {
        // feature not enabled
        if (!closeOnClickOut) return;

        const onMouseDown = () => {
            if (isMouseOut)
                showModal(id, false);
        }

        addEventListener("mousedown", onMouseDown);

        return () => removeEventListener("mousedown", onMouseDown); // clean up
    }, [closeOnClickOut, id, isMouseOut]);

    return (
        <dialog id={id} className="bg-transparent backdrop:bg-black backdrop:bg-opacity-75">
            <Container
                className={clsx("max-w-full max-h-full size-fit", className)}
                onMouseEnter={() => setIsMouseOut(false)}
                onMouseLeave={() => setIsMouseOut(true)}
            >

                {/* Topbar */}
                <ContainerTopbar
                    className="group"
                    title={title}

                    icon={!hideCloseBtn && <CrossIcon />}
                    onIconClick={() => showModal(id, false)}
                />

                {children}

            </Container>
        </dialog>
    );
}