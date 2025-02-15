import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { ProgressBar } from "src/components/ProgressBar";
import { PlayIcon, StopIcon } from "src/assets/Icons";
import activityService from "src/services/activityService";
import { useMemo } from "react";
import { convertElapsedTimeToText } from "src/utils/TimeUtils";
import Clickable from "src/components/interactable/Clickable";
import workSessionService from "src/services/workSessionService";
export default function WorkSessionTimer({ session, onTimerToggle, readOnly }) {
    // calculated states
    const [totalElapsedTimeTxt, sessionProgress] = useMemo(() => {
        const totalElapsedTime = activityService.getAllElapsedTime(session.activities);
        const totalElapsedTimeTxt = convertElapsedTimeToText(totalElapsedTime);
        // -1 means has not progress
        const timerDuration = workSessionService.getTimerDurationInMinutes(session.timer);
        const sessionProgress = timerDuration >= 0
            ? (totalElapsedTime / (timerDuration * 60000)) * 100
            : -1;
        return [totalElapsedTimeTxt, sessionProgress];
    }, [session]);
    return (_jsxs("div", { className: clsx("flex flex-row ml-auto p-1 rounded-md", { "bg-red-400": !readOnly && session.timer.running, }), children: [totalElapsedTimeTxt &&
                _jsxs("div", { className: clsx("flex flex-col items-center pl-1", { "min-w-20": sessionProgress >= 0 }), children: [_jsx("span", { className: "text-sm mx-1", children: totalElapsedTimeTxt }), sessionProgress >= 0 &&
                            _jsx(ProgressBar, { progress: sessionProgress, backgroundOnExcess: session.timer.running ? "bg-yellow-300" : undefined })] }), !readOnly && /* toggle timer btn */
                _jsx(Clickable, { className: clsx({
                        "hover:bg-red-400": !session.timer.running,
                        "hover:bg-white hover:text-red-400": session.timer.running,
                    }), onClick: () => onTimerToggle(!session.timer.running), children: session.timer.running
                        ? _jsx(StopIcon, {})
                        : _jsx(PlayIcon, {}) })] }));
}
