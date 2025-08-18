import { PomodoroState } from "src/features/pomodoro/types/Pomodoro";

export function getChangeStateLabel(state: PomodoroState) {
    switch (state) {
        case PomodoroState.FOCUS:
            return "Descansar";
        case PomodoroState.REST:
            return "Focus";
        case PomodoroState.STOPPED:
        default:
            return "Iniciar";
    }
}