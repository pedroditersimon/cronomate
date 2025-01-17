import { useMemo } from "react";
import { WorkSessionType } from "../../types/Activity";
import { ProgressBar } from "../ProgressBar";
import activityService from "../../services/activityService";
import { formatDateToText, toDate, toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import { CircleIcon } from "../../assets/Icons";
import Clickable from "../Interactable/Clickable";

interface Props {
    session: WorkSessionType;
    onSelected?: (session: WorkSessionType) => void;
}

export default function WorkSessionItem({ session, onSelected }: Props) {

    // calculated states
    const [totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = activityService.getAllElapsedTime(session.activities);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

        return [totalElapsedTimeTxt];
    }, [session]);

    const title = formatDateToText(toDate(session.createdTimeStamp));

    const handleClick = () => {
        if (onSelected) onSelected(session);
    }

    return (
        <div className="flex flex-row gap-1">
            <CircleIcon className="bg-gray-700" />
            <Clickable
                className="w-full flex flex-row px-1 items-center justify-between rounded-md hover:bg-gray-700"
                onClick={handleClick}
            >
                <span>{title}</span>
                <div className="flex flex-col items-center">
                    <span className="mx-2 text-sm">{totalElapsedTimeTxt}</span>
                    <ProgressBar progress={150} />
                </div>
            </Clickable>
        </div>
    );
}