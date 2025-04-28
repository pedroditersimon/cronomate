
import { formatDateToText, toDate } from "src/shared/utils/TimeUtils";
import { CircleIcon } from "src/assets/Icons";
import Clickable from "src/shared/components/interactable/Clickable";
import SessionTimer from "./SessionTimer";
import { Session } from "src/features/session/types/Session";


interface Props {
    session: Session;
    onSelected?: (session: Session) => void;
}

// Representation of a Session as an item list (clickable/selectable)
export default function SessionItem({ session, onSelected }: Props) {

    const title = formatDateToText(toDate(session.createdTimestamp));

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
                <SessionTimer
                    session={session}
                    onSessionChange={() => { }}
                    readOnly
                />
            </Clickable>
        </div>
    );
}