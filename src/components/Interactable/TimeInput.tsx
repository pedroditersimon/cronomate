import React, { useCallback, useEffect, useState } from "react";
import { convert24HourFormatTextToTime, to24HourFormat, toDate } from "../../utils/TimeUtils";
import clsx from "clsx";
import useTimer from "../../hooks/useTimer";

interface Props {
    time?: number;
    onTimeChange?: (newState: number | undefined) => void;
    running?: boolean;
    readOnly?: boolean;
}

export function TimeInput({ time, onTimeChange, running, readOnly }: Props) {
    const [focused, setFocused] = useState(false);
    const [inputTime, setInputTime] = useState<string>(time ? to24HourFormat(toDate(time)) : "-");

    useEffect(() => {
        setInputTime(time ? to24HourFormat(toDate(time)) : "-");
    }, [time]);

    useTimer(() => {
        if (onTimeChange) onTimeChange(toDate().getTime());
        console.log("TimeInput timer");
    }, 5000, running);

    const handleConfirmTime = useCallback(() => {
        const newTime = convert24HourFormatTextToTime(inputTime, time);
        const newInput = newTime ? to24HourFormat(newTime) : "-"
        const inputHasChanged = newInput !== inputTime;

        if (!inputHasChanged) return;

        setInputTime(newInput);
        if (onTimeChange) onTimeChange(newTime?.getTime());
    }, [inputTime, time, onTimeChange]);

    return (
        <div
            className={clsx(`flex flex-row justify-center rounded-md hover:bg-gray-700 hover:shadow`, {
                "text-red-400 hover:bg-red-400 hover:text-white": running
            })}
        >
            <input
                className={clsx(`max-w-12 bg-transparent outline-none text-center`, {
                    "hover:cursor-text": focused,
                    "hover:cursor-pointer": !focused && !readOnly,
                })}

                value={inputTime}
                maxLength={5}
                readOnly={readOnly}
                onChange={e => setInputTime(e.target.value)}

                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.select()}
                // select all text on click
                onFocus={() => setFocused(true)}

                // on confirm input
                onBlur={() => {
                    handleConfirmTime();
                    setFocused(false);
                }}
                onKeyUp={e => {
                    if (e.key !== "Enter") return;
                    handleConfirmTime();
                    e.currentTarget.blur();
                }}
            />
        </div>
    );
}