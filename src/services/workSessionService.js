import { getElapsedTime, toDate } from "src/utils/TimeUtils";
import activityService from "./activityService";
function setTimer(session, newTimer) {
    return Object.assign(Object.assign({}, session), { timer: Object.assign({}, newTimer) });
}
;
function getTimerWithOverrides(timer) {
    var _a, _b;
    return {
        id: timer.id,
        startTime: (_a = timer.startTimeOverride) !== null && _a !== void 0 ? _a : timer.startTime,
        endTime: (_b = timer.endTimeOverride) !== null && _b !== void 0 ? _b : timer.endTime,
    };
}
function getTimerDurationInMinutes(timer) {
    const startTime = timer.startTimeOverride || timer.startTime;
    const endTime = timer.endTimeOverride || timer.endTime;
    if (!startTime || !endTime)
        return 0;
    return getElapsedTime(toDate(startTime), toDate(endTime)) / 60000;
}
function addActivity(session, newActivity) {
    return Object.assign(Object.assign({}, session), { activities: activityService.add(session.activities, newActivity) });
}
function setActivity(session, newActivity) {
    return Object.assign(Object.assign({}, session), { activities: activityService.set(session.activities, newActivity) });
}
;
function setActivities(session, newActivities) {
    return Object.assign(Object.assign({}, session), { activities: newActivities });
}
;
function stopTimerAndActivities(session) {
    // not running
    if (!session.timer.running)
        return session;
    const now = toDate().getTime();
    // 1. Stop timer
    const newTimer = Object.assign(Object.assign({}, session.timer), { endTime: now, running: false });
    // 2. Stop all activities
    const newActivities = activityService.stopAll(session.activities);
    return Object.assign(Object.assign({}, session), { timer: newTimer, activities: newActivities });
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
