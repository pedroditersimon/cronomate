
export interface WorkSessionType {
    id: string;
    createdTimeStamp: number; // starting time
    activities: Array<ActivityType>;
    timer: WorkSessionTimerType;
}

export interface WorkSessionTimerType extends RecordType {
    startTimeOverride?: number; // timer override
    endTimeOverride?: number; // timer override
    maxDurationMinutes?: number; // En minutos
}

export interface WorkSessionSettingsType {
    stopOnSessionEnd: boolean;
    stopOnClose: boolean;
    maxDurationMinutes?: number; // En minutos
}


export interface ActivityType {
    id: string;
    title: string;
    description?: string;
    records: Array<RecordType>;
    isDeleted?: boolean;
    isCollapsed?: boolean;
}

export interface RecordType {
    id: string;
    startTime?: number; // Date
    endTime?: number;   // Date
    running?: boolean;
    deleted?: boolean;
}


