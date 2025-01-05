import { RecordType } from "../types/Activity";
import { getElapsedTime } from "./TimeUtils";

export function getRecordsElapsedTime(records: Array<RecordType>) {
    return records.reduce((acc, record) =>
        acc + getElapsedTime(record.startTime, record.endTime), 0);
}