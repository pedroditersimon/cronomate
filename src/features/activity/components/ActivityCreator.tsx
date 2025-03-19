import { useMemo, useState } from "react";
import { generateId } from "src/shared/utils/generateId";
import clsx from "clsx";
import { toDate } from "src/shared/utils/TimeUtils";
import { Activity } from "src/features/activity/types/Activity";
import ActivityComponent from "src/features/activity/components/Activity";
import activityService from "src/features/activity/services/activityService";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";


interface Props {
    onCreate: (newActivity: Activity) => void;
}

const activityMock: Activity = {
    id: "activityMock",
    title: "Nueva actividad",
    tracks: [{
        id: "recordMock",
        start: 0,
        end: null,
        status: TimeTrackStatus.STOPPED
    }],
    isCollapsed: true,
};


export default function ActivityCreator({ onCreate: onActivityCreated }: Props) {
    // local states
    const [activity, setActivity] = useState<Activity>(activityMock);
    const [focused, setFocused] = useState(false);


    const hasChanges = useMemo(() => {
        return activityService.hasChanges(activity, activityMock)
    }, [activity])


    const handleCreateActivity = (newActivity: Activity) => {
        // newActivity has no changes
        if (!activityService.hasChanges(newActivity, activityMock))
            return;

        const now = toDate().getTime();

        // Get first record
        const firstTrack = newActivity.tracks[0];

        // create it running if no endTime
        const mustRun = firstTrack.end === null;
        // If mustRun and no startTime, set it to now
        const setStartTimeToNow = mustRun && !firstTrack.start;

        const newActivityWithRecord: Activity = {
            id: generateId(),
            title: newActivity.title,
            tracks: [{
                id: generateId(),
                start: setStartTimeToNow ? now : firstTrack.start, // Keep existing if not starting now
                end: mustRun ? now : firstTrack.end, // Keep existing if not running
                status: mustRun ? TimeTrackStatus.RUNNING : TimeTrackStatus.STOPPED,
            }]
        };

        onActivityCreated(newActivityWithRecord);   // crear el activity
        setActivity(activityMock);                  // reset el placeholder
    }


    // update local activity
    const handleSetActivity = (newActivity: Activity) => {
        // Reset to mock on empty title
        if (newActivity.title.trim().length === 0) {
            setActivity(activityMock);
            return;
        }

        const firstRecord = newActivity.tracks[0];
        // Se ha dado a play -> crear el activity
        if (firstRecord.status === TimeTrackStatus.RUNNING || newActivity.tracks.length > 1) {
            handleCreateActivity({
                ...newActivity,
                tracks: [firstRecord] // ensure first record only
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


    const handleFocus = (focus: boolean) => {
        setFocused(focus);

        // Colapsar segun el focus
        setActivity({
            ...activity,
            isCollapsed: !focus
        });
    }


    return (
        <div
            className={clsx("transition-opacity", {
                "opacity-25": !focused && !hasChanges,
                "opacity-100": focused || hasChanges
            })}
            onFocus={() => handleFocus(true)}
            onBlur={() => handleFocus(false)}
        >
            <ActivityComponent
                key={activity.id}
                activity={activity}
                onActivityChange={handleSetActivity}
                onTitleConfirm={handleOnTitleConfirm}
                selectTitleOnClick
            />
        </div>
    );
}