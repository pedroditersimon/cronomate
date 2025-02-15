import { ActivityType, RecordType, WorkSessionTimerType, WorkSessionType } from "src/types/Activity";
import { getElapsedTime, toDate } from "src/utils/TimeUtils";
import activityService from "./activityService";


function setTimer(session: WorkSessionType, newTimer: RecordType) {
    return {
        ...session,
        timer: { ...newTimer }
    };
};

function getTimerWithOverrides(timer: WorkSessionTimerType): RecordType {
    return {
        id: timer.id,
        startTime: timer.startTimeOverride ?? timer.startTime,
        endTime: timer.endTimeOverride ?? timer.endTime,
    }
}

function getTimerDurationInMinutes(timer: WorkSessionTimerType): number {
    const startTime = timer.startTimeOverride || timer.startTime;
    const endTime = timer.endTimeOverride || timer.endTime;

    if (!startTime || !endTime) return 0;

    return getElapsedTime(toDate(startTime), toDate(endTime)) / 60000;
}


function addActivity(session: WorkSessionType, newActivity: ActivityType) {
    return {
        ...session,
        activities: activityService.add(session.activities, newActivity)
    };
}

function setActivity(session: WorkSessionType, newActivity: ActivityType) {
    return {
        ...session,
        activities: activityService.set(session.activities, newActivity)
    };
};

function setActivities(session: WorkSessionType, newActivities: Array<ActivityType>) {
    return {
        ...session,
        activities: newActivities
    };
};

function stopTimerAndActivities(session: WorkSessionType) {
    // not running
    if (!session.timer.running) return session;

    const now = toDate().getTime();

    // 1. Stop timer
    const newTimer = {
        ...session.timer,
        endTime: now,
        running: false
    };

    // 2. Stop all activities
    const newActivities = activityService.stopAll(session.activities);

    return {
        ...session,
        timer: newTimer,
        activities: newActivities
    } as WorkSessionType;
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