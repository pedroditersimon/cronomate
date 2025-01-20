import { useMemo } from "react";
import { WorkSessionType } from "../../types/Activity";
import { ProgressBar } from "../ProgressBar";
import activityService from "../../services/activityService";
import { formatDateToText, toDate, convertElapsedTimeToText } from "../../utils/TimeUtils";
import { CircleIcon } from "../../assets/Icons";
import Clickable from "../Interactable/Clickable";
import WorkSessionTimer from "./WorkSessionTimer";

interface Props {
    session: WorkSessionType;
    onSelected?: (session: WorkSessionType) => void;
}

export default function WorkSessionItem({ session, onSelected }: Props) {


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
                <WorkSessionTimer
                    session={session}
                    onTimerToggle={() => { }}
                    readOnly
                />
            </Clickable>
        </div>
    );
}