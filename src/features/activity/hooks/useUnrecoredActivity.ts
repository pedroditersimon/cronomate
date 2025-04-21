import { useMemo } from "react";
import { untrackedActivityMock } from "src/features/activity/mocks/untrackedActivityMock";
import { Activity } from "src/features/activity/types/Activity";
import timeTrackService from "src/features/time-track/services/timeTrackService";
import { TimeTrack } from "src/features/time-track/types/TimeTrack";



export default function useUntrackedActivity(activities: Array<Activity>, maxDurationThresholdMs?: number): Activity {

    const untrackedActivity = useMemo((): Activity => {
        const tracks = activities.reduce<Array<TimeTrack>>((acc, activity) => activity.tracks.concat(acc), []);
        let untrackedPeriods = timeTrackService.getUntrackedPeriods(tracks);

        if (maxDurationThresholdMs && maxDurationThresholdMs > 0) {
            untrackedPeriods = untrackedPeriods.filter(t => {
                if (!t.start || !t.end) return true; // Dosnt have start or end

                const durationMs = t.end - t.start;
                return durationMs <= maxDurationThresholdMs;
            });
        }

        return {
            ...untrackedActivityMock,
            tracks: untrackedPeriods
        }

    }, [activities, maxDurationThresholdMs]);

    return untrackedActivity;
}