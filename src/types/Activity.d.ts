export interface ActivityType {
    id: string;
    title: string;
    entries: Array<ActivityEntryType>;
}

export interface ActivityEntryType {
    id: string;

    startTime?: Date | undefined;
    endTime?: Date | undefined;
    running: boolean;
}