import { WorkSession } from "src/features/work-session/types/WorkSession";

export interface TodaySession {
    session: WorkSession;
    endAlertStatus: "waiting" | "alerted" | "ended";
}