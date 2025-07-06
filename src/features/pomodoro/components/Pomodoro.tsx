import clsx from "clsx";
import { DateTime } from "luxon";
import { useState } from "react";
import { toast } from "sonner";
import Button from "src/shared/components/interactable/Button";
import { useAudioPlayer } from "src/shared/hooks/useAudioPlayer";
import useTimer from "src/shared/hooks/useTimer";
import pomodoroEndAudio from "src/assets/audio/pomodoro-end.wav";
import pomodoroAboutEndAudio from "src/assets/audio/pomodoro-end.wav";

enum PomodoroState { FOCUS, REST }

function getDurationByState(state: PomodoroState) {
    return state === PomodoroState.FOCUS
        ? 45 * 60 * 1000 // 25 minutes for focus
        : 10 * 60 * 1000; // 5 minutes for rest
}

function getRemainingTime(startTime: number, state: PomodoroState) {
    const startDate = DateTime.fromMillis(startTime);
    const elapsedMs = DateTime.now().diff(startDate).as("milliseconds");
    const durationMs = getDurationByState(state);
    return durationMs - elapsedMs;
}

interface Props {
}

export function Pomodoro({ }: Props) {
    const { playAudio } = useAudioPlayer({ volume: 0.5 });
    const [pomodoroState, setPomodoroState] = useState<PomodoroState>(PomodoroState.REST);
    const [startTime, setStartTime] = useState<number | null>();
    const [remainingMs, setRemainingMs] = useState(0);
    const [endAlertStatus, setEndAlertStatus] = useState<"waiting" | "alerted" | "ended">("waiting");

    useTimer({
        timerMs: 500,
        pauseOnPageNotVisible: false,
        isRunning: startTime !== null,
    }, () => {
        if (!startTime) return;

        const newRemainingMs = getRemainingTime(startTime, pomodoroState);
        setRemainingMs(newRemainingMs);

        // End alert
        if (newRemainingMs < 1000 && endAlertStatus === "alerted") {
            playAudio(pomodoroEndAudio);
            toast.warning("Pomodoro finalizado!");
            setEndAlertStatus("ended");
        }
        else if (newRemainingMs < 15 * 1000 && endAlertStatus === "waiting") {
            playAudio(pomodoroAboutEndAudio);
            toast.info("Pomodoro esta cerca de finalizar!");
            setEndAlertStatus("alerted");
        }
    });



    function handleChangeState() {
        const newState = pomodoroState === PomodoroState.FOCUS
            ? PomodoroState.REST
            : PomodoroState.FOCUS;
        setPomodoroState(newState);

        const nowMs = DateTime.now().toMillis();
        setStartTime(nowMs);

        const newRemainingMs = getRemainingTime(nowMs, newState);
        setRemainingMs(newRemainingMs - 1000);

        setEndAlertStatus("waiting");
    }

    const overtime = remainingMs < 1000;
    const stateLabel = pomodoroState === PomodoroState.FOCUS ? "Focus" : "Descanso";
    const changeStateLabel = pomodoroState === PomodoroState.FOCUS ? "Descansar" : "Focus"
    const formattedRemaining = overtime ? "00:00"
        : DateTime.fromMillis(remainingMs).toFormat("mm:ss");

    return (
        <div className='flex flex-col gap-5'>
            <div className={clsx("flex flex-col items-center",
                { "text-red-400": overtime }
            )}>
                <span className="text-4xl font-semibold">{formattedRemaining}</span>
                <span>{stateLabel}</span>
            </div>

            <Button
                children={changeStateLabel}
                onClick={handleChangeState}
            />

        </div>
    );
};
