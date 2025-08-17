export enum PomodoroState { STOPPED, FOCUS, REST }


export interface PomodoroSettings {
    focusDurationMs: number;
    restDurationMs: number;
    continueOnEnd: boolean;
    alertOnRemainingMs: number | null;
}