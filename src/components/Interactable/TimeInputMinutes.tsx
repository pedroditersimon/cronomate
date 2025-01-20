import { useMemo } from "react";
import { toDate } from "../../utils/TimeUtils";
import { ClassValue } from "clsx";
import { TimeInput } from "./TimeInput";

interface Props {
    minutes?: number;
    onMinutesChange?: (newMinutes: number | undefined) => void;

    readOnly?: boolean;
    className?: ClassValue;
}

// TimeInput based in Minutes
export function TimeInputMinutes({ minutes, onMinutesChange, readOnly, className }: Props) {

    const time = useMemo(() => {
        if (!minutes) return undefined;

        const _time = toDate(); // today
        _time.setHours(0);
        _time.setMinutes(minutes); // add minutes
        _time.setSeconds(0);
        _time.setMilliseconds(0);

        return _time.getTime();

    }, [minutes]);


    const handleTimeChange = (newTime: number | undefined) => {
        // no update callback
        if (!onMinutesChange) return;

        // no time
        if (!newTime) {
            onMinutesChange(undefined);
            return;
        }

        const newDate = toDate(newTime);
        const hours = newDate.getHours();
        const minutes = newDate.getMinutes();

        onMinutesChange(hours * 60 + minutes);
    }

    return (
        <TimeInput
            time={time}
            onTimeChange={handleTimeChange}

            readOnly={readOnly}
            className={className}
        />
    );
}