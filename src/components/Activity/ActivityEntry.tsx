import { CircleIcon } from "../../assets/Icons";
import { TimeInput } from "../TimeInput";
import { getElapsedTime, toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import type { ActivityEntryType } from "../../types/Activity";


export default function ActivityEntry({ start, end }: ActivityEntryType) {

    const elapsedTime = getElapsedTime(start, end);
    const elapsedTimeTxt = toElapsedHourMinutesFormat(elapsedTime);

    return (
        <div className="flex flex-row gap-1">
            <CircleIcon />
            <div
                className="flex flex-row gap-1 w-full p-1"
            >
                <TimeInput time={start} />
                -
                <TimeInput time={end} />
                <span className="ml-auto content-center">{elapsedTimeTxt}</span>
            </div>
        </div>
    );
}