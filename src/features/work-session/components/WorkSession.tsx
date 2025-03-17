import { WorkSession } from "../types/WorkSession";
import { formatDateToText, isPast, toDate } from "src/shared/utils/TimeUtils";
import { generateId } from "src/shared/utils/generateId";
import Container from "src/shared/layouts/Container";
import useTimer from "src/shared/hooks/useTimer";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import WorkSessionTimer from "./WorkSessionTimer";
import WorkSessionSettings from "./WorkSessionSettings";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import { useEffect, useState } from "react";
import { DBIcon, SettingsIcon } from "src/shared/assets/Icons";
import clsx from "clsx";
import Indicator from "src/shared/components/Indicator";
import useIndicator from "src/shared/hooks/useIndicator";
import { Activity } from "src/features/activity/types/Activity";
import useUntrackedActivity from "src/features/activity/hooks/useUnrecoredActivity";
import workSessionService from "src/features/work-session/services/workSessionService";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import activityService from "src/features/activity/services/activityService";
import ActivityCreator from "src/features/activity/components/ActivityCreator";
import ActivityComponent from "src/features/activity/components/Activity";


const pauseActivityMock: Activity = {
    id: "pauses",
    title: "Pausas",
    tracks: []
};


interface Props {
    session: WorkSession;
    onSessionChange: (newSession: WorkSession) => void;
    readOnly?: boolean;
}


export function WorkSession({ session, onSessionChange, readOnly }: Props) {
    const saveIndicator = useIndicator();
    const [showSettings, setShowSettings] = useState(false);
    const { workSessionSettings } = useWorkSessionSettigs();

    const title = formatDateToText(toDate(session.createdTimeStamp));

    // Untracked Activity
    const sessionTimer = workSessionService.getTimerWithOverrides(session.timer);
    const untrackedActivity = useUntrackedActivity(session.activities, sessionTimer);
    // local wrapper state for untrackedActivity.isCollapsed
    const [untrackedActIsCollapsed, setUntrackedActIsCollapsed] = useState(untrackedActivity.isCollapsed);
    untrackedActivity.isCollapsed = untrackedActIsCollapsed;


    // constantly update session timer
    useTimer(() => {
        const now = toDate().getTime();
        let _session = session;

        _session = workSessionService.setTimer(_session, {
            ...session.timer,
            start: session.timer.start || now,
            end: now,
        });

        // stopOnSessionEnd
        if (workSessionSettings.stopOnSessionEnd) {
            const sessionShouldEnd = isPast(session.timer.endOverride);
            if (sessionShouldEnd)
                _session = workSessionService.stopTimerAndActivities(_session);
        }

        onSessionChange(_session);

        console.log("Today timer");
    }, 5000, session.timer.status === TimeTrackStatus.RUNNING && !readOnly);


    // stop timer on window close
    useEffect(() => {
        // Feature not enabled
        if (!workSessionSettings.stopOnClose) return;
        console.log("stop timer on window close");
        const stopActivities = () => {
            const updatedSession = workSessionService.stopTimerAndActivities(session);
            onSessionChange(updatedSession);
        }

        window.addEventListener("beforeunload", stopActivities);
        return () => window.removeEventListener("beforeunload", stopActivities);
    }, [onSessionChange, session, workSessionSettings]);


    function addRecordToPauseActivity(currentSession: WorkSession, track: TimeTrack): WorkSession {
        // get a copy of current
        let _session = currentSession;

        const pauseActivity = _session.activities.find(act => act.id === pauseActivityMock.id);

        // no pauseActivity exists, create new one
        if (!pauseActivity) {
            _session = workSessionService.addActivity(_session, {
                ...pauseActivityMock,
                tracks: [track]
            });
            return _session; // dont continue
        }

        // edit existing pauseActivity
        const newPauseActivityResult = activityService.addTrack(pauseActivity, track);
        if (!newPauseActivityResult.success)
            return _session;

        _session = workSessionService.setActivity(_session, newPauseActivityResult.data);
        return _session;
    };


    function handleToggleTimer(currentSession: WorkSession, running: boolean): WorkSession {
        // get a copy of current
        let _session = currentSession;
        const now = toDate().getTime();

        // Stop timer and Stop all activities
        if (!running) {
            _session = workSessionService.stopTimerAndActivities(_session);
            return _session;
        }

        // Play timer

        // not first time, add a pause
        if (_session.timer.start) {
            _session = addRecordToPauseActivity(_session,
                {
                    id: generateId(),
                    start: _session.timer.end ?? now,
                    end: now,
                    status: TimeTrackStatus.STOPPED
                }
            );
        }

        _session = workSessionService.setTimer(_session, {
            ..._session.timer,
            start: _session.timer.start || now,
            end: now,
            status: TimeTrackStatus.RUNNING,
        });
        return _session; // dont continue
    }


    function handleToggleTimerWithState(running: boolean) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleToggleTimer(session, running);
        onSessionChange(updatedSession);
    }


    function handleSetActivity(currentSession: WorkSession, newActivity: Activity): WorkSession {
        // get a copy of current
        let _session = currentSession;

        // set the given activity
        _session = workSessionService.setActivity(_session, newActivity);

        // play todayTimer if activity is running
        if (_session.timer.status !== TimeTrackStatus.RUNNING && activityService.hasRunningTracks(newActivity)) {
            _session = handleToggleTimer(_session, true);
        }

        return _session;
    }


    function handleSetActivityWithState(newActivity: Activity) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleSetActivity(session, newActivity);
        onSessionChange(updatedSession);
    }


    function handleCreateNewActivity(currentSession: WorkSession, newActivity: Activity): WorkSession {
        // get a copy of current
        let _session = currentSession;

        _session = workSessionService.addActivity(_session, newActivity);

        // play session timer if the newActivity is running
        if (_session.timer.status !== TimeTrackStatus.RUNNING && activityService.hasRunningTracks(newActivity)) {
            _session = handleToggleTimer(_session, true);
        }

        return _session;
    }


    function handleCreateNewActivityWithState(newActivity: Activity) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleCreateNewActivity(session, newActivity);
        onSessionChange(updatedSession);
    }


    return (
        <Container
            className={clsx({ "border-red-400": session.timer.status === TimeTrackStatus.RUNNING })}
        >

            {/* Settings panel */}
            <ContainerOverlay show={showSettings} >
                <WorkSessionSettings
                    session={session}
                    onSessionChange={onSessionChange}
                    onClose={() => setShowSettings(false)}
                    readOnly={readOnly}
                />
            </ContainerOverlay>


            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title={title}

                // Saving indicator
                middle={<Indicator
                    className="text-green-400"
                    text="Guardado"
                    icon={<DBIcon className="size-5" />}
                    indicatorState={saveIndicator.state}
                />}

                // Timer
                right={<WorkSessionTimer
                    session={session}
                    readOnly={readOnly}
                    onTimerToggle={handleToggleTimerWithState}
                />}

                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />


            {!readOnly &&
                <ActivityCreator onCreate={handleCreateNewActivityWithState} />
            }

            { // create activities
                session.activities.map(activity => (
                    <ActivityComponent
                        key={activity.id}
                        activity={activity}
                        onActivityChange={handleSetActivityWithState}
                        readOnly={readOnly}
                    />
                ))
            }

            {untrackedActivity.tracks.length > 0 && // show only if has records
                <ActivityComponent
                    key="unrecored"
                    activity={untrackedActivity}
                    onActivityChange={newActivity => setUntrackedActIsCollapsed(newActivity.isCollapsed ?? false)}
                    readOnly
                />
            }
        </Container >
    )
}



