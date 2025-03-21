import { WorkSession as WorkSessionType } from "../types/WorkSession";
import { formatDateToText, toDate } from "src/shared/utils/TimeUtils";
import { generateId } from "src/shared/utils/generateId";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import WorkSessionTimer from "./WorkSessionTimer";
import WorkSessionSettings from "./WorkSessionSettings";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import { ReactNode, useState } from "react";
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
import { pauseActivityMock } from "src/features/work-session/mocks/pauseActivityMock";

interface Props {
    session: WorkSessionType;
    onSessionChange: (newSession: WorkSessionType) => void;
    readOnly?: boolean;

    // Content projection for WorkSessionSettings
    inAboveSettings?: ReactNode;
    inBelowSettings?: ReactNode;
}


export default function WorkSession({ session, onSessionChange, readOnly, inAboveSettings, inBelowSettings }: Props) {
    const saveIndicator = useIndicator();
    const [showSettings, setShowSettings] = useState(false);

    const title = formatDateToText(toDate(session.createdTimeStamp));

    // Untracked Activity
    const sessionTimer = workSessionService.getTimerWithOverrides(session.timer);
    const untrackedActivity = useUntrackedActivity(session.activities, sessionTimer);
    // local wrapper state for untrackedActivity.isCollapsed
    const [untrackedActIsCollapsed, setUntrackedActIsCollapsed] = useState(untrackedActivity.isCollapsed);
    untrackedActivity.isCollapsed = untrackedActIsCollapsed;


    function addRecordToPauseActivity(currentSession: WorkSessionType, track: TimeTrack): WorkSessionType {
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


    function handleSetTimerStatus(currentSession: WorkSessionType, status: TimeTrackStatus): WorkSessionType {
        // get a copy of current
        let _session = currentSession;
        const now = toDate().getTime();

        // Stop timer and Stop all activities
        if (status === TimeTrackStatus.STOPPED) {
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


    function handleSetTimerStatusWithState(status: TimeTrackStatus) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleSetTimerStatus(session, status);
        onSessionChange(updatedSession);
    }


    function handleSetActivity(currentSession: WorkSessionType, newActivity: Activity): WorkSessionType {
        // get a copy of current
        let _session = currentSession;

        // set the given activity
        _session = workSessionService.setActivity(_session, newActivity);

        // play todayTimer if activity is running
        if (_session.timer.status !== TimeTrackStatus.RUNNING && activityService.hasRunningTracks(newActivity)) {
            _session = handleSetTimerStatus(_session, TimeTrackStatus.RUNNING);
        }

        return _session;
    }


    function handleSetActivityWithState(newActivity: Activity) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleSetActivity(session, newActivity);
        onSessionChange(updatedSession);
    }


    function handleCreateNewActivity(currentSession: WorkSessionType, newActivity: Activity): WorkSessionType {
        // get a copy of current
        let _session = currentSession;

        _session = workSessionService.addActivity(_session, newActivity);

        // play session timer if the newActivity is running
        if (_session.timer.status !== TimeTrackStatus.RUNNING && activityService.hasRunningTracks(newActivity)) {
            _session = handleSetTimerStatus(_session, TimeTrackStatus.RUNNING);
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

                    inAboveContent={inAboveSettings}  // Content projection
                    inBelowContent={inBelowSettings}
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
                    onSetTimerStatus={handleSetTimerStatusWithState}
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



