import clsx from "clsx";
import { ProgressBar } from "../ProgressBar";

import { PlayIcon, StopIcon } from "../../assets/Icons";
import { WorkSessionType } from "../../types/Activity";
import activityService from "../../services/activityService";
import { useMemo } from "react";
import { toElapsedHourMinutesFormat } from "../../utils/TimeUtils";
import Clickable from "../Interactable/Clickable";

interface Props {
    session: WorkSessionType;
    onTimerToggle: (running: boolean) => void;
    readOnly?: boolean;
}


export default function WorkSessionTimer({ session, onTimerToggle, readOnly }: Props) {

    // calculated states
    const [totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = activityService.getAllElapsedTime(session.activities);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);
        console.log(totalElapsedTime);
        return [totalElapsedTimeTxt];
    }, [session]);


    return (
        <div
            className={clsx("flex flex-row ml-auto p-1 rounded-md",
                { "bg-red-400": session.timer.running, }
            )}
        >
            {/* Today elapsed time txt */}
            {totalElapsedTimeTxt &&
                <div className="flex flex-col items-center pl-1">
                    <span className="mx-2 text-sm">{totalElapsedTimeTxt}</span>
                    <ProgressBar progress={150} background={{ "bg-yellow-200": session.timer.running }} />
                </div>
            }

            {!readOnly && /* toggle timer btn */
                <Clickable
                    className={clsx({
                        "hover:bg-red-400": !session.timer.running,
                        "hover:bg-white hover:text-red-400": session.timer.running,
                    })}
                    onClick={() => onTimerToggle(!session.timer.running)}
                    children={session.timer.running
                        ? <StopIcon />
                        : <PlayIcon />}
                />
            }
        </div>
    );
}