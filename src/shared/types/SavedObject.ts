export interface SavedObject<T> {
    generated_date: number; // saved time
    app_version: string;
    value: T;
}

export interface SavedObjectWithId<T, Tid> extends SavedObject<T> {
    id: Tid;
}