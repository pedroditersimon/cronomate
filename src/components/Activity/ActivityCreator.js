import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import Activity from "./Activity";
import { generateId } from "src/utils/generateId";
import clsx from "clsx";
import { toDate } from "src/utils/TimeUtils";
import activityService from "src/services/activityService";
const activityMock = {
    id: "activityMock",
    title: "Nueva actividad",
    records: [{ id: "recordMock" }],
    isCollapsed: true,
};
export default function ActivityCreator({ onActivityCreated }) {
    // local states
    const [activity, setActivity] = useState(activityMock);
    const [focused, setFocused] = useState(false);
    const hasChanges = useMemo(() => {
        return activityService.hasChanges(activity, activityMock);
    }, [activity]);
    const handleCreateActivity = (newActivity) => {
        // newActivity has no changes
        if (!activityService.hasChanges(newActivity, activityMock))
            return;
        const now = toDate().getTime();
        // Get first record
        const firstRecord = newActivity.records[0];
        // create it running if no endTime
        const mustRun = firstRecord.endTime === undefined;
        // If mustRun and no startTime, set it to now
        const setStartTimeToNow = mustRun && !firstRecord.startTime;
        const newActivityWithRecord = {
            id: generateId(),
            title: newActivity.title,
            records: [{
                    id: generateId(),
                    startTime: setStartTimeToNow ? now : firstRecord.startTime, // Keep existing if not starting now
                    endTime: mustRun ? now : firstRecord.endTime, // Keep existing if not running
                    running: mustRun
                }]
        };
        onActivityCreated(newActivityWithRecord); // crear el activity
        setActivity(activityMock); // reset el placeholder
    };
    // update local activity
    const handleSetActivity = (newActivity) => {
        // Reset to mock on empty title
        if (newActivity.title.trim().length === 0) {
            setActivity(activityMock);
            return;
        }
        const firstRecord = newActivity.records[0];
        // Se ha dado a play -> crear el activity
        if (firstRecord.running || newActivity.records.length > 1) {
            handleCreateActivity(Object.assign(Object.assign({}, newActivity), { records: [firstRecord] // ensure first record only
             }));
            return;
        }
        // Seguir actualizando el estado local
        setActivity(newActivity);
    };
    const handleOnTitleConfirm = (newTitle) => {
        // crear nuevo activity
        handleCreateActivity(Object.assign(Object.assign({}, activity), { title: newTitle }));
    };
    const handleFocus = (focus) => {
        setFocused(focus);
        // Colapsar segun el focus
        setActivity(Object.assign(Object.assign({}, activity), { isCollapsed: !focus }));
    };
    return (_jsx("div", { className: clsx("transition-opacity", {
            "opacity-25": !focused && !hasChanges,
            "opacity-100": focused || hasChanges
        }), onFocus: () => handleFocus(true), onBlur: () => handleFocus(false), children: _jsx(Activity, { activity: activity, onActivityChange: handleSetActivity, onTitleConfirm: handleOnTitleConfirm, selectTitleOnClick: true }, activity.id) }));
}
