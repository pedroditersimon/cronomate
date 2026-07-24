export interface SessionTableModalRow {
    key: string;
    date: string;
    project: string;
    title: string;
    description: string;
    elapsedTime: number;
};

export type SessionTableColumnId = "date" | "project" | "title" | "description" | "elapsedTime" | string;

export interface SessionTableColumn {
    id: SessionTableColumnId;
    label: string;
    isCustom?: boolean;
}
