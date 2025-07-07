export enum PomodoroState { STOPPED, FOCUS, REST }


export interface Pomodoro {
    state: PomodoroState;
    startTime: number | null;
    remainingMs: number;
    endAlertStatus: "waiting" | "alerted" | "ended";
}