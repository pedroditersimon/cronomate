import React, { useCallback, useEffect, useState } from "react";
import { convert24HourFormatTextToTime, to24HourFormat, toDate } from "src/shared/utils/TimeUtils";
import clsx, { ClassValue } from "clsx";


interface Props {
    time?: number;
    onChange?: (newState: number | null) => void;

    running?: boolean;
    readOnly?: boolean;
    className?: ClassValue;
}


// TimeInput based in Date
export function TimeInput({ time, onChange, running, readOnly, className }: Props) {
    const [focused, setFocused] = useState(false);
    const [inputTime, setInputTime] = useState<string>(time ? to24HourFormat(toDate(time)) : "-");


    // format to text on time change
    useEffect(() => {
        setInputTime(time ? to24HourFormat(toDate(time)) : "-");
    }, [time]);


    // constantly update to now if its running
    // useTimer(() => {
    //     if (onTimeChange) onTimeChange(toDate().getTime());
    //     console.log("TimeInput timer");
    // }, 5000, running);


    // convert text input to date and call 'onTimeChange'
    const handleConfirmTime = useCallback(() => {
        const newTime = convert24HourFormatTextToTime(inputTime, time);
        const newInput = newTime ? to24HourFormat(newTime) : "-";
        const inputHasChanged = newInput !== inputTime;

        if (!inputHasChanged) return;

        setInputTime(newInput);
        if (onChange) onChange(newTime?.getTime() ?? null);

    }, [inputTime, time, onChange]);


    return (
        <div
            className={clsx(`max-w-12 rounded-md hover:bg-gray-700 hover:shadow`,
                { "text-red-400 hover:bg-red-400 hover:text-white": running },
                className,
            )}
        >
            <input
                className={clsx(`w-full bg-transparent outline-none text-center`, {
                    "hover:cursor-text": focused,
                    "hover:cursor-pointer": !focused && !readOnly,
                })}

                value={inputTime}
                maxLength={5}
                readOnly={readOnly || !focused}
                onChange={e => setInputTime(e.target.value)}

                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    e.currentTarget.select();
                    setFocused(true);
                }}
                // select all text on click
                onFocus={() => setFocused(true)}

                // on confirm input
                onBlur={() => {
                    handleConfirmTime();
                    setFocused(false);
                }}
                onKeyUp={e => {
                    if (e.key === "Enter") {
                        handleConfirmTime();
                        setFocused(false);
                    }
                    else if (e.key === "Escape") {
                        setInputTime(time ? to24HourFormat(toDate(time)) : "-");
                        setFocused(false);
                    }
                }}
            />
        </div>
    );
}