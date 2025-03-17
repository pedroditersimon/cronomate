import { Activity } from "src/features/activity/types/Activity";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";

export interface WorkSession {
    id: string;
    createdTimeStamp: number; // starting time
    activities: Array<Activity>;
    timer: WorkSessionTimer;
}

