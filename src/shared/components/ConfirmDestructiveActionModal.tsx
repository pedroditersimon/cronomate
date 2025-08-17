import { PropsWithChildren, useState } from "react";
import { ClassValue } from "clsx";
import { Modal } from "src/shared/components/Modal";
import InputField from "src/shared/components/forms/InputField";
import clsx from "clsx";
import Button from "src/shared/components/interactable/Button";

interface Props extends PropsWithChildren {
    id: string;
    title?: string;

    confirmText?: string;
    onConfirm: () => void;

    description?: string;

    closeOnClickOut?: boolean;
    hideCloseBtn?: boolean;
    className?: ClassValue;
}

export function ConfirmDestructiveActionModal({
    id,
    title = "Confirmar",
    confirmText = "Confirmar",
    description,
    onConfirm,
    closeOnClickOut,
    hideCloseBtn,
    className
}: Props) {
    const [inputText, setInputText] = useState("");

    const textMatches = inputText.toLowerCase() === confirmText.toLowerCase();

    return (
        <Modal
            id={id}
            title={title}
            closeOnClickOut={closeOnClickOut}
            hideCloseBtn={hideCloseBtn}
            className={clsx("!h-fit", className)}
            containerClassName="md:max-w-[30rem]"
        >
            {description && (
                <p className="text-gray-500">{description}</p>
            )}
            <p className="text-gray-500">
                Escribe "<span className="font-bold text-red-500">{confirmText}</span>" para confirmar la acción:
            </p>

            <InputField
                value={inputText}
                onChange={setInputText}
                placeholder="Escribe aqui..."
                className={clsx(
                    { "border-red-500/50 focus:border-red-500 hover:border-red-500 text-red-500 focus:text-red-500 hover:text-red-500": textMatches }
                )}
            />

            <Button
                disabled={!textMatches}
                onClick={onConfirm}
            >
                Aceptar
            </Button>
        </Modal>
    );
}