
import { formatDateToText, toDate } from "src/shared/utils/TimeUtils";
import { CircleIcon } from "src/assets/Icons";
import Clickable from "src/shared/components/interactable/Clickable";
import WorkSessionTimer from "./WorkSessionTimer";
import { WorkSession } from "src/features/work-session/types/WorkSession";


interface Props {
    session: WorkSession;
    onSelected?: (session: WorkSession) => void;
}

// Representation of a WorkSession as an item list (clickable/selectable)
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
                    onSetTimerStatus={() => { }}
                    readOnly
                />
            </Clickable>
        </div>
    );
}