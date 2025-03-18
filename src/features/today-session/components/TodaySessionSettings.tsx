
import useTodaySessionSettigs from "src/features/today-session/hooks/useTodaySessionSettigs";
import { TodaySessionSettings } from "src/features/today-session/types/TodaySessionSettings";
import FormField from "src/shared/components/forms/FormField";
import ToggleTabs from "src/shared/components/interactable/ToggleTabs";



interface Props {
    readOnly?: boolean;
}


export default function TodaySessionSettings({ readOnly }: Props) {

    const { todaySessionSettings, setSettings, save } = useTodaySessionSettigs();

    const handleSetSettings = (newSettings: TodaySessionSettings) => {
        setSettings(newSettings);
        save(); // save on edit
    }

    return (
        <>
            <FormField title="Detener temporizador al finalizar la jornada" show={!readOnly}>
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al finalizar"
                    value={todaySessionSettings.stopOnSessionEnd}
                    onSelected={(value) => handleSetSettings({
                        ...todaySessionSettings,
                        stopOnSessionEnd: value
                    })}
                />
                {todaySessionSettings.stopOnSessionEnd && <p className="text-gray-500 text-sm">El temporizador se detendrá automáticamente al finalizar la jornada.</p>}
            </FormField>


            <FormField title="Detener temporizador al cerrar la pagina" show={!readOnly}>
                <ToggleTabs falseLabel="Desactivado" trueLabel="Al cerrar página"
                    value={todaySessionSettings.stopOnClose}
                    onSelected={(value) => handleSetSettings({
                        ...todaySessionSettings,
                        stopOnClose: value
                    })}
                />
                {todaySessionSettings.stopOnClose && <p className="text-gray-500 text-sm">El temporizador se detendrá automáticamente al cerrar la página.</p>}
            </FormField>
        </>
    );
}