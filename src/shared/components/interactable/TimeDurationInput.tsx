import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx, { ClassValue } from "clsx";
import { DateTime, Duration } from "luxon";
import { convert24HourFormatTextToTimeObj, convertElapsedTimeToText } from "src/shared/utils/TimeUtils";


interface Props {
    millis?: number;
    onChange?: (newMillis: number | null) => void;

    running?: boolean;
    readOnly?: boolean;
    className?: ClassValue;
}


// TimeInput based in elapsed time (format HHh MMm)
export function TimeDurationInput({ millis, onChange, running, readOnly, className }: Props) {
    const [focused, setFocused] = useState(false);

    const duration = Duration.fromMillis(millis ?? 0);
    const durationText = duration.isValid && duration.as("seconds") > 0
        ? (convertElapsedTimeToText(duration.as("milliseconds")) ?? "-")
        : "-";

    const [inputTime, setInputTime] = useState<string>(durationText);

    // format to text on time change
    useEffect(() => {
        setInputTime(durationText);
    }, [durationText]);


    // convert text input to millis and call 'onChange'
    const handleConfirmTime = useCallback(() => {
        if (!onChange) return;

        if (!inputTime?.trim()) {
            setInputTime("");
            if (onChange) onChange(null);
            return;
        }

        const newTimeObj = convert24HourFormatTextToTimeObj(inputTime);
        if (!newTimeObj) {
            setInputTime(durationText); return;
        }
        const newDuration = Duration.fromObject({
            hours: newTimeObj.hours,
            minutes: newTimeObj.minutes
        });
        if (!newDuration.isValid) {
            setInputTime(durationText); return;
        }

        onChange(newDuration.toMillis());

    }, [durationText, inputTime, onChange]);


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
                maxLength={7}
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
                        setInputTime(durationText);
                        setFocused(false);
                    }
                }}
            />
        </div>
    );
}