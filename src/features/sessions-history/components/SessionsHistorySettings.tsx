import { DateTime } from "luxon";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import { CrossIcon } from "src/assets/Icons";
import FormField from "src/shared/components/forms/FormField";
import Button from "src/shared/components/interactable/Button";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import { version } from '../../../../package.json';
import { SavedObject } from "src/shared/types/SavedObject";
import { toast } from "sonner";


interface Props {
    sessions: Array<WorkSession>;
    onClose: () => void;
}

export default function SessionsHistorySettings({ sessions, onClose }: Props) {

    const handleDownloadHistory = () => {
        // 1. Create a saved object
        const savedObject: SavedObject<typeof sessions> = {
            app_version: version,
            generated_date: new Date().getTime(),
            value: sessions
        };

        // 2. Create a blob to download it
        const data = JSON.stringify(savedObject, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // 3. Create the file name
        const formattedDate = DateTime.now().toFormat('yyyy-MM-dd');
        const fileName = `cronomate-history-${formattedDate}`;

        // 4. Download the file
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success("¡Descarga exitosa!", {
            description: (<span>Archivo "{fileName}.json"</span>)
        });
    }

    return (
        <>
            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title="Ajustes de historial"

                icon={<CrossIcon />}
                onIconClick={onClose}
            />

            {/* Download history */}
            <FormField title="Descargar historial">
                <Button
                    onClick={handleDownloadHistory}
                    disabled={sessions.length === 0}
                >
                    Descargar
                </Button>
            </FormField>
        </>
    );
}