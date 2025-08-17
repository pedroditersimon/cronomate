import { DateTime } from "luxon";
import { Pomodoro, PomodoroState } from "src/features/pomodoro/types/Pomodoro";
import { PomodoroSettings } from "src/features/pomodoro/types/PomodoroSettings";

function changeToNextState(pomodoro: Pomodoro, settings: PomodoroSettings): Pomodoro {
    const { focusDurationMs, restDurationMs } = settings;
    const nowMs = DateTime.now().toMillis();
    const [newState, newRemainingMs] = pomodoro.state === PomodoroState.FOCUS
        ? [PomodoroState.REST, restDurationMs]
        : [PomodoroState.FOCUS, focusDurationMs];
    return {
        ...pomodoro,
        state: newState,
        startTime: nowMs,
        remainingMs: newRemainingMs,
        endAlertStatus: "waiting",
    };
}

export default {
    changeToNextState
};