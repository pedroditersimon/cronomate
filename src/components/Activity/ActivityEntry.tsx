import { CircleIcon } from "../../assets/Icons";
import { TimeInput } from "../TimeInput";
import { getElapsedTime, toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import type { ActivityEntryType } from "../../types/Activity";
import { useMemo } from "react";
import clsx from "clsx";

interface Props {
    entry: ActivityEntryType;
    onEntryChange: (newEntry: ActivityEntryType) => void;
}

export default function ActivityEntry({ entry, onEntryChange }: Props) {

    // calculate elapsed time in text format
    const elapsedTimeTxt = useMemo(() => {
        const elapsedTime = getElapsedTime(entry.startTime, entry.endTime);
        return toElapsedHourMinutesFormat(elapsedTime);
    }, [entry]);

    // no entry
    if (!entry)
        return <div className="text-red-600">Error: Null Entry.</div>;

    return (
        <div className="flex flex-row gap-1">
            <CircleIcon
                className={clsx({
                    "bg-red-400": entry.running,
                    "bg-gray-400": !entry.running
                })}
            />
            <div
                className={clsx("flex flex-row gap-1 w-full rounded-lg pr-2")}
            >
                <TimeInput
                    time={entry.startTime}
                    onTimeChange={newStartTime => onEntryChange({ ...entry, startTime: newStartTime })}
                />
                -
                <TimeInput
                    time={entry.endTime}
                    onTimeChange={newEndTime => onEntryChange({ ...entry, endTime: newEndTime })}
                    running={entry.running}
                />

                <span className={`ml-auto content-center ${entry.running && "text-red-600"}`}>{elapsedTimeTxt}</span>
            </div>
        </div>
    );
}