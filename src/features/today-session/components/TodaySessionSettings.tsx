import useTodaySessionSettigs from "src/features/today-session/hooks/useTodaySessionSettigs";
import { TodaySessionSettings as TodaySessionSettingsType } from "src/features/today-session/types/TodaySessionSettings";
import FormField from "src/shared/components/forms/FormField";
import ToggleTabs from "src/shared/components/interactable/ToggleTabs";


interface Props {
    readOnly?: boolean;
}

export default function TodaySessionSettings({ readOnly }: Props) {
    const { todaySessionSettings, setSettings, save } = useTodaySessionSettigs();

    const handleSetSettings = (newSettings: TodaySessionSettingsType) => {
        setSettings(newSettings);
        save(); // save on edit
    }

    return (
        <>
            <FormField
                title="Guardar inicio y fin"
                show={!readOnly}
                tooltip={{ text: "Guardar inicio y fin para próximas jornadas." }}
            >
                <ToggleTabs falseLabel="Desactivado" trueLabel="Guardar"
                    value={todaySessionSettings.saveTimerOverrides}
                    onSelected={(value) => handleSetSettings({
                        ...todaySessionSettings,
                        saveTimerOverrides: value
                    })}
                />
            </FormField>


            <FormField
                title="Detener al finalizar la jornada"
                show={!readOnly}
                tooltip={{
                    text: "El temporizador se detendrá automáticamente al finalizar la jornada.",
                    showOn: "content"
                }}
            >
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al finalizar"
                    value={todaySessionSettings.stopOnSessionEnd}
                    onSelected={(value) => handleSetSettings({
                        ...todaySessionSettings,
                        stopOnSessionEnd: value
                    })}
                />
            </FormField>


            <FormField
                title="Detener al cerrar la pagina"
                show={!readOnly}
                hint={{
                    text: "El temporizador se detendrá automáticamente al cerrar la página.",
                    show: todaySessionSettings.stopOnClose,
                }}
            >
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al cerrar página"
                    value={todaySessionSettings.stopOnClose}
                    onSelected={(value) => handleSetSettings({
                        ...todaySessionSettings,
                        stopOnClose: value
                    })}
                />
            </FormField>
        </>
    );
}