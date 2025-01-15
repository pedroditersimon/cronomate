import { CircleIcon, TrashIcon } from "../../assets/Icons";
import { TimeInput } from "../TimeInput";
import { getElapsedTime, isNow, toDate, toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import type { RecordType } from "../../types/Activity";
import { useMemo, useState } from "react";
import clsx from "clsx";
import Clickable from "../Clickable";

interface Props {
    record: RecordType;
    onRecordChange: (newRecord: RecordType) => void;
    readOnly?: boolean;
}

export default function Record({ record, onRecordChange, readOnly }: Props) {
    const [isHover, setIsHover] = useState(false);


    // calculate elapsed time in text format
    const elapsedTimeTxt = useMemo(() => {
        const elapsedTime = getElapsedTime(toDate(record.startTime, false), toDate(record.endTime, false));
        return toElapsedHourMinutesFormat(elapsedTime);
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
            className={clsx("flex flex-row gap-1 transition-opacity duration-300",
                { "strike-div opacity-50": record.deleted }
            )}
            onPointerEnter={() => setIsHover(true)}
            onPointerLeave={() => setIsHover(false)}
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
                    className={clsx("ml-auto content-center",
                        {
                            "text-red-400": record.running,
                            "pr-1": !isHover || readOnly
                        }
                    )}
                    children={elapsedTimeTxt}
                />

                {/* Delete record btn */}
                {!readOnly &&
                    <Clickable
                        className={clsx({ "hidden": !isHover, })}
                        children={<TrashIcon className="hover:bg-red-400" />}
                        onClick={handleDelete}
                    />
                }

            </div>
        </div>
    );
}