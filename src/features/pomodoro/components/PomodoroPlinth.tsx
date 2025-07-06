import { Pomodoro } from "src/features/pomodoro/components/Pomodoro";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";

interface Props {
}

export function PomodoroPlinth({ }: Props) {

    return (
        <Container className="h-fit">
            <ContainerTopbar title="Pomodoro"></ContainerTopbar>
            <Pomodoro></Pomodoro>
        </Container>
    );
};
