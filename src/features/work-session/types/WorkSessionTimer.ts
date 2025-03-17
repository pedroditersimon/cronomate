import { TimeTrack } from "src/features/time-track/types/TimeTrack";


export interface WorkSessionTimer extends TimeTrack {
    startOverride: number | null;
    endOverride: number | null;
}

