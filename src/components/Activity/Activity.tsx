import { useMemo, useState } from "react";
import { CircleIcon, PlayIcon, StopIcon } from "../../assets/Icons";
import { ActivityEntryType, ActivityType } from "../../types/Activity";
import { getEntriesElapsedTime } from "../../utils/ActivityUtils";
import { toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import ActivityEntry from "./ActivityEntry";
import ClickableBtn from "../ClickableBtn";
import clsx from "clsx";
import HSeparator from "../HSeparator";
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

        const totalElapsedTime = getEntriesElapsedTime(activity.entries);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

        const hasRunningEntry = activity.entries.some(entry => entry.running);

        return [hasRunningEntry, totalElapsedTimeTxt];
    }, [activity]);


    const handleRun = () => {
        const now = new Date();

        if (hasRunningEntry) {
            // set endTime to Now on running entries
            const newEntries = activity.entries.map(entry => entry.running
                ? ({ ...entry, endTime: now, running: false })
                : entry
            );
            onActivityChange({ ...activity, entries: newEntries });
        }
        else {
            // add new running entry
            const newEntries: typeof activity.entries = [
                ...activity.entries,
                {
                    id: generateId(),
                    startTime: now,
                    endTime: now,
                    running: true
                }
            ];
            onActivityChange({ ...activity, entries: newEntries });
        }
    }


    const handleSetEntry = (id: string, newEntry: ActivityEntryType) => {
        const newEntries = activity.entries.map(entry =>
            entry.id === id ? newEntry : entry // Reemplaza solo en el índice específico
        );
        onActivityChange({ ...activity, entries: newEntries });
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

                    <ClickableBtn
                        onClick={handleRun}
                        children={hasRunningEntry
                            ? <StopIcon className="hover:text-red-400" />
                            : <PlayIcon className="hover:text-red-400" />}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1 ml-6">
                {activity.entries.map(entry => <>
                    <ActivityEntry
                        key={entry.id}
                        entry={entry}
                        onEntryChange={newEntry => handleSetEntry(entry.id, newEntry)}
                    />
                    <HSeparator />
                </>)}
            </div>
        </div>
    );
}