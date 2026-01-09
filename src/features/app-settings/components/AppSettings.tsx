import useAppSettings from "src/features/app-settings/hooks/useAppSettings";
import FormField from "src/shared/components/forms/FormField";
import ToggleTabs from "src/shared/components/interactable/ToggleTabs";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import useTodaySession from "src/features/today-session/hooks/useTodaySession";
import Button from "src/shared/components/interactable/Button";
import { environment } from "src/shared/config/environment";


export default function AppSettings() {
    const { appSettings, setAppSettings } = useAppSettings();
    const { saveInHistoryAndReset } = useTodaySession();

    const showDevTools = environment.showDevTools;


    return (
        <Container>

            <ContainerTopbar title="Ajustes generales" />

            <FormField title="Reproducir sonidos">
                <ToggleTabs
                    falseLabel="Desactivado"
                    trueLabel="Reproducir"

                    onSelected={value => setAppSettings({
                        ...appSettings,
                        soundsEnabled: value
                    })}
                    value={appSettings.soundsEnabled}
                />
            </FormField>

            {showDevTools && (
                <>
                    <ContainerTopbar title="Dev Tools" />
                    <FormField title="Acciones de desarrollo">
                        <Button onClick={saveInHistoryAndReset}>
                            Guardar Jornada
                        </Button>
                    </FormField>
                </>
            )}

        </Container>

    );
}