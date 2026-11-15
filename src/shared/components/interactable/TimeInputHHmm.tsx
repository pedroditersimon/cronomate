import React, { forwardRef, useCallback, useEffect, useState } from "react";
import clsx, { ClassValue } from "clsx";
import { DateTime } from "luxon";
import { convert24HourFormatTextToTimeObj, parseTimeKeywords } from "src/shared/utils/TimeUtils";

interface Props {
    timeHHmm: string | null; // time in HH:mm format
    onChange?: (newTime: string | null) => void;
    onBlur?: (newTime: string | null) => void;

    readOnly?: boolean;
    className?: ClassValue;
}


// TimeInput based in Date
export const TimeInputHHmm = forwardRef<HTMLInputElement, Props>(function TimeInputHHmm({ timeHHmm, onChange, onBlur, readOnly, className }, ref) {
    const [focused, setFocused] = useState(false);
    const [inputTime, setInputTime] = useState<string>(timeHHmm ?? "");

    // sync input state with prop
    useEffect(() => {
        // dont update if focused
        if (focused) return;
        setInputTime(timeHHmm ?? "");
    }, [focused, timeHHmm]);

    // convert input to formatted date and call 'onChange'
    const handleConfirmTime = useCallback(() => {
        if (!inputTime?.trim()) {
            setInputTime("");
            if (onChange) onChange(null);
            return null;
        }

        const keywordTime = parseTimeKeywords(inputTime);

        if (keywordTime) {
            const newFormattedTime = DateTime.fromJSDate(keywordTime).toFormat("HH:mm");
            setInputTime(newFormattedTime);
            if (onChange) onChange(newFormattedTime);
            return newFormattedTime;
        }

        const newTimeObj = convert24HourFormatTextToTimeObj(inputTime);
        if (!newTimeObj) {
            setInputTime(timeHHmm ?? ""); return timeHHmm;
        }

        const newTime = DateTime.fromObject({
            hour: newTimeObj.hours,
            minute: newTimeObj.minutes
        });
        if (!newTime.isValid) {
            setInputTime(timeHHmm ?? ""); return timeHHmm;
        }

        const newFormattedTime = newTime.toFormat("HH:mm");
        const newInput = newFormattedTime ?? "-";

        setInputTime(newInput);
        if (onChange) onChange(newFormattedTime);
        return newFormattedTime;
    }, [inputTime, onChange, timeHHmm]);


    return (
        <div
            className={clsx(
                className,
                `max-w-12 rounded-md hover:bg-gray-700 hover:shadow`,
            )}
        >
            <input
                ref={ref}
                className={clsx(
                    `w-full bg-transparent outline-none text-center`, {
                    "hover:cursor-text": focused,
                    "hover:cursor-pointer": !focused && !readOnly,
                })}

                value={!inputTime && !focused ? "-" : inputTime}
                maxLength={5}
                readOnly={readOnly || !focused}
                onChange={e => setInputTime(e.target.value)}

                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    if (readOnly) return;
                    e.currentTarget.select();
                    setFocused(true);
                }}
                // select all text on click
                onFocus={() => { if (!readOnly) setFocused(true); }}

                // on confirm input
                onBlur={() => {
                    if (readOnly) return;
                    const confirmedTime = handleConfirmTime();
                    setFocused(false);
                    onBlur?.(confirmedTime);
                }}
                onKeyUp={e => {
                    if (e.key === "Enter") {
                        handleConfirmTime();
                        setFocused(false);
                    }
                    else if (e.key === "Escape") {
                        setInputTime(timeHHmm ?? "");
                        setFocused(false);
                    }
                }}
            />
        </div>
    );
});
