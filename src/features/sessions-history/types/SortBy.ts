export type SortOrder = "asc" | "desc";

export enum SortBy {
    CREATED_AT = 'created_at',
    DURATION = 'duration',
}

export const SortByLabels: Record<SortBy, string> = {
    [SortBy.CREATED_AT]: "Fecha de creación",
    [SortBy.DURATION]: "Duración",
};