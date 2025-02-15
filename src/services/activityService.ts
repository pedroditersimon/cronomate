import { ActivityType, RecordType } from "src/types/Activity";
import recordService from "./recordService";


function add(list: Array<ActivityType>, activity: ActivityType): Array<ActivityType> {
    // already exists!
    if (list.some(item => item.id === activity.id)) {
        throw new Error(`The activity with ID ${activity.id} already exists.`);
    }

    return [...list, { ...activity }];
}



function set(list: Array<ActivityType>, activity: ActivityType): Array<ActivityType> {
    let found = false;

    const updatedList = list.map(item => {
        if (item.id === activity.id) {
            found = true;
            return { ...activity };
        }
        return item;
    });

    if (!found) {
        throw new Error(`The activity with ID ${activity.id} does not exist.`);
    }

    return updatedList;
}


function stop(activity: ActivityType): ActivityType {
    return {
        ...activity,
        records: recordService.stopAll(activity.records)
    };
}

function stopAll(list: Array<ActivityType>): Array<ActivityType> {
    return list.map(activity => stop(activity));
};


function hasChanges(activity: ActivityType, mock: ActivityType) {
    if (!activity.title.includes(mock.title)) return true; // title has changed
    return recordService.hasAnyTime(activity.records); // records has changed
}

function getAllElapsedTime(activities: Array<ActivityType>) {
    return activities.reduce((acc, activity) => {
        // dont include deleted activity
        if (activity.isDeleted) return acc;

        const elapsedTime = recordService.getAllElapsedTime(activity.records);
        return elapsedTime > 0
            ? acc + elapsedTime
            : acc;
    }, 0);
}

//#region Handle records

function setRecord(activity: ActivityType, record: RecordType): ActivityType {
    const updatedActivity = {
        ...activity,
        records: recordService.set(activity.records, record)
    };

    // order records when add
    return orderRecordsByStartTime(updatedActivity);
}

function addRecord(activity: ActivityType, record: RecordType): ActivityType {
    const updatedActivity = {
        ...activity,
        records: recordService.add(activity.records, record)
    };
    // order records when add
    return orderRecordsByStartTime(updatedActivity);
}

function hasRunningRecords(activity: ActivityType): boolean {
    return recordService.hasRunning(activity.records);
}

function orderRecordsByStartTime(activity: ActivityType): ActivityType {
    return {
        ...activity,
        records: recordService.orderAllByStartTime(activity.records)
    };
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