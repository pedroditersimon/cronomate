import { RecordType } from "../types/Activity";
import { getElapsedTime, toDate } from "./TimeUtils";

export function getRecordsElapsedTime(records: Array<RecordType>) {
    return records.reduce((acc, record) =>
        acc + getElapsedTime(toDate(record.startTime), toDate(record.endTime)), 0);
}