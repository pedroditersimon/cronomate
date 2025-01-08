import { RecordType } from "../types/Activity";
import { getElapsedTime, toDate } from "./TimeUtils";

export function getRecordsElapsedTime(records: Array<RecordType>) {
    return records.reduce((acc, record) => {
        const elapsedTime = getElapsedTime(toDate(record.startTime), toDate(record.endTime));
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}