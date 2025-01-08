import { useMemo, useState } from "react";
import { CircleIcon, PlayIcon, StopIcon } from "../../assets/Icons";
import { RecordType, ActivityType } from "../../types/Activity";
import { getRecordsElapsedTime } from "../../utils/ActivityUtils";
import { isNow, toDate, toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import Record from "./Record";
import Clickable from "../Clickable";
import clsx from "clsx";
import HSeparator from "../../layouts/HSeparator";
import { generateId } from "../../utils/generateId";
import { findLast } from "lodash";

interface Props {
    activity: ActivityType;
    onActivityChange: (newActivity: ActivityType) => void;
    onTitleConfirm?: () => void;
}

export default function Activity({ activity, onActivityChange, onTitleConfirm }: Props) {
    // local states
    const [focused, setFocused] = useState(false);

    // calculated states
    const [hasRunningRecords, totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = getRecordsElapsedTime(activity.records);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

        const hasRunningRecords = activity.records.some(record => record.running);

        return [hasRunningRecords, totalElapsedTimeTxt];
    }, [activity]);


    const handleRun = () => {
        const now = toDate().getTime();

        if (hasRunningRecords) {
            // set endTime to Now on running records
            const newRecords = activity.records.map(record => record.running
                ? ({ ...record, endTime: now, running: false })
                : record
            );
            onActivityChange({ ...activity, records: newRecords });
            return; // dont do more
        }

        // Find the last resumable record (within 2 seconds of current time) 
        const lastResumableRecord = findLast(activity.records, record => isNow(record.endTime, 60));

        // Resume running the last record if found
        if (lastResumableRecord) {
            handleSetRecord(lastResumableRecord.id, {
                ...lastResumableRecord,
                running: true
            });
            return; // dont do more
        }

        // If no resumable records, add a new running record
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
                        "bg-red-400": hasRunningRecords,
                        "bg-gray-600": !hasRunningRecords
                    })}
                />
                <div
                    className={clsx("flex flex-row gap-1 w-full box-border rounded-md pl-2", {
                        "bg-red-400": hasRunningRecords,
                        "bg-gray-700": focused,
                        "hover:bg-gray-700": !hasRunningRecords,
                    })}
                >
                    <input
                        className="bg-transparent outline-none flex-grow"
                        value={activity.title}
                        onChange={e => handleSetTitle(e.target.value)}
                        onFocus={() => setFocused(true)}

                        // on confirm input
                        onBlur={() => {
                            setFocused(false);
                            if (onTitleConfirm) onTitleConfirm();
                        }}
                        onKeyUp={e => {
                            if (e.key !== "Enter") return;
                            setFocused(false);
                            e.currentTarget.blur();
                        }}
                    />
                    <span>{totalElapsedTimeTxt}</span>

                    <Clickable
                        onClick={handleRun}
                        children={hasRunningRecords
                            ? <StopIcon className="hover:bg-white hover:text-red-400" />
                            : <PlayIcon className="hover:bg-red-400" />}
                    />
                </div>
            </div>

            <HSeparator />
            <div className="flex flex-col gap-1 ml-6">
                {activity.records.map((record, i) => <>
                    <Record
                        key={record.id}
                        record={record}
                        onRecordChange={newRecord => handleSetRecord(record.id, newRecord)}
                    />
                    {i < activity.records.length - 1 && <HSeparator />}
                </>
                )}
            </div>
        </div>
    );
}