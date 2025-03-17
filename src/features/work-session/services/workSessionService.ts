import activityService from "src/features/activity/services/activityService";
import { Activity } from "src/features/activity/types/Activity";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";
import { getElapsedTime, toDate } from "src/shared/utils/TimeUtils";


function setTimer(session: WorkSession, newTimer: TimeTrack) {
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


function addActivity(session: WorkSession, newActivity: Activity) {
    return {
        ...session,
        activities: activityService.add(session.activities, newActivity)
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

function stopTimerAndActivities(session: WorkSession) {
    // not running
    if (session.timer.status !== TimeTrackStatus.RUNNING) return session;

    const now = toDate().getTime();

    // 1. Stop timer
    const newTimer = {
        ...session.timer,
        end: now,
        running: false
    };

    // 2. Stop all activities
    const newActivities = activityService.stopAll(session.activities);

    return {
        ...session,
        timer: newTimer,
        activities: newActivities
    } as WorkSession;
}

export default {
    setTimer,
    getTimerWithOverrides,
    getTimerDurationInMinutes,

    addActivity,
    setActivity,
    setActivities,

    stopTimerAndActivities
};