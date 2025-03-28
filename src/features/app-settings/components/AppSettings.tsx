import FormField from "src/shared/components/forms/FormField";
import ToggleTabs from "src/shared/components/interactable/ToggleTabs";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";

export default function AppSettings() {
    return (
        <Container>

            <ContainerTopbar
                title="Ajustes generales"
            >

            </ContainerTopbar>

            <FormField title="Reproducir sonidos">
                <ToggleTabs falseLabel="Desactivado" trueLabel="Reproducir" />
            </FormField>

        </Container>
    );
}