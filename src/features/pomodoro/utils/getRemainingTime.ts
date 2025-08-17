import { DateTime } from "luxon";

export function getRemainingTime(startTime: number, maxDurationMs: number) {
    const startDate = DateTime.fromMillis(startTime);
    const elapsedMs = DateTime.now().diff(startDate).as("milliseconds");
    return maxDurationMs - elapsedMs;
}