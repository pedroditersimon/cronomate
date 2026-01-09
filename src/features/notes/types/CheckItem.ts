
export interface CheckItem {
    id: string;

    content: string;
    isDone: boolean;

    /** Due time relative to today (HH:mm format). */
    due?: string;

    /** format dd-MM-yyyy HH:mm:ss */
    createdAt: string;
}
