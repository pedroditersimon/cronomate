import { Session as WorkSessionType } from "../types/Session";
import { formatDateToText, toDate } from "src/shared/utils/TimeUtils";
import Container from "src/shared/layouts/Container";
import ContainerTopbar from "src/shared/layouts/ContainerTopbar";
import SessionTimer from "./SessionTimer";
import SessionSettings from "./SessionSettings";
import ContainerOverlay from "src/shared/layouts/ContainerOverlay";
import { ReactNode, useMemo, useState } from "react";
import { SettingsIcon } from "src/assets/Icons";
import clsx from "clsx";
import { Activity } from "src/features/activity/types/Activity";
import useUntrackedActivity from "src/features/activity/hooks/useUnrecoredActivity";
import sessionService from "src/features/session/services/sessionService";
import activityService from "src/features/activity/services/activityService";
import ActivityCreator from "src/features/activity/components/ActivityCreator";
import ActivityComponent from "src/features/activity/components/Activity";
import { pauseActivityMock } from "src/features/session/mocks/pauseActivityMock";

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


export default function Session({
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
    const [isActivityCreatorFocused, setIsActivityCreatorFocused] = useState(false);

    const title = formatDateToText(toDate(session.createdTimestamp));

    // Filter deleted activities and activities without tracks
    const filteredActivities = session.activities.filter(act => !act.isDeleted && activityService.hasUnarchivedTracks(act));

    // Untracked Activity
    const untrackedActivity = useUntrackedActivity(filteredActivities);
    // local wrapper state for untrackedActivity.isCollapsed
    const [untrackedActIsCollapsed, setUntrackedActIsCollapsed] = useState(untrackedActivity.isCollapsed);
    untrackedActivity.isCollapsed = untrackedActIsCollapsed;

    const [hasRunningTracks] = useMemo(() => {
        const hasRunningTracks = filteredActivities.some(act => activityService.hasRunningTracks(act));
        return [hasRunningTracks];
    }, [filteredActivities]);

    function handleSetActivity(currentSession: WorkSessionType, newActivity: Activity): WorkSessionType {

        // prevent delete pauseActivity
        if (newActivity.id === pauseActivityMock.id && newActivity.isDeleted)
            return currentSession;

        // get a copy of current
        let _session = currentSession;

        // stop activites if new activity is running
        const isRunning = activityService.hasRunningTracks(newActivity);
        if (isRunning)
            _session = sessionService.stopActivities(_session);

        // set the given activity
        _session = sessionService.setActivity(_session, newActivity);

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
        let _session = sessionService.stopActivities(currentSession);

        _session = sessionService.addActivity(_session, newActivity);

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
            className={clsx({ "border-red-400": hasRunningTracks })}
        >

            {/* Settings panel */}
            <ContainerOverlay show={showSettings} >
                <SessionSettings
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
                right={<SessionTimer
                    session={session}
                    readOnly={!canEdit}
                    onSessionChange={onSessionChange}
                />}

                icon={<SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />


            {canCreate &&
                <ActivityCreator
                    onCreate={handleCreateNewActivityWithState}
                    onFocusChange={setIsActivityCreatorFocused}
                />
            }

            <div
                className={clsx("flex flex-col gap-2",
                    { "opacity-25": isActivityCreatorFocused }
                )}
            >
                { // Activities list
                    filteredActivities.map(activity => (
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
                    className={clsx(
                        { "opacity-25": isActivityCreatorFocused }
                    )}
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




