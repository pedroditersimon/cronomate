import { Activity } from "src/features/activity/types/Activity";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";

export interface WorkSession {
    id: string;
    createdTimestamp: number;
    activities: Array<Activity>;

    // 'start' and 'end' are used to calculate the duration (millis)
    maxDuration: {
        start: string | null;
        end: string | null;
        millis: number | null;
    }

    idleThresholdMs: number | null;

    // Deprecated
    timer: WorkSessionTimer;


}

