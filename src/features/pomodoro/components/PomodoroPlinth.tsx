import { useState } from "react";
import { SettingsIcon } from "src/assets/Icons";
import { Pomodoro } from "src/features/pomodoro/components/Pomodoro";
import { PomodoroSettings } from "src/features/pomodoro/components/PomodoroSettings";
import Container from "src/shared/layouts/Container";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";

interface Props {
}

export function PomodoroPlinth({ }: Props) {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <Container className="h-fit">

            {/* Settings panel */}
            <ContainerOverlay show={showSettings}>
                <PomodoroSettings onClose={() => setShowSettings(false)} />
            </ContainerOverlay>

            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title="Pomodoro"

                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />

            <Pomodoro></Pomodoro>
        </Container>
    );
};
