import { CircleIcon, TrashIcon } from "src/assets/Icons";

import { getElapsedTime, isNow, toDate, convertElapsedTimeToText } from "src/utils/TimeUtils";
import type { RecordType } from "src/types/Activity";
import { useMemo } from "react";
import clsx from "clsx";
import { TimeInput } from "src/components/interactable/TimeInput";
import Clickable from "src/components/interactable/Clickable";


interface Props {
    record: RecordType;
    onRecordChange: (newRecord: RecordType) => void;
    readOnly?: boolean;
}


export default function Record({ record, onRecordChange, readOnly }: Props) {

    // calculate elapsed time in text format
    const elapsedTimeTxt = useMemo(() => {
        const elapsedTime = getElapsedTime(toDate(record.startTime, false), toDate(record.endTime, false));
        return convertElapsedTimeToText(elapsedTime);
    }, [record]);


    // no record
    if (!record)
        return <div className="text-red-400">Error: Null Record.</div>;


    const handleDelete = () => {
        onRecordChange({
            ...record,
            deleted: true,
        });
    }


    return (
        <div
            className={clsx("flex flex-row gap-1 transition-opacity duration-300 group",
                { "strike-div opacity-50": record.deleted }
            )}
        >
            <CircleIcon
                className={clsx({
                    "bg-red-400": record.running,
                    "bg-gray-700": !record.running
                })}
            />

            <div
                className={clsx("flex flex-row gap-1 w-full rounded-lg")}
            >
                <TimeInput
                    time={record.startTime}
                    onTimeChange={newStartTime => onRecordChange({
                        ...record,
                        startTime: newStartTime
                    })}
                    readOnly={readOnly}
                />
                -
                <TimeInput
                    time={record.endTime}
                    onTimeChange={newEndTime => onRecordChange({
                        ...record,
                        endTime: newEndTime,
                        running: isNow(newEndTime) && record.running // Stop running if time has changed
                    })}
                    running={record.running}
                    readOnly={readOnly}
                />

                {/* Elapsed Time text */}
                <span
                    className={clsx("ml-auto content-center box-border",
                        {
                            "text-red-400": record.running,
                            "pr-1": readOnly
                        }
                    )}
                    children={elapsedTimeTxt}
                />

                {/* Delete record btn */}
                {!readOnly &&
                    <Clickable
                        className="hidden group-hover:block"
                        children={<TrashIcon className="hover:bg-red-400" />}
                        onClick={handleDelete}
                    />
                }

            </div>
        </div>
    );
}