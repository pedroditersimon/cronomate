import { PomodoroState } from "src/features/pomodoro/types/Pomodoro";

export function getDurationMsByState(state: PomodoroState) {
    if (state === PomodoroState.STOPPED)
        return 0; // No duration when stopped

    return state === PomodoroState.FOCUS
        ? 45 * 60 * 1000 // 45 minutes for focus
        : 10 * 60 * 1000; // 10 minutes for rest
}