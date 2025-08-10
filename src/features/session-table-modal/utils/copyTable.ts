import { toast } from "sonner";
import { SessionTableModalRow } from "src/features/session-table-modal/types/SessionTableModal";

export function copyTable(rows: SessionTableModalRow[], includeDateCol: boolean) {
    const tableText = rows
        .map(row => [
            ...(includeDateCol ? [row.date] : []),
            row.title,
            row.description,
            row.elapsedTime
        ].join("\t"))
        .join("\n");

    navigator.clipboard.writeText(tableText)
        .then(() => {
            toast.success("¡La tabla ha sido copiada al portapapeles!");
        })
        .catch(() => {
            toast.error("No se pudo copiar la tabla al portapapeles. Por favor, inténtalo de nuevo.");
        });
}
