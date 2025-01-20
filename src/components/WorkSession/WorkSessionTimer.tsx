import clsx from "clsx";
import { ProgressBar } from "../ProgressBar";

import { PlayIcon, StopIcon } from "../../assets/Icons";
import { WorkSessionType } from "../../types/Activity";
import activityService from "../../services/activityService";
import { useMemo } from "react";
import { convertElapsedTimeToText } from "../../utils/TimeUtils";
import Clickable from "../Interactable/Clickable";

interface Props {
    session: WorkSessionType;
    onTimerToggle: (running: boolean) => void;
    readOnly?: boolean;
}


export default function WorkSessionTimer({ session, onTimerToggle, readOnly }: Props) {

    // calculated states
    const [totalElapsedTimeTxt, sessionProgress] = useMemo(() => {

        const totalElapsedTime = activityService.getAllElapsedTime(session.activities);
        const totalElapsedTimeTxt = convertElapsedTimeToText(totalElapsedTime);

        // -1 means has not progress
        const sessionProgress = session.maxDurationMinutes
            ? (totalElapsedTime / (session.maxDurationMinutes * 60000)) * 100
            : -1;
        console.log(sessionProgress);
        return [totalElapsedTimeTxt, sessionProgress];
    }, [session]);


    return (
        <div
            className={clsx("flex flex-row ml-auto p-1 rounded-md",
                { "bg-red-400": !readOnly && session.timer.running, }
            )}
        >
            {/* Today elapsed time txt */}
            {totalElapsedTimeTxt &&
                <div
                    className={clsx("flex flex-col items-center pl-1",
                        { "min-w-20": sessionProgress >= 0 }
                    )}
                >
                    <span className="text-sm mx-1">{totalElapsedTimeTxt}</span>
                    {sessionProgress >= 0 &&
                        <ProgressBar
                            progress={sessionProgress}
                            background={{ "bg-yellow-200": session.timer.running }}
                        />
                    }
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