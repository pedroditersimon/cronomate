import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import recordService from "src/services/recordService";
import Button from "src/components/interactable/Button";
import { Modal } from "../Modal";
import { toDate } from "src/utils/TimeUtils";
import clsx from "clsx";
import { toast } from "sonner";
import { CheckIcon, ClipboardDocumentIcon } from "src/assets/Icons";
import Dropdown from "src/components/interactable/Dropdown";
import { TimeUnitsEnum } from "src/types/types";
import useUnrecordedActivity from "src/hooks/useUnrecoredActivity";
import workSessionService from "src/services/workSessionService";
import Checkbox from "src/components/interactable/Checkbox";
export default function WorkSessionTableModal({ id, session }) {
    const [elapsedTimeUnit, setElapsedTimeUnit] = useState("Horas");
    const [tableCopiedEffect, setTableCopiedEffect] = useState(false);
    // Unrecorded Activity
    const [includeUnrecordedActivity, setIncludeUnrecordedActivity] = useState(true);
    const sessionTimer = workSessionService.getTimerWithOverrides(session.timer);
    const unrecordedActivity = useUnrecordedActivity(session.activities, sessionTimer);
    const hasUnrecoredActivity = unrecordedActivity.records.length > 0;
    // Pauses Activity
    const [includePausesActivity, setIncludePausesActivity] = useState(true);
    const hasPausesActivity = session.activities.some(act => act.id === "pauses");
    const rows = useMemo(() => {
        // row is -> | date | title | description | time |
        const _session = includeUnrecordedActivity && hasUnrecoredActivity
            ? workSessionService.addActivity(session, unrecordedActivity)
            : session; // otherwise, keep the same
        return _session.activities.map(activity => {
            const elapsedTimeMs = recordService.getAllElapsedTime(activity.records);
            const elapsedTime = elapsedTimeUnit === "Horas"
                ? elapsedTimeMs / 3.6e+6
                : elapsedTimeMs / 60000;
            // Ceil
            const elapsedTimeTxt = Math.ceil(elapsedTime * 100) / 100;
            // this is a row
            return {
                date: toDate(session.createdTimeStamp).toLocaleString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" }),
                title: activity.title,
                description: activity.description || "",
                elapsedTime: elapsedTimeTxt,
            };
        });
    }, [includeUnrecordedActivity, hasUnrecoredActivity, session, unrecordedActivity, elapsedTimeUnit]);
    const handleCopyTable = () => {
        setTableCopiedEffect(true);
        // come back to normal icon
        setTimeout(() => setTableCopiedEffect(false), 1000);
        // Convertir la tabla en texto
        const tableText = rows
            .map(row => `${row.date}\t${row.title}\t${row.description}\t${row.elapsedTime}`)
            .join("\n");
        // Copiar el texto al portapapeles
        navigator.clipboard.writeText(tableText).then(() => {
            toast.success("¡La tabla ha sido copiada al portapapeles!");
        });
    };
    return (_jsxs(Modal, { id: id, title: "Tabla de actividades", closeOnClickOut: true, children: [_jsxs("table", { className: "table-fixed", children: [_jsxs("tr", { className: "text-neutral-300 text-left border-b border-neutral-800", children: [_jsx("th", { className: "px-2 py-1", children: "Fecha" }), _jsx("th", { className: "px-2 py-1 min-w-40", children: "Titulo" }), _jsx("th", { className: "px-2 py-1 min-w-40", children: "Descripci\u00F3n" }), _jsx("th", { className: "py-1", children: _jsx(Dropdown, { className: "text-neutral-300 border-none", value: elapsedTimeUnit, options: Object.values(TimeUnitsEnum), onOption: (opt) => setElapsedTimeUnit(opt) }) })] }), rows.map((row, index) => (_jsxs("tr", { className: clsx("text-neutral-400 whitespace-normal break-words break-all", { "border-b border-neutral-800": index < rows.length - 1 }), children: [_jsx("td", { className: "p-2 max-w-96 text-nowrap", children: row.date }), _jsx("td", { className: "p-2 max-w-96", children: row.title }), _jsx("td", { className: "p-2 max-w-96", children: row.description }), _jsx("td", { className: "p-2 max-w-96 text-nowrap", children: row.elapsedTime })] })))] }), _jsxs("div", { className: "flex flex-row gap-3 items-center", children: [hasUnrecoredActivity &&
                        _jsx(Checkbox, { value: includeUnrecordedActivity, onChange: setIncludeUnrecordedActivity, children: "Incluir No categorizadas" }), hasPausesActivity &&
                        _jsx(Checkbox, { value: includePausesActivity, onChange: setIncludePausesActivity, children: "Incluir Pausas" }), _jsx(Button, { className: "ml-auto", onClick: handleCopyTable, icon: tableCopiedEffect
                            ? _jsx(CheckIcon, { className: "size-5" })
                            : _jsx(ClipboardDocumentIcon, { className: "size-5" }), children: "Copiar" })] })] }));
}
