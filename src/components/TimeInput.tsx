import React, { useCallback, useEffect, useState } from "react";
import { convert24HourFormatTextToTime, to24HourFormat } from "../utils/TimeUtils";
import useTimer from "../hooks/useTimer";
import clsx from "clsx";

interface Props {
    time?: Date | undefined;
    onTimeChange?: (newState: Date | undefined) => void;
    running?: boolean;
}

export function TimeInput({ time, onTimeChange, running }: Props) {
    const [focused, setFocused] = useState(false);
    const [formattedTime, setFormattedTime] = useState(time ? to24HourFormat(time) : "-");

    useEffect(() => {
        setFormattedTime(time ? to24HourFormat(time) : "-");
    }, [time]);

    useTimer(() => {
        if (onTimeChange) onTimeChange(new Date());
        console.log("timer");
    }, 1000, running);

    const confirmTime = useCallback(() => {
        const newTime = convert24HourFormatTextToTime(formattedTime, time);
        setFormattedTime(newTime ? to24HourFormat(newTime) : "-");

        if (onTimeChange) onTimeChange(newTime);
    }, [formattedTime, time, onTimeChange]);

    const colorVariant = running ? "red-200" : "gray-200";

    return (
        <div
            className={clsx(`flex flex-row justify-center rounded-lg hover:bg-${colorVariant}`, {
                "bg-red-200": running,
            })}
        >
            <input
                className={clsx(`max-w-14 bg-transparent outline-none text-center text-${colorVariant}`, {
                    "hover:cursor-text": focused,
                    "hover:cursor-pointer": !focused,
                })}

                value={formattedTime}
                onChange={(e) => setFormattedTime(e.target.value)}
                maxLength={5}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.select()} // select all text on click

                // on confirm input
                onBlur={() => { confirmTime(); setFocused(false); }}
                onKeyUp={(e) => e.key === "Enter" && confirmTime()}

                onFocus={() => setFocused(true)}
            />
        </div>
    );
}