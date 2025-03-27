import activityService from "src/features/activity/services/activityService";
import { Activity } from "src/features/activity/types/Activity";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";
import { getElapsedTime, toDate } from "src/shared/utils/TimeUtils";


function setTimer(session: WorkSession, newTimer: WorkSessionTimer): WorkSession {
    return {
        ...session,
        timer: { ...newTimer }
    };
};

function getTimerWithOverrides(timer: WorkSessionTimer): TimeTrack {
    return {
        id: timer.id,
        start: timer.startOverride ?? timer.start,
        end: timer.endOverride ?? timer.end,
        status: timer.status
    }
}

function getTimerDurationInMinutes(timer: WorkSessionTimer): number {
    const start = timer.startOverride || timer.start;
    const end = timer.endOverride || timer.end;

    if (!start || !end) return 0;

    return getElapsedTime(toDate(start), toDate(end)) / 60000;
}


function addActivity(session: WorkSession, newActivity: Activity, fusion: boolean = true) {
    return {
        ...session,
        activities: activityService.add(session.activities, newActivity, fusion)
    };
}

function setActivity(session: WorkSession, newActivity: Activity) {
    return {
        ...session,
        activities: activityService.set(session.activities, newActivity)
    };
};

function setActivities(session: WorkSession, newActivities: Array<Activity>) {
    return {
        ...session,
        activities: newActivities
    };
};

function stopTimerAndActivities(session: WorkSession): WorkSession {
    let _session = session;
    const now = toDate().getTime();

    // 1. Stop all activities
    _session = stopActivities(session);

    // 2. Stop timer
    _session.timer = {
        ..._session.timer,
        end: _session.timer.status === TimeTrackStatus.RUNNING
            ? now : _session.timer.end, // now if running, otherwise keep same
        status: TimeTrackStatus.STOPPED
    };

    return _session;
}


function stopActivities(session: WorkSession) {
    // Stop all activities
    const newActivities = activityService.stopAll(session.activities);

    return {
        ...session,
        activities: newActivities
    } as WorkSession;
}

function updateTimerAndTracks(session: WorkSession) {
    const now = toDate().getTime();
    let _session = session;

    // Session timer
    _session = setTimer(_session, {
        ...session.timer,
        start: session.timer.start || now,
        end: now,
    });

    // Tracks
    _session = setActivities(_session,
        _session.activities.map(activityService.updateRunningTracks)
    );

    return _session;
};

export default {
    setTimer,
    getTimerWithOverrides,
    getTimerDurationInMinutes,

    addActivity,
    setActivity,
    setActivities,

    stopActivities,
    stopTimerAndActivities,
    updateTimerAndTracks
};