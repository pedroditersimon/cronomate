import { CircleIcon } from "../../assets/Icons";
import { TimeInput } from "../TimeInput";
import { getElapsedTime, toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import type { RecordType } from "../../types/Activity";
import { useMemo } from "react";
import clsx from "clsx";

interface Props {
    record: RecordType;
    onRecordChange: (newRecord: RecordType) => void;
}

export default function Record({ record, onRecordChange: onRecordChange }: Props) {

    // calculate elapsed time in text format
    const elapsedTimeTxt = useMemo(() => {
        const elapsedTime = getElapsedTime(record.startTime, record.endTime);
        return toElapsedHourMinutesFormat(elapsedTime);
    }, [record]);

    // no record
    if (!record)
        return <div className="text-red-600">Error: Null Record.</div>;

    return (
        <div className="flex flex-row gap-1">
            <CircleIcon
                className={clsx({
                    "bg-red-400": record.running,
                    "bg-gray-400": !record.running
                })}
            />
            <div
                className={clsx("flex flex-row gap-1 w-full rounded-lg pr-2")}
            >
                <TimeInput
                    time={record.startTime}
                    onTimeChange={newStartTime => onRecordChange({ ...record, startTime: newStartTime })}
                />
                -
                <TimeInput
                    time={record.endTime}
                    onTimeChange={newEndTime => onRecordChange({ ...record, endTime: newEndTime })}
                    running={record.running}
                />

                <span className={`ml-auto content-center ${record.running && "text-red-600"}`}>{elapsedTimeTxt}</span>
            </div>
        </div>
    );
}