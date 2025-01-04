import { to24HourFormat } from "../utils/TimeUtils";

interface Props {
    time?: Date | undefined;
}

export function TimeInput({ time }: Props) {

    return (
        <div
            className={`flex flex-row justify-center px-0.5 min-w-16
            border-${time ? "solid" : "dotted"} rounded-lg border-2 border-gray-700`}
        >
            <span>{time ? to24HourFormat(time) : "-"}</span>
        </div>
    );
}