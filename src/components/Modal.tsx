import { PropsWithChildren } from "react";
import { CrossIcon } from "src/assets/Icons";
import clsx, { ClassValue } from "clsx";
import Container from "src/layouts/Container";
import ContainerTopbar from "src/layouts/ContainerTopbar";
import useClickOut from "src/hooks/useClickOut";

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
    const { handleMouseEnter, handleMouseLeave } = useClickOut(
        () => showModal(id, false), closeOnClickOut
    );

    return (
        <dialog id={id} className="bg-transparent backdrop:bg-black backdrop:bg-opacity-75">
            <Container
                className={clsx("max-w-full max-h-full size-fit", className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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