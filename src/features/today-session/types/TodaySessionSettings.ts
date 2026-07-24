
export type ActivityOrder = "creation" | "startTime";

export interface TodaySessionSettings {
    stopOnSessionEnd: boolean;
    stopOnClose: boolean;
    saveSessionLimits: boolean;
    activityOrder: ActivityOrder;
}

