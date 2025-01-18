import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, CircleIcon, PlayIcon, StopIcon, TrashIcon } from "../../assets/Icons";
import { RecordType, ActivityType } from "../../types/Activity";
import { isNow, toDate, toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import Record from "./Record";
import clsx from "clsx";
import HSeparator from "../../layouts/HSeparator";
import { generateId } from "../../utils/generateId";
import { findLast } from "lodash";
import recordService from "../../services/recordService";
import activityService from "../../services/activityService";
import Clickable from "../Interactable/Clickable";

interface Props {
    activity: ActivityType;
    onActivityChange: (newActivity: ActivityType) => void;
    onTitleConfirm?: (newTitle: string) => void;

    showDeletedRecords?: boolean;
    readOnly?: boolean;
    selectTitleOnClick?: boolean;
}

export default function Activity({ activity, onActivityChange, onTitleConfirm, showDeletedRecords, readOnly, selectTitleOnClick }: Props) {
    // local states
    const [focused, setFocused] = useState(false);
    const [title, setTitle] = useState(activity.title);
    const [expandRecords, setExpandRecords] = useState(false);

    // sync title if activity changes
    useEffect(() => {
        setTitle(activity.title);
    }, [activity]);

    // calculated states
    const [hasRunningRecords, totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = recordService.getAllElapsedTime(activity.records);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

        const hasRunningRecords = activityService.hasRunningRecords(activity);

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
            handleSetRecord({
                ...lastResumableRecord,
                running: true
            });
            return; // dont do more
        }

        // add a new running record
        const newActivity = activityService.addRecord(activity, {
            id: generateId(),
            startTime: now,
            endTime: now,
            running: true
        });
        onActivityChange(newActivity);
    }


    const handleSetRecord = (newRecord: RecordType) => {
        onActivityChange(activityService.setRecord(activity, newRecord));
    }

    const handleSetTitle = (newTitle: string) => {
        onActivityChange({ ...activity, title: newTitle });
    }

    const handleDelete = () => {
        onActivityChange({
            ...activity,
            deleted: true,
        });
    }

    return (
        <div className="flex flex-col gap-1 min-w-80">
            <div className="flex flex-row gap-1">
                <Clickable
                    className="hover:bg-gray-700"
                    onClick={() => setExpandRecords(prev => !prev)}
                    children={expandRecords
                        ? <ChevronDownIcon />
                        : <ChevronRightIcon />}
                />
                <div
                    className={clsx("group flex flex-row gap-1 w-full box-border rounded-md pl-2", {
                        "bg-red-400": hasRunningRecords,
                        "bg-gray-700": focused,
                        "hover:bg-gray-700": !hasRunningRecords && !readOnly,
                    })}
                >
                    <input
                        className="bg-transparent outline-none flex-grow"
                        placeholder={activity.title}
                        value={title}
                        readOnly={readOnly}
                        onChange={e => {
                            if (readOnly) return;
                            setTitle(e.target.value);
                        }}
                        onFocus={() => {
                            if (readOnly) return;
                            setFocused(true);
                        }}

                        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                            if (selectTitleOnClick) e.currentTarget.select();
                        }}

                        // on confirm input
                        onBlur={() => {
                            if (readOnly) return;
                            setFocused(false);
                            handleSetTitle(title);
                        }}
                        onKeyUp={e => {
                            if (readOnly) return;
                            if (e.key === "Enter") {
                                e.currentTarget.blur();
                                if (onTitleConfirm) setTimeout(() => onTitleConfirm(title), 50);
                                return;
                            }
                            // reset title
                            if (e.key === "Escape") {
                                setTitle(activity.title);
                                // Delay blur to ensure the new state is applied, before calling blur.
                                // This prevents run blur callback with an outdated state.
                                const element = e.currentTarget;
                                setTimeout(() => element.blur, 50); return;
                            }
                        }}
                    />
                    <span className={clsx({ "pr-1": readOnly })} >
                        {totalElapsedTimeTxt}
                    </span>

                    {/* Delete activity btn */}
                    {!readOnly &&
                        <Clickable
                            className="hidden group-hover:block"
                            children={
                                <TrashIcon
                                    className={clsx("hover:bg-red-400",
                                        { "hover:bg-white hover:text-red-400": hasRunningRecords })}
                                />
                            }
                            onClick={handleDelete}
                        />
                    }

                    {/* Play/Stop activity btn */}
                    {!readOnly &&
                        <Clickable
                            onClick={handleRun}
                            children={hasRunningRecords
                                ? <StopIcon className="hover:bg-white hover:text-red-400" />
                                : <PlayIcon className="hover:bg-red-400" />}
                        />
                    }

                </div>
            </div>

            <HSeparator />
            <div className="flex flex-col gap-1 ml-6">
                {activity.records.map((record, i) => {
                    if (record.deleted && !showDeletedRecords && !readOnly) return;
                    if (!record.running && !expandRecords) return;
                    return (<>
                        <Record
                            key={record.id}
                            record={record}
                            onRecordChange={handleSetRecord}
                            readOnly={readOnly}
                        />
                        {i < activity.records.length - 1 && <HSeparator />}
                    </>)
                })}
            </div>

        </div>
    );
}