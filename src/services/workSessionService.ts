import { ActivityType, RecordType, WorkSessionType } from "../types/Activity";
import { toDate } from "../utils/TimeUtils";
import activityService from "./activityService";


function setTimer(session: WorkSessionType, newTimer: RecordType) {
    return {
        ...session,
        timer: { ...newTimer }
    };
};

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

    addActivity,
    setActivity,
    setActivities,

    stopTimerAndActivities
};