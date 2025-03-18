import clsx from "clsx";
import { ProgressBar } from "src/shared/components/ProgressBar";
import { PlayIcon, StopIcon } from "src/shared/assets/Icons";

import { useMemo } from "react";
import { convertElapsedTimeToText } from "src/shared/utils/TimeUtils";
import Clickable from "src/shared/components/interactable/Clickable";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import activityService from "src/features/activity/services/activityService";
import workSessionService from "src/features/work-session/services/workSessionService";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";



interface Props {
    session: WorkSession;
    onTimerToggle: (running: boolean) => void;
    readOnly?: boolean;
}


export default function WorkSessionTimer({ session, onTimerToggle, readOnly }: Props) {

    // calculated states
    const [totalElapsedTimeTxt, sessionProgress] = useMemo(() => {

        const totalElapsedTime = activityService.getAllElapsedTime(session.activities);
        const totalElapsedTimeTxt = convertElapsedTimeToText(totalElapsedTime);

        // -1 means has not progress
        const timerDuration = workSessionService.getTimerDurationInMinutes(session.timer);
        const sessionProgress = timerDuration >= 0
            ? (totalElapsedTime / (timerDuration * 60000)) * 100
            : -1;

        return [totalElapsedTimeTxt, sessionProgress];
    }, [session]);


    return (
        <div
            className={clsx("flex flex-row ml-auto p-1 rounded-md",
                { "bg-red-400": !readOnly && session.timer.status === TimeTrackStatus.RUNNING, }
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
                            backgroundOnExcess={session.timer.status === TimeTrackStatus.RUNNING ? "bg-yellow-300" : undefined}
                        />
                    }
                </div>
            }

            {!readOnly && /* toggle timer btn */
                <Clickable
                    className={clsx({
                        "hover:bg-red-400": session.timer.status !== TimeTrackStatus.RUNNING,
                        "hover:bg-white hover:text-red-400": session.timer.status === TimeTrackStatus.RUNNING,
                    })}
                    onClick={() => onTimerToggle(session.timer.status !== TimeTrackStatus.RUNNING)}
                    children={session.timer.status === TimeTrackStatus.RUNNING
                        ? <StopIcon />
                        : <PlayIcon />}
                />
            }
        </div>
    );
}