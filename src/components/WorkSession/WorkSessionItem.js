import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { formatDateToText, toDate } from "src/utils/TimeUtils";
import { CircleIcon } from "src/assets/Icons";
import Clickable from "src/components/interactable/Clickable";
import WorkSessionTimer from "./WorkSessionTimer";
export default function WorkSessionItem({ session, onSelected }) {
    const title = formatDateToText(toDate(session.createdTimeStamp));
    const handleClick = () => {
        if (onSelected)
            onSelected(session);
    };
    return (_jsxs("div", { className: "flex flex-row gap-1", children: [_jsx(CircleIcon, { className: "bg-gray-700" }), _jsxs(Clickable, { className: "w-full flex flex-row px-1 items-center justify-between rounded-md hover:bg-gray-700", onClick: handleClick, children: [_jsx("span", { children: title }), _jsx(WorkSessionTimer, { session: session, onTimerToggle: () => { }, readOnly: true })] })] }));
}
