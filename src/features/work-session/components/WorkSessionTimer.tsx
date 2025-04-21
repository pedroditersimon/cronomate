import clsx from "clsx";
import { ProgressBar } from "src/shared/components/ProgressBar";
import { PauseIcon, PlayIcon, StopIcon } from "src/assets/Icons";

import { useMemo } from "react";
import { convertElapsedTimeToText, toDate } from "src/shared/utils/TimeUtils";
import Clickable from "src/shared/components/interactable/Clickable";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import activityService from "src/features/activity/services/activityService";
import workSessionService from "src/features/work-session/services/workSessionService";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { pauseActivityMock } from "src/features/work-session/mocks/pauseActivityMock";
import { generateId } from "src/shared/utils/generateId";



interface Props {
    session: WorkSession;
    onSessionChange: (session: WorkSession) => void;
    onSetTimerStatus: (newState: TimeTrackStatus) => void;
    readOnly?: boolean;
}


export default function WorkSessionTimer({ session, onSessionChange, onSetTimerStatus, readOnly }: Props) {

    // calculated states
    const [totalElapsedTimeTxt, sessionProgress, hasRunningTracks, isPauseActivityRunning] = useMemo(() => {

        const totalElapsedTime = activityService.getAllElapsedTime(session.activities);
        const totalElapsedTimeTxt = convertElapsedTimeToText(totalElapsedTime);

        // -1 means has not progress
        const timerDuration = workSessionService.getTimerDurationInMinutes(session.timer);
        const sessionProgress = timerDuration >= 0
            ? (totalElapsedTime / (timerDuration * 60000)) * 100
            : -1;

        const isPauseActivityRunning = session.activities.some(act =>
            act.id === pauseActivityMock.id && activityService.hasRunningTracks(act));

        const hasRunningTracks = session.activities.some(act => activityService.hasRunningTracks(act));


        return [totalElapsedTimeTxt, sessionProgress, hasRunningTracks, isPauseActivityRunning];
    }, [session]);

    function handleToggleTimerStatus() {
        const newState = session.timer.status === TimeTrackStatus.RUNNING
            ? TimeTrackStatus.STOPPED : TimeTrackStatus.RUNNING;
        onSetTimerStatus(newState);
    }

    function handleAddPause() {
        // get a copy of current
        let _session = session;
        const now = toDate().getTime();

        const newTrack = {
            id: generateId(),
            start: now,
            end: now,
            status: TimeTrackStatus.RUNNING
        };

        const pauseActivity = _session.activities.find(act => act.id === pauseActivityMock.id);

        // stop all activities before adding a pause
        _session = workSessionService.stopActivities(session);

        // no pauseActivity exists, create new one
        if (!pauseActivity) {
            _session = workSessionService.addActivity(_session, {
                ...pauseActivityMock,
                tracks: [newTrack]
            });
            onSessionChange(_session);
            return; // dont continue
        }

        // edit existing pauseActivity
        const newPauseActivityResult = activityService.addTrack(pauseActivity, newTrack);
        if (!newPauseActivityResult.success)
            return _session;

        _session = workSessionService.setActivity(_session, newPauseActivityResult.data);
        onSessionChange(_session);
    }

    function handleStopAllActivities() {
        const _session = workSessionService.stopActivities(session);
        onSessionChange(_session);
    }

    return (
        <div
            className={clsx("flex flex-row ml-auto p-1 rounded-md",
                { "bg-red-400": !readOnly && hasRunningTracks }
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

            {false && !readOnly && /* toggle timer btn */
                <Clickable
                    className={clsx({
                        "hover:bg-red-400": session.timer.status !== TimeTrackStatus.RUNNING,
                        "hover:bg-white hover:text-red-400": session.timer.status === TimeTrackStatus.RUNNING,
                    })}
                    onClick={handleToggleTimerStatus}
                    children={session.timer.status === TimeTrackStatus.RUNNING
                        ? <StopIcon />
                        : <PlayIcon />}
                />
            }

            {!readOnly && !isPauseActivityRunning && /* pause btn */
                <Clickable
                    tooltip={{ text: "Agregar pausa", position: "left" }}
                    className={clsx({
                        "hover:bg-red-400": !hasRunningTracks,
                        "hover:bg-white hover:text-red-400": hasRunningTracks,
                    })}
                    onClick={handleAddPause}
                    children={<PauseIcon className="size-5" />}
                />
            }

            {!readOnly && hasRunningTracks && /* stop all btn */
                <Clickable
                    tooltip={{ text: "Parar actividades", position: "left" }}
                    className={clsx({
                        "hover:bg-red-400": !hasRunningTracks,
                        "hover:bg-white hover:text-red-400": hasRunningTracks,
                    })}
                    onClick={handleStopAllActivities}
                    children={<StopIcon className="size-5" />}
                />
            }
        </div>
    );
}