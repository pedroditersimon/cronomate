import { useMemo } from "react";
import { DateTime } from "luxon";
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
    includeUnrecordedActivity: boolean;
    untrackedActivity: Activity;
    includePausesActivity: boolean;
    splitDaily: boolean;
}

export function useSessionTableRows({
    session,
    elapsedTimeUnit,
    includeUnrecordedActivity,
    untrackedActivity,
    includePausesActivity,
    splitDaily,
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

        return _session.activities.flatMap(activity => {
            const elapsedTimeMs = timeTrackService.getAllElapsedMs(activity.tracks);
            const elapsedTime = elapsedTimeUnit === TimeUnit.HOUR
                ? elapsedTimeMs / 3.6e+6
                : elapsedTimeMs / 60000;
            // Ceil
            const elapsedTimeTxt = Math.ceil(elapsedTime * 1000) / 1000;


            // this is a row
            const row = {
                key: activity.id,
                date: DateTime.fromJSDate(toDate(session.createdTimestamp)).toFormat("dd/MM/yyyy"),
                project: activity.project || "",
                title: activity.title,
                description: activity.description || "",
                elapsedTime: elapsedTimeTxt,
            };
            if (splitDaily && activity.title.toLowerCase().includes("daily")) {
                const half = { ...row, elapsedTime: elapsedTimeTxt / 2 };
                return [half, { ...half, key: `${activity.id}:daily-half` }];
            }
            return [row];
        });

    }, [includePausesActivity, includeUnrecordedActivity, hasUntrackedActivity, session, untrackedActivity, elapsedTimeUnit, splitDaily]);
}
