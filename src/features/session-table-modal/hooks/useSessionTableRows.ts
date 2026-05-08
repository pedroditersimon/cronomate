import { useMemo } from "react";
import activityService from "src/features/activity/services/activityService";
import { Activity } from "src/features/activity/types/Activity";
import { SessionTableModalRow } from "src/features/session-table-modal/types/SessionTableModal";
import sessionService from "src/features/session/services/sessionService";
import { Session } from "src/features/session/types/Session";
import timeTrackService from "src/features/time-track/services/timeTrackService";
import { TimeUnit } from "src/shared/types/TimeUnit";
import { toDate } from "src/shared/utils/TimeUtils";

interface Props {
    session: Session;
    elapsedTimeUnit: TimeUnit;
    includeDateCol: boolean;
    includeUnrecordedActivity: boolean;
    untrackedActivity: Activity;
    includePausesActivity: boolean;
}

export function useSessionTableRows({
    session,
    elapsedTimeUnit,
    includeUnrecordedActivity,
    untrackedActivity,
    includePausesActivity,
}: Props): SessionTableModalRow[] {
    const hasUntrackedActivity = untrackedActivity.tracks.length > 0;

    return useMemo(() => {
        // row is -> | date | title | description | time |

        let _session = includeUnrecordedActivity && hasUntrackedActivity
            ? sessionService.addActivity(session, untrackedActivity)
            : session; // otherwise, keep the same

        // Filter
        _session = {
            ..._session,
            activities: _session.activities.filter(activity => {
                // Exclude pauses
                if (!includePausesActivity && activityService.isPauseActivity(activity)) return false;
                // Exclude deleted (archived)
                if (activity.isDeleted) return false;
                // Exclude no elapsed time
                const elapsedTimeMs = timeTrackService.getAllElapsedMs(activity.tracks);
                if (elapsedTimeMs <= 0) return false;
                return true;
            })
        };

        return _session.activities.map(activity => {
            const elapsedTimeMs = timeTrackService.getAllElapsedMs(activity.tracks);
            const elapsedTime = elapsedTimeUnit === TimeUnit.HOUR
                ? elapsedTimeMs / 3.6e+6
                : elapsedTimeMs / 60000;
            // Ceil
const elapsedTimeTxt = Math.ceil(elapsedTime * 1000) / 1000;


            // this is a row
            return {
                key: activity.id,
                date: toDate(session.createdTimestamp).toLocaleString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" }),
                title: activity.title,
                description: activity.description || "",
                elapsedTime: elapsedTimeTxt,
            };
        });

    }, [includePausesActivity, includeUnrecordedActivity, hasUntrackedActivity, session, untrackedActivity, elapsedTimeUnit]);
}