import { useMemo, useState } from "react";
import { CircleIcon, PlayIcon, StopIcon } from "../../assets/Icons";
import { RecordType, ActivityType } from "../../types/Activity";
import { getRecordsElapsedTime } from "../../utils/ActivityUtils";
import { toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import Record from "./Record";
import Clickable from "../Clickable";
import clsx from "clsx";
import HSeparator from "../../layouts/HSeparator";
import { generateId } from "../../utils/generateId";

interface Props {
    activity: ActivityType;
    onActivityChange: (newActivity: ActivityType) => void;
}

export default function Activity({ activity, onActivityChange }: Props) {
    // local states
    const [focused, setFocused] = useState(false);

    // calculated states
    const [hasRunningEntry, totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = getRecordsElapsedTime(activity.records);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

        const hasRunningEntry = activity.records.some(record => record.running);

        return [hasRunningEntry, totalElapsedTimeTxt];
    }, [activity]);


    const handleRun = () => {
        const now = new Date();

        if (hasRunningEntry) {
            // set endTime to Now on running records
            const newRecords = activity.records.map(record => record.running
                ? ({ ...record, endTime: now, running: false })
                : record
            );
            onActivityChange({ ...activity, records: newRecords });
        }
        else {
            // add new running record
            const newRecords: typeof activity.records = [
                ...activity.records,
                {
                    id: generateId(),
                    startTime: now,
                    endTime: now,
                    running: true
                }
            ];
            onActivityChange({ ...activity, records: newRecords });
        }
    }


    const handleSetRecord = (id: string, newRecord: RecordType) => {
        const newRecords = activity.records.map(record =>
            record.id === id ? newRecord : record
        );
        onActivityChange({ ...activity, records: newRecords });
    }

    const handleSetTitle = (newTitle: string) => {
        onActivityChange({ ...activity, title: newTitle });
    }

    return (
        <div className="flex flex-col gap-1 min-w-80">
            <div className="flex flex-row gap-1">
                <CircleIcon
                    className={clsx({
                        "bg-red-400": hasRunningEntry,
                        "bg-gray-400": !hasRunningEntry
                    })}
                />
                <div
                    className={clsx("flex flex-row gap-1 w-full box-border rounded-lg pl-2", {
                        "bg-red-200": hasRunningEntry,
                        "bg-gray-200": focused,
                        "hover:bg-gray-200": !hasRunningEntry,
                    })}
                >
                    <input
                        className="bg-transparent outline-none flex-grow"
                        value={activity.title}
                        onChange={(e) => handleSetTitle(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                    />
                    <span>{totalElapsedTimeTxt}</span>

                    <Clickable
                        onClick={handleRun}
                        children={hasRunningEntry
                            ? <StopIcon className="hover:text-red-400" />
                            : <PlayIcon className="hover:text-red-400" />}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1 ml-6">
                {activity.records.map(record => <>
                    <Record
                        key={record.id}
                        record={record}
                        onRecordChange={newRecord => handleSetRecord(record.id, newRecord)}
                    />
                    <HSeparator />
                </>)}
            </div>
        </div>
    );
}