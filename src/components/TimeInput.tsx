import React, { useCallback, useEffect, useState } from "react";
import { convert24HourFormatTextToTime, to24HourFormat } from "../utils/TimeUtils";
import useTimer from "../hooks/useTimer";
import clsx from "clsx";

interface Props {
    time?: Date;
    onTimeChange?: (newState: Date) => void;
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
        console.log("TimeInput timer");
    }, 1000, running);

    const confirmTime = useCallback(() => {
        const newTime = convert24HourFormatTextToTime(formattedTime, time);
        setFormattedTime(newTime ? to24HourFormat(newTime) : "-");

        if (onTimeChange) onTimeChange(newTime);
    }, [formattedTime, time, onTimeChange]);

    return (
        <div
            className={clsx(`flex flex-row justify-center rounded-md hover:bg-gray-700`, {
                "text-red-400 hover:bg-red-400 hover:text-white": running
            })}
        >
            <input
                className={clsx(`max-w-12 bg-transparent outline-none text-center`, {
                    "hover:cursor-text": focused,
                    "hover:cursor-pointer": !focused,
                })}

                value={formattedTime}
                maxLength={5}
                onChange={(e) => setFormattedTime(e.target.value)}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.select()} // select all text on click
                onFocus={() => setFocused(true)}

                // on confirm input
                onBlur={() => { confirmTime(); setFocused(false); }}
                onKeyUp={e => {
                    if (e.key !== "Enter") return;
                    confirmTime();
                    e.currentTarget.blur();
                }}
            />
        </div>
    );
}