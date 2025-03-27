import { WorkSession as WorkSessionType } from "../types/WorkSession";
import { formatDateToText, toDate } from "src/shared/utils/TimeUtils";
import { generateId } from "src/shared/utils/generateId";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import WorkSessionTimer from "./WorkSessionTimer";
import WorkSessionSettings from "./WorkSessionSettings";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import { ReactNode, useState } from "react";
import { SettingsIcon } from "src/shared/assets/Icons";
import clsx from "clsx";
import { Activity } from "src/features/activity/types/Activity";
import useUntrackedActivity from "src/features/activity/hooks/useUnrecoredActivity";
import workSessionService from "src/features/work-session/services/workSessionService";
import { TimeTrack, TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import activityService from "src/features/activity/services/activityService";
import ActivityCreator from "src/features/activity/components/ActivityCreator";
import ActivityComponent from "src/features/activity/components/Activity";
import { pauseActivityMock } from "src/features/work-session/mocks/pauseActivityMock";

export type WorkSessionActions = "all" | "none" | ("edit" | "create" | "archive" | "restore")[];

interface Props {
    session: WorkSessionType;
    onSessionChange: (newSession: WorkSessionType) => void;

    // Content projection for WorkSessionSettings
    inAboveSettings?: ReactNode;
    inBelowSettings?: ReactNode;

    // Allowed actions
    canEdit?: boolean;
    canCreate?: boolean;
    canArchive?: boolean;
    canRestore?: boolean;
}


export default function WorkSession({
    session,
    onSessionChange,
    inAboveSettings,
    inBelowSettings,

    // Allowed actions
    canEdit = true,
    canCreate = true,
    canArchive = true,
    canRestore = true,
}: Props) {
    const [showSettings, setShowSettings] = useState(false);

    const title = formatDateToText(toDate(session.createdTimeStamp));

    // Untracked Activity
    const sessionTimer = workSessionService.getTimerWithOverrides(session.timer);
    const untrackedActivity = useUntrackedActivity(session.activities, sessionTimer);
    // local wrapper state for untrackedActivity.isCollapsed
    const [untrackedActIsCollapsed, setUntrackedActIsCollapsed] = useState(untrackedActivity.isCollapsed);
    untrackedActivity.isCollapsed = untrackedActIsCollapsed;

    const unarchivedActivities = session.activities.filter(act => !act.isDeleted && activityService.hasUnarchivedTracks(act));

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
        // already in that state
        if (currentSession.timer.status === status)
            return currentSession;

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
        if (_session.timer.start && session.timer.end !== null) {
            _session = addRecordToPauseActivity(_session,
                {
                    id: generateId(),
                    start: _session.timer.end!,
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
        if (!canEdit) return;

        const updatedSession = handleSetTimerStatus(session, status);
        onSessionChange(updatedSession);
    }


    function handleSetActivity(currentSession: WorkSessionType, newActivity: Activity): WorkSessionType {

        // prevent delete pauseActivity
        if (newActivity.id === pauseActivityMock.id && newActivity.isDeleted)
            return currentSession;

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
        if (!canEdit) return;

        const updatedSession = handleSetActivity(session, newActivity);
        onSessionChange(updatedSession);
    }


    function handleCreateNewActivity(currentSession: WorkSessionType, newActivity: Activity): WorkSessionType {
        // get a copy of current
        // stop activites
        let _session = workSessionService.stopActivities(currentSession);

        // play session timer if the newActivity is running
        if (activityService.hasRunningTracks(newActivity)) {
            _session = handleSetTimerStatus(_session, TimeTrackStatus.RUNNING);
        }

        _session = workSessionService.addActivity(_session, newActivity);

        return _session;
    }


    function handleCreateNewActivityWithState(newActivity: Activity) {
        // prevent edit in readOnly
        if (!canCreate) return;

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

                    // Content projection
                    inAboveContent={inAboveSettings}
                    inBelowContent={inBelowSettings}

                    // Allowed actions
                    canEdit={canEdit}
                    canRestore={canRestore}
                />
            </ContainerOverlay>


            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title={title}

                // Timer
                right={<WorkSessionTimer
                    session={session}
                    readOnly={!canEdit}
                    onSetTimerStatus={handleSetTimerStatusWithState}
                />}

                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />


            {canCreate &&
                <ActivityCreator onCreate={handleCreateNewActivityWithState} />
            }

            <div className="flex flex-col gap-2">
                { // Activities list
                    unarchivedActivities.map(activity => (
                        <ActivityComponent
                            key={activity.id}
                            activity={activity}
                            onActivityChange={handleSetActivityWithState}

                            canEdit={canEdit}
                            canArchive={canArchive}
                            canRestore={canRestore}
                        />
                    ))
                }
            </div>

            {untrackedActivity.tracks.length > 0 && // show only if has records
                <ActivityComponent
                    key={untrackedActivity.id}
                    activity={untrackedActivity}
                    onActivityChange={newActivity => setUntrackedActIsCollapsed(newActivity.isCollapsed ?? false)}

                    // disable actions on untrackedActivity
                    canEdit={false}
                    canArchive={false}
                    canRestore={false}
                />
            }
        </Container >
    )
}




