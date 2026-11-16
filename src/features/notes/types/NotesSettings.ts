export interface NotesSettings {
    alertBeforeDueMs: number;
    templates: NoteTemplate[];
}

export interface NoteTemplate {
    id: string;
    name: string;
    content: string;
}
