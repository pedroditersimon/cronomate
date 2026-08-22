export interface Note {
    id: string;

    title: string;

    content: string;

    /** format dd/MM/yyyy HH:mm */
    createdAt: string;
}
