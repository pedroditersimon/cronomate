import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { convert24HourFormatTextToTime, to24HourFormat, toDate } from "src/utils/TimeUtils";
import clsx from "clsx";
import useTimer from "src/hooks/useTimer";
// TimeInput based in Date
export function TimeInput({ time, onTimeChange, running, readOnly, className }) {
    const [focused, setFocused] = useState(false);
    const [inputTime, setInputTime] = useState(time ? to24HourFormat(toDate(time)) : "-");
    // format to text on time change
    useEffect(() => {
        setInputTime(time ? to24HourFormat(toDate(time)) : "-");
    }, [time]);
    // constantly update to now if its running
    useTimer(() => {
        if (onTimeChange)
            onTimeChange(toDate().getTime());
        console.log("TimeInput timer");
    }, 5000, running);
    // convert text input to date and call 'onTimeChange'
    const handleConfirmTime = useCallback(() => {
        const newTime = convert24HourFormatTextToTime(inputTime, time);
        const newInput = newTime ? to24HourFormat(newTime) : "-";
        const inputHasChanged = newInput !== inputTime;
        if (!inputHasChanged)
            return;
        setInputTime(newInput);
        if (onTimeChange)
            onTimeChange(newTime === null || newTime === void 0 ? void 0 : newTime.getTime());
    }, [inputTime, time, onTimeChange]);
    return (_jsx("div", { className: clsx(`max-w-12 rounded-md hover:bg-gray-700 hover:shadow`, { "text-red-400 hover:bg-red-400 hover:text-white": running }, className), children: _jsx("input", { className: clsx(`w-full bg-transparent outline-none text-center`, {
                "hover:cursor-text": focused,
                "hover:cursor-pointer": !focused && !readOnly,
            }), value: inputTime, maxLength: 5, readOnly: readOnly, onChange: e => setInputTime(e.target.value), onClick: (e) => e.currentTarget.select(), 
            // select all text on click
            onFocus: () => setFocused(true), 
            // on confirm input
            onBlur: () => {
                handleConfirmTime();
                setFocused(false);
            }, onKeyUp: e => {
                if (e.key !== "Enter")
                    return;
                handleConfirmTime();
                e.currentTarget.blur();
            } }) }));
}
