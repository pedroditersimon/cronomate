
export interface PomodoroSettings {
    focusDurationMs: number;
    restDurationMs: number;
    continueOnEnd: boolean;
    alertOnRemainingMs: number | null;
}