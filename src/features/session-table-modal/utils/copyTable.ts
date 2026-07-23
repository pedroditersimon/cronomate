import { toast } from "sonner";
import { SessionTableColumn, SessionTableModalRow } from "src/features/session-table-modal/types/SessionTableModal";

interface Props {
    rows: SessionTableModalRow[];
    columns: SessionTableColumn[];
    customValues: Record<string, Record<string, string>>;
}

export function copyTable({ rows, columns, customValues }: Props) {
    const tableText = rows
        .map(row => columns.map(column => {
            if (column.isCustom) return customValues[column.id]?.[row.key] || "";
            return String(row[column.id as keyof SessionTableModalRow] ?? "");
        }).join("\t"))
        .join("\n");

    navigator.clipboard.writeText(tableText)
        .then(() => {
            toast.success("¡La tabla ha sido copiada al portapapeles!");
        })
        .catch(() => {
            toast.error("No se pudo copiar la tabla al portapapeles. Por favor, inténtalo de nuevo.");
        });
}
