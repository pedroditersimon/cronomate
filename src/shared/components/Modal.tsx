import { PropsWithChildren } from "react";
import { CrossIcon } from "src/assets/Icons";
import clsx, { ClassValue } from "clsx";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import useClickOut from "src/shared/hooks/useClickOut";

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

    onClose?: () => void;

    className?: ClassValue;
    containerClassName?: ClassValue;
}

export function Modal({ id, title, closeOnClickOut, hideCloseBtn, onClose, className, containerClassName, children }: Props) {

    const handleClose = () => {
        showModal(id, false);
        if (onClose) onClose();
    };

    const { handleMouseEnter, handleMouseLeave } = useClickOut(
        () => handleClose(), closeOnClickOut
    );

    return (
        <dialog
            id={id}
            className={clsx(
                "w-full h-full bg-transparent backdrop:bg-black backdrop:bg-opacity-75",
                className
            )}
        >
            <Container
                className={clsx("m-auto size-fit", containerClassName)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >

                {/* Topbar */}
                <ContainerTopbar
                    className="group"
                    title={title}

                    icon={!hideCloseBtn && <CrossIcon />}
                    onIconClick={() => handleClose()}
                />

                {children}

            </Container>
        </dialog>
    );
}