import { Session } from "src/features/session/types/Session";
import { ArchiveDownIcon, CheckIcon, CrossIcon, DocDownIcon, TrashIcon } from "src/assets/Icons";
import FormField from "src/shared/components/forms/FormField";
import Button from "src/shared/components/interactable/Button";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import { toast } from "sonner";
import sessionHistoryService from "src/features/sessions-history/services/sessionHistoryService";
import { ConfirmDestructiveActionModal } from "src/shared/components/ConfirmDestructiveActionModal";
import { Modal, showModal } from "src/shared/components/Modal";
import SelectFileField from "src/shared/components/SelectFileField";
import { useState } from "react";

interface Props {
    sessions: Array<Session>;
    onClose: () => void;
}

export default function SessionsHistorySettings({ sessions, onClose }: Props) {
    const [importedFiles, setImportedFiles] = useState<File[]>([]);
    const [copySaved, setCopySaved] = useState(false);

    const handleExport = () => {
        const { fileName } = sessionHistoryService.exportHistoryWithFileDownload(sessions);

        toast.success("¡Descarga exitosa!", {
            description: (<span>Archivo "{fileName}"</span>)
        });
        setCopySaved(true);
    }

    const handleImport = async () => {
        const firstFile = importedFiles && importedFiles.length > 0 ? importedFiles[0] : null;
        if (!firstFile) {
            toast.error("Error al importar", {
                description: "No se seleccionó ningún archivo."
            });
            return;
        }

        sessionHistoryService.importHistoryFromFile(firstFile)
            .catch(() => {
                toast.error("Error al importar", {
                    description: "No se pudo importar el historial de sesiones."
                });
            })
            .then(() => {
                toast.success("¡Importación exitosa!", {
                    description: "El historial de sesiones ha sido importado."
                });
                showModal("import-history-modal", false);
            });
    }

    const handleDelete = () => {
        sessionHistoryService
            .deleteHistory()
            .catch(() => {
                toast.error("Error al eliminar el historial", {
                    description: "No se pudo eliminar el historial de sesiones."
                });
            })
            .then(() => {
                toast.success("¡Historial eliminado!", {
                    description: "El historial de sesiones ha sido eliminado."
                });
                showModal("confirm-delete-history", false);
            });
    }

    return (
        <>
            <ConfirmDestructiveActionModal
                id="confirm-delete-history"
                title="Eliminar historial"
                description="Se eliminará todo el historial de sesiones. Esta acción es irreversible."
                confirmText="eliminar"
                onConfirm={() => handleDelete()}
            />

            {/* Modal for importing history */}
            {/* TODO: Move to a separated component */}
            <Modal
                id="import-history-modal"
                title="Importar historial"
                className="!h-fit"
                onClose={() => setImportedFiles([])}
            >

                <FormField title="1. Copia de seguridad" show={sessions.length > 0}>
                    <p className="text-gray-500">
                        Por seguridad, es recomendable guardar el historial antes de continuar.
                    </p>
                    <Button
                        disabled={sessions.length === 0}
                        onClick={handleExport}
                        icon={copySaved
                            ? <CheckIcon className="size-5" />
                            : <DocDownIcon className="size-5" />
                        }
                        textOnly
                    >
                        Guardar
                    </Button>
                </FormField>

                <FormField title={`${sessions.length > 0 ? "2. " : " "}Importar`}>
                    <p className="text-gray-500">
                        Selecciona el archivo de historial que deseas importar.
                    </p>

                    <SelectFileField
                        maxFiles={1}
                        files={importedFiles}
                        onSelect={setImportedFiles}
                    />
                </FormField>

                <Button
                    disabled={importedFiles.length === 0}
                    onClick={handleImport}
                    icon={<ArchiveDownIcon className="size-5" />}
                    textOnly={importedFiles.length === 0}
                >
                    Importar
                </Button>
            </Modal>

            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title="Ajustes de historial"

                icon={<CrossIcon />}
                onIconClick={onClose}
            />

            {/* Export/Import history */}
            <FormField title="Transferir">
                <div className="w-full flex flex-row gap-2">
                    <Button
                        className="flex-1"
                        onClick={() => showModal("import-history-modal", true)}
                        icon={<ArchiveDownIcon className="size-5" />}
                    >
                        Importar
                    </Button>

                    <Button
                        className="flex-1"
                        onClick={handleExport}
                        disabled={sessions.length === 0}
                        icon={<DocDownIcon className="size-5" />}
                    >
                        Guardar
                    </Button>
                </div>
            </FormField>

            {/* Delete history */}
            <FormField title="">
                <Button
                    className="flex-1"
                    onClick={() => showModal("confirm-delete-history", true)}
                    icon={<TrashIcon className="size-5" />}
                    disabled={sessions.length === 0}
                >
                    Eliminar
                </Button>
            </FormField>


        </>
    );
}