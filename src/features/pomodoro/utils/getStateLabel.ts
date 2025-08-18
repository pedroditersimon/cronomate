import { PomodoroState } from "src/features/pomodoro/types/Pomodoro";

export function getStateLabel(state: PomodoroState) {
    switch (state) {
        case PomodoroState.FOCUS:
            return "Focus";
        case PomodoroState.REST:
            return "Descanso";
        case PomodoroState.STOPPED:
        default:
            return "Parado";
    }
}