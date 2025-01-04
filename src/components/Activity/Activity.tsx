import { CircleIcon, PlayIcon } from "../../assets/Icons";
import { ActivityType } from "../../types/Activity";
import { getEntriesElapsedTime } from "../../utils/ActivityUtils";
import { toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import ActivityEntry from "./ActivityEntry";


export default function Activity({ name, entries }: ActivityType) {
    const running = false;
    const totalElapsedTime = getEntriesElapsedTime(entries);
    const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

    return (
        <div className="flex flex-col gap-1 min-w-80">
            <div className="flex flex-row gap-1">
                <CircleIcon />
                <div
                    className="flex flex-row gap-1 w-full px-1
                    border-solid rounded-lg border-2 border-gray-700"
                >
                    <span>{name}</span>
                    <span className="ml-auto">{totalElapsedTimeTxt}</span>
                    <PlayIcon />
                </div>
            </div>

            <div className="flex flex-col gap-1 ml-10">
                {entries.map(entry => (
                    <ActivityEntry start={entry.start} end={entry.end} />
                ))}
            </div>
        </div>
    );
}