import { useEffect, useMemo, useRef, useState } from "react";
import { generateId } from "src/shared/utils/generateId";
import clsx from "clsx";
import { toDate } from "src/shared/utils/TimeUtils";
import { Activity } from "src/features/activity/types/Activity";
import ActivityComponent, { ActivityHandle } from "src/features/activity/components/Activity";
import activityService from "src/features/activity/services/activityService";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { newActivityMock } from "src/features/activity/mocks/newActivityMock";
import { DateTime } from "luxon";

interface Props {
    onCreate: (newActivity: Activity) => void;
    onFocusChange?: (focus: boolean) => void;
}


export default function ActivityCreator({ onCreate, onFocusChange }: Props) {
    // local states
    const activityRef = useRef<ActivityHandle | null>(null);
    const [activity, setActivity] = useState<Activity>(newActivityMock);
    const [isFocused, setIsFocused] = useState(false);

    const handleSetFocus = (focus: boolean) => {
        // Colapsar segun el focus
        setActivity({
            ...activity,
            isCollapsed: !focus
        });

        setIsFocused(focus);
        if (onFocusChange) onFocusChange(focus);
    }

    // Focus on keyboard typing
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isFocused) return; // Already focused
            if (document.activeElement !== document.body) return; // Ignore if focusing other element
            if (e.ctrlKey || e.altKey || e.metaKey) return; // Ignore if modifier keys
            if (e.key.length > 1) return; // Ignore special keys
            if (e.key === " ") return; // Ignore spaces

            handleSetActivity({
                ...activity,
                title: e.key
            });
            handleSetFocus(true);
            activityRef.current?.focusTitle();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    const hasChanges = useMemo(() => {
        return activityService.hasChanges(activity, newActivityMock)
    }, [activity])


    const handleCreateActivity = (newActivity: Activity) => {
        // newActivity has no changes
        if (!activityService.hasChanges(newActivity, newActivityMock))
            return;

        const hhmm_now = DateTime.now().toFormat("HH:mm");

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
                start: setStartTimeToNow ? hhmm_now : firstTrack.start, // Keep existing if not starting now
                end: mustRun ? hhmm_now : firstTrack.end, // Keep existing if not running
                status: mustRun ? TimeTrackStatus.RUNNING : TimeTrackStatus.STOPPED,
            }]
        };

        onCreate(newActivityWithRecord);   // crear el activity
        setActivity(newActivityMock);      // reset el placeholder
    }


    // update local activity
    const handleSetActivity = (newActivity: Activity) => {
        // Reset to mock on empty title
        if (newActivity.title.trim().length === 0) {
            setActivity(newActivityMock);
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


    return (
        <div
            className={clsx("transition-opacity", {
                "opacity-25": !isFocused && !hasChanges,
                "opacity-100": isFocused || hasChanges
            })}
            onFocus={() => handleSetFocus(true)}
            onBlur={() => handleSetFocus(false)}
        >
            <ActivityComponent
                ref={activityRef}
                key={activity.id}
                activity={activity}
                onActivityChange={handleSetActivity}
                onTitleConfirm={handleOnTitleConfirm}
                selectTitleOnClick

                isExpanded={isFocused}

                canEdit={true} // Edit only
                canArchive={false}
                canRestore={false}
            />
        </div>
    );
}