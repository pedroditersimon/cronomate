import recordService from "./recordService";
function add(list, activity) {
    // already exists!
    if (list.some(item => item.id === activity.id)) {
        throw new Error(`The activity with ID ${activity.id} already exists.`);
    }
    return [...list, Object.assign({}, activity)];
}
function set(list, activity) {
    let found = false;
    const updatedList = list.map(item => {
        if (item.id === activity.id) {
            found = true;
            return Object.assign({}, activity);
        }
        return item;
    });
    if (!found) {
        throw new Error(`The activity with ID ${activity.id} does not exist.`);
    }
    return updatedList;
}
function stop(activity) {
    return Object.assign(Object.assign({}, activity), { records: recordService.stopAll(activity.records) });
}
function stopAll(list) {
    return list.map(activity => stop(activity));
}
;
function hasChanges(activity, mock) {
    if (!activity.title.includes(mock.title))
        return true; // title has changed
    return recordService.hasAnyTime(activity.records); // records has changed
}
function getAllElapsedTime(activities) {
    return activities.reduce((acc, activity) => {
        // dont include deleted activity
        if (activity.isDeleted)
            return acc;
        const elapsedTime = recordService.getAllElapsedTime(activity.records);
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}
//#region Handle records
function setRecord(activity, record) {
    const updatedActivity = Object.assign(Object.assign({}, activity), { records: recordService.set(activity.records, record) });
    // order records when add
    return orderRecordsByStartTime(updatedActivity);
}
function addRecord(activity, record) {
    const updatedActivity = Object.assign(Object.assign({}, activity), { records: recordService.add(activity.records, record) });
    // order records when add
    return orderRecordsByStartTime(updatedActivity);
}
function hasRunningRecords(activity) {
    return recordService.hasRunning(activity.records);
}
function orderRecordsByStartTime(activity) {
    return Object.assign(Object.assign({}, activity), { records: recordService.orderAllByStartTime(activity.records) });
}
export default {
    // Handle activities
    add,
    set,
    stop,
    stopAll,
    hasChanges,
    // Handle records
    setRecord,
    addRecord,
    hasRunningRecords,
    orderRecordsByStartTime,
    getAllElapsedTime
};
