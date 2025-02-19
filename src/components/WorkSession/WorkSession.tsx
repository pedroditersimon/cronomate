import { ActivityType, RecordType, WorkSessionType } from "src/types/Activity";
import activityService from "src/services/activityService";
import { formatDateToText, isPast, toDate } from "src/utils/TimeUtils";
import { generateId } from "src/utils/generateId";
import Container from "src/layouts/Container";
import ActivityCreator from "src/components/Activity/ActivityCreator";
import Activity from "src/components/Activity/Activity";
import useTimer from "src/hooks/useTimer";
import useUnrecordedActivity from "src/hooks/useUnrecoredActivity";
import workSessionService from "src/services/workSessionService";
import ContainerTopbar from "src/layouts/ContainerTopbar";
import WorkSessionTimer from "./WorkSessionTimer";
import WorkSessionSettings from "./WorkSessionSettings";
import ContainerOverlay from "src/layouts/ContainerOverlay";
import { useEffect, useState } from "react";
import { DBIcon, SettingsIcon } from "src/assets/Icons";
import clsx from "clsx";
import Indicator from "src/components/Indicator";
import useIndicator from "src/hooks/useIndicator";
import useWorkSessionSettigs from "src/hooks/useWorkSessionSettigs";


const pauseActivityMock: ActivityType = {
    id: "pauses",
    title: "Pausas",
    records: []
};


interface Props {
    session: WorkSessionType;
    onSessionChange: (newSession: WorkSessionType) => void;
    readOnly?: boolean;
}


export function WorkSession({ session, onSessionChange, readOnly }: Props) {
    const saveIndicator = useIndicator();
    const [showSettings, setShowSettings] = useState(false);
    const { workSessionSettings } = useWorkSessionSettigs();

    const title = formatDateToText(toDate(session.createdTimeStamp));

    // Unrecorded Activity
    const sessionTimer = workSessionService.getTimerWithOverrides(session.timer);
    const unrecordedActivity = useUnrecordedActivity(session.activities, sessionTimer);
    const [unrecordedIsCollapsed, setUnrecordedIsCollapsed] = useState(unrecordedActivity.isCollapsed);
    unrecordedActivity.isCollapsed = unrecordedIsCollapsed;


    // constantly update session timer
    useTimer(() => {
        const now = toDate().getTime();
        let _session = session;

        _session = workSessionService.setTimer(_session, {
            ...session.timer,
            startTime: session.timer.startTime || now,
            endTime: now,
        });

        // stopOnSessionEnd
        if (workSessionSettings.stopOnSessionEnd) {
            const sessionShouldEnd = isPast(session.timer.endTimeOverride);
            if (sessionShouldEnd)
                _session = workSessionService.stopTimerAndActivities(_session);
        }

        onSessionChange(_session);

        console.log("Today timer");
    }, 5000, session.timer.running && !readOnly);


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


    function addRecordToPauseActivity(currentSession: WorkSessionType, record: RecordType): WorkSessionType {
        // get a copy of current
        let _session = currentSession;

        const pauseActivity = _session.activities.find(act => act.id === pauseActivityMock.id);

        // no pauseActivity exists, create new one
        if (!pauseActivity) {
            _session = workSessionService.addActivity(_session, {
                ...pauseActivityMock,
                records: [record]
            });
            return _session; // dont continue
        }

        // edit existing pauseActivity
        const newPauseActivity = activityService.addRecord(pauseActivity, record);
        _session = workSessionService.setActivity(_session, newPauseActivity);
        return _session;
    };


    function handleToggleTimer(currentSession: WorkSessionType, running: boolean): WorkSessionType {
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
        if (_session.timer.startTime) {
            _session = addRecordToPauseActivity(_session,
                {
                    id: generateId(),
                    startTime: _session.timer.endTime,
                    endTime: now,
                }
            );
        }

        _session = workSessionService.setTimer(_session, {
            ..._session.timer,
            startTime: _session.timer.startTime || now,
            endTime: now,
            running: true
        });
        return _session; // dont continue
    }


    function handleToggleTimerWithState(running: boolean) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleToggleTimer(session, running);
        onSessionChange(updatedSession);
    }


    function handleSetActivity(currentSession: WorkSessionType, newActivity: ActivityType): WorkSessionType {
        // get a copy of current
        let _session = currentSession;

        // set the given activity
        _session = workSessionService.setActivity(_session, newActivity);

        // play todayTimer if activity is running
        if (!_session.timer.running && activityService.hasRunningRecords(newActivity)) {
            _session = handleToggleTimer(_session, true);
        }

        return _session;
    }


    function handleSetActivityWithState(newActivity: ActivityType) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleSetActivity(session, newActivity);
        onSessionChange(updatedSession);
    }


    function handleCreateNewActivity(currentSession: WorkSessionType, newActivity: ActivityType): WorkSessionType {
        // get a copy of current
        let _session = currentSession;

        _session = workSessionService.addActivity(_session, newActivity);

        // play session timer if the newActivity is running
        if (!_session.timer.running && activityService.hasRunningRecords(newActivity)) {
            _session = handleToggleTimer(_session, true);
        }

        return _session;
    }


    function handleCreateNewActivityWithState(newActivity: ActivityType) {
        // prevent edit in readOnly
        if (readOnly) return;

        const updatedSession = handleCreateNewActivity(session, newActivity);
        onSessionChange(updatedSession);
    }


    return (
        <Container
            className={clsx({ "border-red-400": session.timer.running })}
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
                <ActivityCreator onActivityCreated={handleCreateNewActivityWithState} />
            }

            { // create activities
                session.activities.map(activity => (
                    <Activity
                        key={activity.id}
                        activity={activity}
                        onActivityChange={handleSetActivityWithState}
                        readOnly={readOnly}
                    />
                ))
            }

            {unrecordedActivity.records.length > 0 && // show only if has records
                <Activity
                    key="unrecored"
                    activity={unrecordedActivity}
                    onActivityChange={newActivity => setUnrecordedIsCollapsed(newActivity.isCollapsed ?? false)}
                    readOnly
                />
            }
        </Container >
    )
}



