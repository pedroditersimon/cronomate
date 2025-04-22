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
                title="Guardar limites"
                show={!readOnly}
                tooltip={{
                    text: "Se guardarán Inicio, Fin y Duración para próximas jornadas."
                }}
            >
                <ToggleTabs falseLabel="Desactivado" trueLabel="Guardar"
                    value={todaySessionSettings.saveSessionLimits}
                    onSelected={(value) => handleSetSettings({
                        ...todaySessionSettings,
                        saveSessionLimits: value
                    })}
                />
            </FormField>


            <FormField
                title="Detener al superar limites"
                show={!readOnly}
                tooltip={{
                    text: "El temporizador se detendrá automáticamente al superar los limites establecidos.",
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
                tooltip={{
                    text: "El temporizador se detendrá automáticamente al cerrar la página.",
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