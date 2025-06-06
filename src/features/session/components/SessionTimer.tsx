import clsx from "clsx";
import { ProgressBar } from "src/shared/components/ProgressBar";
import { PauseIcon, StopIcon } from "src/assets/Icons";

import { useMemo } from "react";
import { convertElapsedTimeToText, toDate } from "src/shared/utils/TimeUtils";
import Clickable from "src/shared/components/interactable/Clickable";
import { Session } from "src/features/session/types/Session";
import activityService from "src/features/activity/services/activityService";
import sessionService from "src/features/session/services/sessionService";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { pauseActivityMock } from "src/features/session/mocks/pauseActivityMock";
import { generateId } from "src/shared/utils/generateId";
import { DateTime } from "luxon";



interface Props {
    session: Session;
    onSessionChange: (session: Session) => void;
    readOnly?: boolean;
}


export default function SessionTimer({ session, onSessionChange, readOnly }: Props) {

    // calculated states
    const [totalElapsedTimeTxt, sessionProgress, hasRunningTracks, isPauseActivityRunning] = useMemo(() => {

        const sessionDurationMs = sessionService.getSessionDurationMs(session);
        const totalElapsedTimeTxt = convertElapsedTimeToText(sessionDurationMs);

        const maxDurationMs = session.durationLimit.millis ?? 0;

        // -1 means has not progress
        const sessionProgress = sessionDurationMs >= 0
            ? (sessionDurationMs / maxDurationMs) * 100
            : -1;

        const isPauseActivityRunning = session.activities.some(act =>
            act.id === pauseActivityMock.id && activityService.hasRunningTracks(act));

        const hasRunningTracks = session.activities.some(act => activityService.hasRunningTracks(act));

        return [totalElapsedTimeTxt, sessionProgress, hasRunningTracks, isPauseActivityRunning];
    }, [session]);


    function handleAddPause() {
        // get a copy of current
        let _session = session;
        const hhmm_now = DateTime.now().toFormat("HH:mm");

        const newTrack = {
            id: generateId(),
            start: hhmm_now,
            end: hhmm_now,
            status: TimeTrackStatus.RUNNING
        } as TimeTrack;

        const pauseActivity = _session.activities.find(act => act.id === pauseActivityMock.id);

        // stop all activities before adding a pause
        _session = sessionService.stopActivities(session);

        // no pauseActivity exists, create new one
        if (!pauseActivity) {
            _session = sessionService.addActivity(_session, {
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

        _session = sessionService.setActivity(_session, newPauseActivityResult.data);
        onSessionChange(_session);
    }

    function handleStopAllActivities() {
        const _session = sessionService.stopActivities(session);
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
                            backgroundOnExcess={hasRunningTracks ? "bg-yellow-300" : undefined}
                        />
                    }
                </div>
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