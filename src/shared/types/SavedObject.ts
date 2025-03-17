export interface SavedObject<T> {
    savedTimeStamp: number; // saved time
    appVersion: string;
    value: T;
}

export interface SavedObjectWithId<T, Tid> extends SavedObject<T> {
    id: Tid;
}