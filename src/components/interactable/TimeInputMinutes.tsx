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


// TimeInput based in Minutes (120min, 90min)
export function TimeInputMinutes({ minutes, onMinutesChange, readOnly, className }: Props) {

    // transform minutes to time (today)
    const time = useMemo(() => {
        if (!minutes) return undefined;

        const _time = toDate(); // today
        _time.setHours(0);
        _time.setMinutes(minutes); // add minutes
        _time.setSeconds(0);
        _time.setMilliseconds(0);

        return _time.getTime();

    }, [minutes]);


    // transform time (today) to minutes
    // 4am -> 240mins
    // 13pm -> 780mins
    // 1:30am -> 90mins
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