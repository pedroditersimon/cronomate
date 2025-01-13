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