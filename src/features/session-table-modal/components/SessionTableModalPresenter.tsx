import Button from "src/shared/components/interactable/Button";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal } from "src/shared/components/Modal";
import clsx from "clsx";
import { CheckIcon, ClipboardDocumentIcon, CrossIcon } from "src/assets/Icons";
import Dropdown from "src/shared/components/interactable/Dropdown";
import { TimeUnit } from "src/shared/types/TimeUnit";
import Checkbox from "src/shared/components/interactable/Checkbox";
import { SessionTableColumn, SessionTableModalRow } from "src/features/session-table-modal/types/SessionTableModal";
import Tooltip from "src/shared/components/Tooltip";


interface Props {
    id?: string;
    rows: SessionTableModalRow[];
    disableCopyBtn: boolean;
    handleCopyTable: () => void;
    activeColumnIds: string[];
    setActiveColumnIds: Dispatch<SetStateAction<string[]>>;
    elapsedTimeUnit: TimeUnit;
    setElapsedTimeUnit: (value: TimeUnit) => void;
    includeUnrecordedActivity: boolean;
    setIncludeUnrecordedActivity: (value: boolean) => void;
    includePausesActivity: boolean;
    setIncludePausesActivity: (value: boolean) => void;
    hasUntrackedActivity: boolean;
    hasPausesActivity: boolean;
    tableCopiedEffect: boolean;
    columns: SessionTableColumn[];
    setColumns: Dispatch<SetStateAction<SessionTableColumn[]>>;
    customValues: Record<string, Record<string, string>>;
    setCustomValues: Dispatch<SetStateAction<Record<string, Record<string, string>>>>;
}


export default function SessionTableModalPresenter({
    id = "session-table-modal",
    rows,
    disableCopyBtn, handleCopyTable,
    activeColumnIds, setActiveColumnIds,
    elapsedTimeUnit, setElapsedTimeUnit,
    includeUnrecordedActivity, setIncludeUnrecordedActivity,
    includePausesActivity, setIncludePausesActivity,
    hasUntrackedActivity,
    hasPausesActivity,
    tableCopiedEffect,
    columns, setColumns,
    customValues, setCustomValues
}: Props) {
    const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
    const [newColumnName, setNewColumnName] = useState("");
    const visibleColumns = columns;

    const moveColumn = (targetColumnId: string) => {
        if (!draggedColumnId || draggedColumnId === targetColumnId) return;

        setColumns(currentColumns => {
            const fromIndex = currentColumns.findIndex(column => column.id === draggedColumnId);
            const toIndex = currentColumns.findIndex(column => column.id === targetColumnId);
            if (fromIndex < 0 || toIndex < 0) return currentColumns;

            const reorderedColumns = [...currentColumns];
            const [column] = reorderedColumns.splice(fromIndex, 1);
            reorderedColumns.splice(toIndex, 0, column);
            return reorderedColumns;
        });
        setDraggedColumnId(null);
    };

    const addCustomColumn = () => {
        const label = newColumnName.trim();
        if (!label) return;

        const id = `custom-${crypto.randomUUID()}`;
        setColumns(currentColumns => [...currentColumns, {
            id,
            label,
            isCustom: true
        }]);
        setNewColumnName("");
    };

    const setCustomValue = (columnId: string, rowKey: string, value: string) => {
        setCustomValues(currentValues => ({
            ...currentValues,
            [columnId]: { ...currentValues[columnId], [rowKey]: value }
        }));
    };

    const toggleColumnActive = (columnId: string) => {
        setActiveColumnIds(currentIds => currentIds.includes(columnId)
            ? currentIds.filter(id => id !== columnId)
            : [...currentIds, columnId]
        );
    };

    const removeCustomColumn = (columnId: string) => {
        setColumns(currentColumns => currentColumns.filter(column => column.id !== columnId));
        setCustomValues(currentValues => {
            const remainingValues = { ...currentValues };
            delete remainingValues[columnId];
            return remainingValues;
        });
    };

    const renameCustomColumn = (columnId: string, label: string) => {
        setColumns(currentColumns => currentColumns.map(column =>
            column.id === columnId ? { ...column, label } : column
        ));
    };

    return (
        <Modal
            id={id}
            title="Tabla de actividades"
            closeOnClickOut
        >
            <div className="size-full mr-4 overflow-y-auto overflow-x-hidden _text-sm">
                <table className="w-full">
                    <thead>
                        <tr className="text-neutral-300 text-left border-b border-neutral-800">
                            {visibleColumns.map(column => (
                                <th
                                    key={column.id}
                                    className={clsx(
                                        "relative px-2 py-1 min-w-40 cursor-grab transition-colors hover:bg-neutral-800/70",
                                        { "opacity-40": !column.isCustom && !activeColumnIds.includes(column.id) }
                                    )}
                                    draggable
                                    onDragStart={() => setDraggedColumnId(column.id)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => moveColumn(column.id)}
                                    onDragEnd={() => setDraggedColumnId(null)}
                                >
                                    <div className="flex items-center gap-2 pr-5">
                                        {column.id === "elapsedTime" ? (
                                            <Dropdown
                                                className="text-neutral-300 border-none"
                                                value={elapsedTimeUnit}
                                                options={Object.values(TimeUnit)}
                                                onOption={(opt) => setElapsedTimeUnit(opt as TimeUnit)}
                                            />
                                        ) : column.isCustom ? (
                                            <input
                                                className="w-full bg-transparent outline-none"
                                                value={column.label}
                                                aria-label="Título de columna personalizada"
                                                draggable={false}
                                                onDragStart={(event) => event.stopPropagation()}
                                                onChange={(event) => renameCustomColumn(column.id, event.target.value)}
                                            />
                                        ) : column.label}
                                        {column.isCustom ? (
                                            <div className="absolute right-1 top-1/2 -translate-y-1/2">
                                                <Tooltip text="Eliminar columna" position="bottom-center">
                                                    <button
                                                        className="text-neutral-500 hover:text-red-400"
                                                        type="button"
                                                        aria-label={`Eliminar columna ${column.label}`}
                                                        draggable={false}
                                                        onDragStart={(event) => event.stopPropagation()}
                                                        onClick={() => removeCustomColumn(column.id)}
                                                    >
                                                        <CrossIcon className="size-4" />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        ) : (
                                            <div className="absolute right-1 top-1/2 -translate-y-1/2">
                                                <Tooltip
                                                    text={activeColumnIds.includes(column.id) ? "Desactivar columna" : "Activar columna"}
                                                    position="bottom-center"
                                                >
                                                    <span
                                                        draggable={false}
                                                        onDragStart={(event) => event.stopPropagation()}
                                                    >
                                                        <Checkbox
                                                            className="border-transparent p-0"
                                                            value={activeColumnIds.includes(column.id)}
                                                            onChange={() => toggleColumnActive(column.id)}
                                                        />
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="w-20 px-2 py-1">
                                <input
                                    className="w-full bg-transparent text-neutral-300 outline-none placeholder:text-neutral-600"
                                    value={newColumnName}
                                    placeholder="Agregar"
                                    onChange={(event) => setNewColumnName(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") addCustomColumn();
                                    }}
                                    onBlur={addCustomColumn}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr
                                key={row.key}
                                className={clsx("text-neutral-400 whitespace-normal break-words break-all",
                                    { "border-b border-neutral-800": index < rows.length - 1 }
                                )}
                            >
                                {visibleColumns.map(column => (
                                    <td
                                        key={column.id}
                                        className={clsx("p-2 max-w-96", {
                                            "opacity-40": !column.isCustom && !activeColumnIds.includes(column.id)
                                        })}
                                    >
                                        {column.isCustom ? (
                                            <input
                                                className="w-full rounded bg-transparent outline-none transition-colors hover:bg-neutral-800 focus:bg-neutral-800"
                                                value={customValues[column.id]?.[row.key] || ""}
                                                onChange={(event) => setCustomValue(column.id, row.key, event.target.value)}
                                            />
                                        ) : String(row[column.id as keyof SessionTableModalRow] ?? "")}
                                    </td>
                                ))}
                                <td />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* bottom */}
            <div className="flex flex-row gap-3 items-center">

                {hasUntrackedActivity &&
                    <Checkbox
                        value={includeUnrecordedActivity}
                        onChange={setIncludeUnrecordedActivity}
                    >
                        Incluir No categorizadas
                    </Checkbox>
                }

                {hasPausesActivity &&
                    <Checkbox
                        value={includePausesActivity}
                        onChange={setIncludePausesActivity}
                    >
                        Incluir Pausas
                    </Checkbox>
                }

                <Button
                    className="ml-auto"
                    onClick={handleCopyTable}
                    icon={tableCopiedEffect
                        ? <CheckIcon className="size-5" />
                        : <ClipboardDocumentIcon className="size-5" />}
                    disabled={disableCopyBtn}
                    children="Copiar"
                />
            </div>

        </Modal>
    );
}
