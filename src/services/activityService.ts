import { ActivityType, RecordType } from "../types/Activity";
import recordService from "./recordService";


export function addActivity(list: Array<ActivityType>, activity: ActivityType): Array<ActivityType> {
    // already exists!
    if (list.some(item => item.id === activity.id)) {
        throw new Error(`The activity with ID ${activity.id} already exists.`);
    }

    return [...list, { ...activity }];
}



export function setActivity(list: Array<ActivityType>, activity: ActivityType): Array<ActivityType> {
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

//#region Handle records

export function setRecord(activity: ActivityType, record: RecordType): ActivityType {
    return {
        ...activity,
        records: recordService.setRecord(activity.records, record)
    };
}

export function addRecord(activity: ActivityType, record: RecordType): ActivityType {
    return {
        ...activity,
        records: recordService.addRecord(activity.records, record)
    };
}


export default {
    // Handle activities
    addActivity,
    setActivity,

    // Handle records
    setRecord,
    addRecord
};