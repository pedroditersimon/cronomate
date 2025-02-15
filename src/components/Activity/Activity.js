import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, PlayIcon, StopIcon, TrashIcon } from "src/assets/Icons";
import { isNow, toDate, convertElapsedTimeToText } from "src/utils/TimeUtils";
import Record from "./Record";
import clsx from "clsx";
import HSeparator from "src/layouts/HSeparator";
import { generateId } from "src/utils/generateId";
import { findLast } from "lodash";
import recordService from "src/services/recordService";
import activityService from "src/services/activityService";
import Clickable from "src/components/interactable/Clickable";
export default function Activity({ activity, onActivityChange, onTitleConfirm, showDeletedRecords, readOnly, selectTitleOnClick }) {
    // local states
    const [focused, setFocused] = useState(false);
    const [title, setTitle] = useState(activity.title);
    // sync title if activity changes
    useEffect(() => {
        setTitle(activity.title);
    }, [activity]);
    // calculated states
    const [hasRunningRecords, totalElapsedTimeTxt] = useMemo(() => {
        const totalElapsedTime = recordService.getAllElapsedTime(activity.records);
        const totalElapsedTimeTxt = convertElapsedTimeToText(totalElapsedTime);
        const hasRunningRecords = activityService.hasRunningRecords(activity);
        return [hasRunningRecords, totalElapsedTimeTxt];
    }, [activity]);
    const handleRun = () => {
        const now = toDate().getTime();
        if (hasRunningRecords) {
            // set endTime to Now on running records
            const newRecords = activity.records.map(record => record.running
                ? (Object.assign(Object.assign({}, record), { endTime: now, running: false }))
                : record);
            onActivityChange(Object.assign(Object.assign({}, activity), { records: newRecords }));
            return; // dont do more
        }
        // Find the last resumable record (within 2 seconds of current time) 
        const lastResumableRecord = findLast(activity.records, record => isNow(record.endTime, 60));
        // Resume running the last record if found
        if (lastResumableRecord) {
            handleSetRecord(Object.assign(Object.assign({}, lastResumableRecord), { running: true }));
            return; // dont do more
        }
        // add a new running record
        const newActivity = activityService.addRecord(activity, {
            id: generateId(),
            startTime: now,
            endTime: now,
            running: true
        });
        onActivityChange(newActivity);
    };
    const handleSetRecord = (newRecord) => {
        onActivityChange(activityService.setRecord(activity, newRecord));
    };
    const handleSetTitle = (newTitle) => {
        onActivityChange(Object.assign(Object.assign({}, activity), { title: newTitle }));
    };
    const handleDelete = () => {
        onActivityChange(Object.assign(Object.assign({}, activity), { isDeleted: true }));
    };
    const handleSetCollapsed = (isCollapsed) => {
        onActivityChange(Object.assign(Object.assign({}, activity), { isCollapsed: isCollapsed }));
    };
    return (_jsxs("div", { className: "flex flex-col gap-1 min-w-80", children: [_jsxs("div", { className: "flex flex-row gap-1", children: [_jsx(Clickable, { className: "hover:bg-gray-700", onClick: () => handleSetCollapsed(!activity.isCollapsed), children: activity.isCollapsed
                            ? _jsx(ChevronRightIcon, {})
                            : _jsx(ChevronDownIcon, {}) }), _jsxs("div", { className: clsx("group flex flex-row gap-1 w-full box-border rounded-md pl-2 transition-colors", {
                            "bg-red-400": hasRunningRecords,
                            "bg-gray-700": focused,
                            "hover:bg-gray-700": !hasRunningRecords && !readOnly,
                        }), children: [_jsx("input", { className: "bg-transparent outline-none mr-auto basis-1/2 ", placeholder: activity.title, value: title, readOnly: readOnly, onChange: e => {
                                    if (readOnly)
                                        return;
                                    setTitle(e.target.value);
                                }, onFocus: () => {
                                    if (readOnly)
                                        return;
                                    setFocused(true);
                                }, onClick: (e) => {
                                    if (selectTitleOnClick)
                                        e.currentTarget.select();
                                }, 
                                // on confirm input
                                onBlur: () => {
                                    if (readOnly)
                                        return;
                                    setFocused(false);
                                    handleSetTitle(title);
                                }, onKeyUp: e => {
                                    if (readOnly)
                                        return;
                                    if (e.key === "Enter") {
                                        e.currentTarget.blur();
                                        if (onTitleConfirm)
                                            setTimeout(() => onTitleConfirm(title), 50);
                                        return;
                                    }
                                    // reset title
                                    if (e.key === "Escape") {
                                        setTitle(activity.title);
                                        // Delay blur to ensure the new state is applied, before calling blur.
                                        // This prevents run blur callback with an outdated state.
                                        const element = e.currentTarget;
                                        setTimeout(() => element.blur, 50);
                                        return;
                                    }
                                } }), _jsx("span", { className: clsx({ "pr-1": readOnly }), children: totalElapsedTimeTxt }), !readOnly &&
                                _jsx(Clickable, { className: "hidden group-hover:block", children: _jsx(TrashIcon, { className: clsx("hover:bg-red-400", { "hover:bg-white hover:text-red-400": hasRunningRecords }) }), onClick: handleDelete }), !readOnly &&
                                _jsx(Clickable, { onClick: handleRun, children: hasRunningRecords
                                        ? _jsx(StopIcon, { className: "hover:bg-white hover:text-red-400" })
                                        : _jsx(PlayIcon, { className: "hover:bg-red-400" }) })] })] }), _jsx(HSeparator, {}), _jsx("div", { className: "flex flex-col gap-1 ml-6", children: activity.records.map((record, i) => {
                    if (record.deleted && !showDeletedRecords && !readOnly)
                        return;
                    if (!record.running && activity.isCollapsed && !readOnly)
                        return;
                    return (_jsxs(_Fragment, { children: [_jsx(Record, { record: record, onRecordChange: handleSetRecord, readOnly: readOnly }, record.id), i < activity.records.length - 1 && _jsx(HSeparator, {})] }));
                }) })] }));
}
