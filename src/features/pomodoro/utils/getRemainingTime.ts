import { DateTime } from "luxon";
import { PomodoroState } from "src/features/pomodoro/types/Pomodoro";
import { getDurationMsByState } from "src/features/pomodoro/utils/getDurationMsByState";

export function getRemainingTime(startTime: number, state: PomodoroState) {
    const startDate = DateTime.fromMillis(startTime);
    const elapsedMs = DateTime.now().diff(startDate).as("milliseconds");
    const durationMs = getDurationMsByState(state);
    return durationMs - elapsedMs;
}