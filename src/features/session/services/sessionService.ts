import { Interval } from "luxon";
import activityService from "src/features/activity/services/activityService";
import { Activity } from "src/features/activity/types/Activity";
import timeTrackService from "src/features/time-track/services/timeTrackService";
import { pauseActivityMock } from "src/features/session/mocks/pauseActivityMock";
import { Session } from "src/features/session/types/Session";


function getSessionDurationMs(session: Session): number {

    const tracks = session.activities
        // exclude pause activity
        .filter(act => {
            if (act.id === pauseActivityMock.id) return false;
            if (act.isDeleted) return false;
            return true;
        })
        // get tracks
        .flatMap(activity => activity.tracks);

    const untrackedPeriods = timeTrackService.getUntrackedPeriods(tracks);

    // Filter untracked periods using session duration limit
    const filteredUntrackedPeriods = !session.inactivityThresholdMs
        ? untrackedPeriods // <- no limit
        : untrackedPeriods.filter(track => {
            const maxMs = session.inactivityThresholdMs!;
            return timeTrackService.getElapsedMs(track) <= maxMs;
        });

    const allTracks = tracks.concat(filteredUntrackedPeriods);

    return timeTrackService.getAllElapsedMs(allTracks);
}


function calculateDurationLimit(durationLimit: Session["durationLimit"]) {
    if (!durationLimit.start || !durationLimit.end)
        return durationLimit;

    const interval = Interval.fromISO(`${durationLimit.start}/${durationLimit.end}`);

    const calculatedMillis = interval.isValid
        ? interval.length("milliseconds")
        : null;

    return {
        ...durationLimit,
        millis: calculatedMillis
    };
};

function addActivity(session: Session, newActivity: Activity, fusion: boolean = true) {
    return {
        ...session,
        activities: activityService.add(session.activities, newActivity, fusion)
    };
}

function setActivity(session: Session, newActivity: Activity) {
    return {
        ...session,
        activities: activityService.set(session.activities, newActivity)
    };
};

function setActivities(session: Session, newActivities: Array<Activity>) {
    return {
        ...session,
        activities: newActivities
    };
};

function stopActivities(session: Session) {
    // Stop all activities
    const newActivities = activityService.stopAll(session.activities);

    return {
        ...session,
        activities: newActivities
    } as Session;
}

function updateTimerAndTracks(session: Session) {
    // const now = toDate().getTime();
    let _session = session;

    // Session timer
    // _session = setTimer(_session, {
    //     ...session.timer,
    //     start: session.timer.start || now,
    //     end: now,
    // });

    // Tracks
    _session = setActivities(_session,
        _session.activities.map(activityService.updateRunningTracks)
    );

    return _session;
};


export default {
    getSessionDurationMs,
    calculateDurationLimit,

    addActivity,
    setActivity,
    setActivities,

    stopActivities,
    updateTimerAndTracks
};