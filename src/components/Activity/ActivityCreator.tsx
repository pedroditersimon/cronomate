import { useMemo, useState } from "react";
import { ActivityType } from "../../types/Activity";
import Activity from "./Activity";
import { generateId } from "../../utils/generateId";
import clsx from "clsx";
import { toDate } from "../../utils/TimeUtils";
import recordService from "../../services/recordService";
import activityService from "../../services/activityService";

interface Props {
    onActivityCreated: (newActivity: ActivityType) => void;
}

const activityMock: ActivityType = {
    id: "activityMock",
    title: "Nueva actividad",
    records: [{ id: "recordMock" }],
};

export default function ActivityCreator({ onActivityCreated }: Props) {
    // local states
    const [activity, setActivity] = useState<ActivityType>(activityMock);
    const [focused, setFocused] = useState(false);

    const hasChanges = useMemo(() => {
        return activityService.hasChanges(activity, activityMock)
    }, [activity])

    const handleCreateActivity = (newActivity: ActivityType) => {
        // newActivity has no changes
        if (!activityService.hasChanges(newActivity, activityMock))
            return;

        const now = toDate().getTime();

        // crear nuevo activity
        const newActivityRecord = newActivity.records[0];
        const newActivityWithRecord = {
            id: generateId(),
            title: newActivity.title,
            records: [{
                id: generateId(),
                startTime: newActivityRecord?.startTime || now,
                endTime: newActivityRecord?.endTime || now,
                running: !newActivityRecord?.endTime,
            }]
        };

        onActivityCreated(newActivityWithRecord);   // crear el activity
        setActivity(activityMock);                  // reset el placeholder
    }

    const handleSetActivity = (newActivity: ActivityType) => {
        // Reset to mock on empty title
        if (newActivity.title.trim().length === 0) {
            setActivity(activityMock);
            return;
        }

        const firstRecord = newActivity.records[0];
        // Se ha dado a play -> crear el activity
        if (firstRecord.running || newActivity.records.length > 1) {
            handleCreateActivity({
                ...newActivity,
                records: [firstRecord] // ensure first record only
            });
            return;
        }

        // Seguir actualizando el estado local
        setActivity(newActivity);
    }

    const handleOnTitleConfirm = (newTitle: string) => {
        // crear nuevo activity
        handleCreateActivity({ ...activity, title: newTitle });
    }

    return (
        <div
            className={clsx("transition-opacity", {
                "opacity-25": !focused && !hasChanges,
                "opacity-100": focused || hasChanges
            })}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            <Activity
                activity={activity}
                onActivityChange={handleSetActivity}
                onTitleConfirm={handleOnTitleConfirm}
            />
        </div>
    );
}