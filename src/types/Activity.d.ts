export interface WorkSessionType {
    id: string;
    timer: RecordType;
    createdTimeStamp: number; // starting time
    activities: Array<ActivityType>;
    maxDurationMinutes?: number; // En minutos
}

export interface ActivityType {
    id: string;
    title: string;
    records: Array<RecordType>;
    deleted?: boolean;
}

export interface RecordType {
    id: string;
    startTime?: number; // Date
    endTime?: number;   // Date
    running?: boolean;
    deleted?: boolean;
}


export interface WorkSessionSettingsType {
    stopOnSessionEnd: boolean;
    stopOnClose: boolean;
}