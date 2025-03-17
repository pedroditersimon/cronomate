/**
 * Represents a time range with running capabilities
 * @interface
 */
export interface TimeTrack {
    id: string;

    /** UTC timestamp in milliseconds */
    start: number;

    /** 
     * UTC timestamp in milliseconds
     * @remarks If `null`, the track is running.
     */
    end: number | null;

    /** Track lifecycle state */
    status: TimeTrackStatus;
}

export enum TimeTrackStatus {
    RUNNING = "running",
    STOPPED = "stopped",
    ARCHIVED = "archived"
}