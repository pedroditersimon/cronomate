/**
 * Represents a time range with running capabilities
 * @interface
 */
export interface TimeTrack {
    id: string;

    /** Time in 24-hour 'HH:mm' format (e.g. “15:10”). */
    start: string | null;

    /** Time in 24-hour 'HH:mm' format (e.g. “15:10”). */
    end: string | null;

    status: TimeTrackStatus;
}

export enum TimeTrackStatus {
    RUNNING = "running",
    STOPPED = "stopped",
    ARCHIVED = "archived"
}