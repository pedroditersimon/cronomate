import { ActivityType, RecordType } from "../../types/Activity";

export interface TodayActivitiesState {
    timer: RecordType;
    activities: Array<ActivityType>;
}