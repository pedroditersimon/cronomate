export interface ActivityType {
    name: string;
    entries: Array<ActivityEntry>;
}

export interface ActivityEntryType {
    start?: Date | undefined;
    end?: Date | undefined;
}