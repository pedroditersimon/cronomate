import useAppSettings from "src/features/app-settings/hooks/useAppSettings";
import FormField from "src/shared/components/forms/FormField";
import ToggleTabs from "src/shared/components/interactable/ToggleTabs";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";

export default function AppSettings() {
    const { appSettings, setAppSettings } = useAppSettings();

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

        </Container>
    );
}