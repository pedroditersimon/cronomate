import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleIcon, TrashIcon } from "src/assets/Icons";
import { getElapsedTime, isNow, toDate, convertElapsedTimeToText } from "src/utils/TimeUtils";
import { useMemo } from "react";
import clsx from "clsx";
import { TimeInput } from "src/components/interactable/TimeInput";
import Clickable from "src/components/interactable/Clickable";
export default function Record({ record, onRecordChange, readOnly }) {
    // calculate elapsed time in text format
    const elapsedTimeTxt = useMemo(() => {
        const elapsedTime = getElapsedTime(toDate(record.startTime, false), toDate(record.endTime, false));
        return convertElapsedTimeToText(elapsedTime);
    }, [record]);
    // no record
    if (!record)
        return _jsx("div", { className: "text-red-400", children: "Error: Null Record." });
    const handleDelete = () => {
        onRecordChange(Object.assign(Object.assign({}, record), { deleted: true }));
    };
    return (_jsxs("div", { className: clsx("flex flex-row gap-1 transition-opacity duration-300 group", { "strike-div opacity-50": record.deleted }), children: [_jsx(CircleIcon, { className: clsx({
                    "bg-red-400": record.running,
                    "bg-gray-700": !record.running
                }) }), _jsxs("div", { className: clsx("flex flex-row gap-1 w-full rounded-lg"), children: [_jsx(TimeInput, { time: record.startTime, onTimeChange: newStartTime => onRecordChange(Object.assign(Object.assign({}, record), { startTime: newStartTime })), readOnly: readOnly }), "-", _jsx(TimeInput, { time: record.endTime, onTimeChange: newEndTime => onRecordChange(Object.assign(Object.assign({}, record), { endTime: newEndTime, running: isNow(newEndTime) && record.running // Stop running if time has changed
                         })), running: record.running, readOnly: readOnly }), _jsx("span", { className: clsx("ml-auto content-center box-border", {
                            "text-red-400": record.running,
                            "pr-1": readOnly
                        }), children: elapsedTimeTxt }), !readOnly &&
                        _jsx(Clickable, { className: "hidden group-hover:block", children: _jsx(TrashIcon, { className: "hover:bg-red-400" }), onClick: handleDelete })] })] }));
}
