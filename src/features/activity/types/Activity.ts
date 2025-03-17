import { TimeTrack } from 'src/features/time-track/types/TimeTrack';

export interface Activity {
    id: string;
    title: string;
    description?: string;
    tracks: TimeTrack[];
    isDeleted?: boolean;
    isCollapsed?: boolean;
}

