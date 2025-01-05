export interface ActivityType {
    id: string;
    title: string;
    records: Array<RecordType>;
}

export interface RecordType {
    id: string;
    startTime?: Date | undefined;
    endTime?: Date | undefined;
    running: boolean;
}