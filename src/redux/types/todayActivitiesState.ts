import { ActivityType, RecordType } from "../../types/Activity";

export interface TodayActivitiesState {
    timer: RecordType;
    createdTimeStamp: number; // starting time
    activities: Array<ActivityType>;
}