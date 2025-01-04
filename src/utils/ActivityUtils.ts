import { ActivityEntryType } from "../types/Activity";
import { getElapsedTime } from "./TimeUtils";

export function getEntriesElapsedTime(entries: Array<ActivityEntryType>) {
    return entries.reduce((acc, entry) =>
        acc + getElapsedTime(entry.start, entry.end), 0);
}