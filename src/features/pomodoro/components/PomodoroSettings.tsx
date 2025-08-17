import { CrossIcon } from "src/assets/Icons";
import { usePomodoro } from "src/features/pomodoro/hooks/usePomodoro";
import FormField from "src/shared/components/forms/FormField";
import { TimeDurationInput } from "src/shared/components/interactable/TimeDurationInput";
import ToggleTabs from "src/shared/components/interactable/ToggleTabs";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";

interface Props {
    onClose: () => void;
}

export function PomodoroSettings({ onClose, }: Props) {

    const { settings, setSettings } = usePomodoro();

    const handleFocusDurationChange = (millis: number | null) => {
        if (millis === null) return;

        setSettings({
            ...settings,
            focusDurationMs: millis,
        });
    };

    const handleRestDurationChange = (millis: number | null) => {
        if (millis === null) return;

        setSettings({
            ...settings,
            restDurationMs: millis,
        });
    };

    const handleContinueOnEndChange = (value: boolean) => {
        setSettings({
            ...settings,
            continueOnEnd: value,
        });
    }

    const handleAlertOnRemainingChange = (millis: number | null) => {
        setSettings({
            ...settings,
            alertOnRemainingMs: millis,
        });
    };

    return (
        <>
            {/* Topbar */}
            <ContainerTopbar
                title="Ajustes"
                icon={<CrossIcon />}
                onIconClick={onClose}
            />

            <div className="flex flex-row gap-5">
                <FormField title="Descanso" className="flex items-center">
                    <TimeDurationInput
                        className="max-w-full w-full"
                        millis={settings.restDurationMs ?? undefined}
                        onChange={handleRestDurationChange}
                    />
                </FormField>

                <FormField title="Focus" className="w-full flex items-center">
                    <TimeDurationInput
                        className="max-w-full w-full"
                        millis={settings.focusDurationMs}
                        onChange={handleFocusDurationChange}
                    />
                </FormField>
            </div>

            <FormField
                title="Auto-siguiente"
                className="w-full flex"
                tooltip={{ text: "Continuar automáticamente con el siguiente estado al finalizar timer." }}
            >
                <ToggleTabs
                    trueLabel="Avanzar"
                    falseLabel="Parar"
                    value={settings.continueOnEnd}
                    onSelected={handleContinueOnEndChange}
                />
            </FormField>

            <FormField
                title="Notificar antes de finalizar"
                className="w-full flex"
                tooltip={{ text: "Configura a cuántos minutos se notificará antes de que termine el timer." }}
            >
                <TimeDurationInput
                    className="max-w-full w-full"
                    millis={settings.alertOnRemainingMs ?? undefined}
                    onChange={handleAlertOnRemainingChange}
                />
            </FormField>
        </>
    );
};
