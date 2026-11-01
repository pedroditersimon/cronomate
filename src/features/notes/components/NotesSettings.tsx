import { CrossIcon } from "src/assets/Icons";
import { useNotesSettings } from "src/features/notes/hooks/useNotesSettings";
import FormField from "src/shared/components/forms/FormField";
import { TimeDurationInput } from "src/shared/components/interactable/TimeDurationInput";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";

interface Props {
    onClose: () => void;
}

export function NotesSettings({ onClose }: Props) {
    const { settings, setSettings } = useNotesSettings();

    return <>
        <ContainerTopbar
            title="Ajustes"
            icon={<CrossIcon />}
            onIconClick={onClose}
        />

        <FormField
            title="Anticipacion de alerta"
            tooltip={{ text: "Define con cuánta anticipación se avisa que vence un ítem." }}
        >
            <TimeDurationInput
                className="max-w-full w-full"
                millis={settings.alertBeforeDueMs}
                onChange={millis => {
                    if (millis === null) return;
                    setSettings({ ...settings, alertBeforeDueMs: millis });
                }}
            />
        </FormField>
    </>;
}
