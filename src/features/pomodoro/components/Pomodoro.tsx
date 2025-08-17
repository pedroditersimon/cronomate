import clsx from "clsx";
import { DateTime } from "luxon";
import { toast } from "sonner";
import Button from "src/shared/components/interactable/Button";
import { useAudioPlayer } from "src/shared/hooks/useAudioPlayer";
import useTimer from "src/shared/hooks/useTimer";
import pomodoroEndAudio from "src/assets/audio/pomodoro-end.wav";
import pomodoroAboutEndAudio from "src/assets/audio/pomodoro-end.wav";
import { StopIcon, } from "src/assets/Icons";
import { PomodoroState } from "src/features/pomodoro/types/Pomodoro";
import { usePomodoro } from "src/features/pomodoro/hooks/usePomodoro";
import { getChangeStateLabel } from "src/features/pomodoro/utils/getChangeStateLabel";
import { getStateLabel } from "src/features/pomodoro/utils/getStateLabel";

export function Pomodoro() {
    const pomodoro = usePomodoro();
    const { playAudio } = useAudioPlayer({ volume: 0.5 });

    const overtime = pomodoro.remainingMs < 1000;
    const runTimer = pomodoro.startTime !== null
        && (pomodoro.endAlertStatus !== "ended" || pomodoro.settings.continueOnEnd);

    useTimer({
        timerMs: 500,
        pauseOnPageNotVisible: false,
        isRunning: runTimer,
    }, () => {

        // TODO: move to centralized app tittle management
        const stateLabel = getStateLabel(pomodoro.state);
        window.document.title = `${stateLabel} ${DateTime.fromMillis(pomodoro.remainingMs).toFormat("mm:ss")}`;

        pomodoro.update();

        // End alert
        if (pomodoro.endAlertStatus === "alerted" && pomodoro.remainingMs < 1000) {
            playAudio(pomodoroEndAudio);
            toast.success("Pomodoro finalizado!");
            pomodoro.setEndAlertStatus("ended");
        }
        // About to end alert
        else if (pomodoro.endAlertStatus === "waiting" &&
            pomodoro.settings.alertOnRemainingMs && // <- Alert is enabled
            pomodoro.remainingMs < pomodoro.settings.alertOnRemainingMs) {
            playAudio(pomodoroAboutEndAudio);
            toast.info("Pomodoro esta cerca de finalizar!");
            pomodoro.setEndAlertStatus("alerted");
        }
    });


    const stateLabel = getStateLabel(pomodoro.state);
    const changeStateLabel = getChangeStateLabel(pomodoro.state);
    const formattedRemaining = overtime ? "00:00"
        : DateTime.fromMillis(pomodoro.remainingMs).toFormat("mm:ss");

    return (
        <div className='flex flex-col gap-5'>
            <div className={clsx("flex flex-col items-center",
                { "text-red-400": overtime }
            )}>
                <span className="text-4xl font-semibold">{formattedRemaining}</span>
                <span>{stateLabel}</span>
            </div>

            <div className="flex flex-row gap-2 justify-center">
                {pomodoro.state !== PomodoroState.STOPPED &&
                    <Button
                        icon={<StopIcon className="w-5 group-hover:text-red-400" />}
                        onClick={pomodoro.stop}
                    />
                }
                <Button
                    children={changeStateLabel}
                    onClick={pomodoro.changeToNextState}
                />
            </div>
        </div>
    );
};
