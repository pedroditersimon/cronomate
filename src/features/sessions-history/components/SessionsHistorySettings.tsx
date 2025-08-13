import { Session } from "src/features/session/types/Session";
import { CrossIcon, ExportIcon, ImportIcon, TrashIcon } from "src/assets/Icons";
import FormField from "src/shared/components/forms/FormField";
import Button from "src/shared/components/interactable/Button";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import { toast } from "sonner";
import sessionHistoryService from "src/features/sessions-history/services/sessionHistoryService";
import { ConfirmDestructiveActionModal } from "src/shared/components/ConfirmDestructiveActionModal";
import { showModal } from "src/shared/components/Modal";


interface Props {
    sessions: Array<Session>;
    onClose: () => void;
}

export default function SessionsHistorySettings({ sessions, onClose }: Props) {
    const handleExport = () => {
        const { fileName } = sessionHistoryService.exportHistoryWithDownload(sessions);

        toast.success("¡Descarga exitosa!", {
            description: (<span>Archivo "{fileName}"</span>)
        });
    }

    const handleImport = () => {
        sessionHistoryService.importHistory();

        toast.success("¡Importación exitosa!", {
            description: "El historial se ha importado correctamente."
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
                confirmText="eliminar historial"
                onConfirm={() => handleDelete()}
            />

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
                        onClick={handleImport}
                        icon={<ImportIcon className="size-5" />}
                    >
                        Importar
                    </Button>

                    <Button
                        className="flex-1"
                        onClick={handleExport}
                        disabled={sessions.length === 0}
                        icon={<ExportIcon className="size-5" />}
                    >
                        Exportar
                    </Button>
                </div>
            </FormField>

            {/* Delete history */}
            <FormField title="">
                <Button
                    className="flex-1"
                    onClick={() => showModal("confirm-delete-history", true)}
                    icon={<TrashIcon className="size-5" />}
                >
                    Eliminar
                </Button>
            </FormField>
        </>
    );
}