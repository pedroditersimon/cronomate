import { useMemo } from "react";
import { Activity } from "src/features/activity/types/Activity";
import timeTrackService from "src/features/time-track/services/timeTrackService";
import { TimeTrack } from "src/features/time-track/types/TimeTrack";


const untrackedActivityMock: Activity = {
    id: "untracked",
    title: "No categorizadas",
    description: "Actividades varias, como organización, comunicación y espera por dependencias.",
    tracks: [],
    isCollapsed: true
}

export default function useUntrackedActivity(activities: Array<Activity>, range?: TimeTrack) {

    const untrackedActivity = useMemo((): Activity => {
        const allRecords = activities.reduce<Array<TimeTrack>>((acc, activity) => activity.tracks.concat(acc), []);
        const untrackedPeriods = timeTrackService.getUntrackedPeriods(allRecords, range);

        return {
            ...untrackedActivityMock,
            tracks: untrackedPeriods
        }

    }, [activities, range]);

    return untrackedActivity;
}