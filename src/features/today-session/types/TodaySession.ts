import { Session } from "src/features/session/types/Session";

export interface TodaySession {
    session: Session;
    endAlertStatus: "waiting" | "alerted" | "ended";
}