import { useEffect, useRef, useSyncExternalStore } from "react";
import Container from "src/shared/layouts/Container";
import Button from "src/shared/components/interactable/Button";
import { ButtonVariant } from "src/shared/types/ButtonVariant";
import ConfirmationService from "src/shared/services/confirmationService";

export default function ConfirmationDialog() {
    const options = useSyncExternalStore(ConfirmationService.subscribe, ConfirmationService.getCurrent);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (options && !dialog.open) dialog.showModal();
        else if (!options && dialog.open) dialog.close();
    }, [options]);

    return (
        <dialog
            ref={dialogRef}
            className="h-fit w-fit max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] bg-transparent p-0 backdrop:bg-black backdrop:bg-opacity-75"
            onCancel={event => {
                event.preventDefault();
                ConfirmationService.resolve(false);
            }}
        >
            {options &&
                <Container width="min-w-0" className="size-fit max-w-full">
                    <h1 className="text-xl font-bold text-neutral-200">{options.title}</h1>
                    <p className="text-gray-500">{options.description}</p>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => ConfirmationService.resolve(false)}>{options.cancelText}</Button>
                        <Button variant={ButtonVariant.Danger} onClick={() => ConfirmationService.resolve(true)}>
                            {options.confirmText}
                        </Button>
                    </div>
                </Container>
            }
        </dialog>
    );
}
