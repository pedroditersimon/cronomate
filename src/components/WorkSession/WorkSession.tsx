import { ActivityType, RecordType, WorkSessionType } from "../../types/Activity";
import activityService from "../../services/activityService";
import { formatDateToText, toDate } from "../../utils/TimeUtils";
import { generateId } from "../../utils/generateId";
import Container from "../../layouts/Container";
import ActivityCreator from "../Activity/ActivityCreator";
import Activity from "../Activity/Activity";
import useTimer from "../../hooks/useTimer";
import useUnrecordedActivity from "../../hooks/useUnrecoredActivity";
import workSessionService from "../../services/workSessionService";
import ContainerTopbar from "../../layouts/ContainerTopbar";
import WorkSessionTimer from "./WorkSessionTimer";
import WorkSessionSettings from "./WorkSessionSettings";
import ContainerOverlay from "../../layouts/ContainerOverlay";
import { useState } from "react";
import { SettingsIcon } from "../../assets/Icons";


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

    const [showSettings, setShowSettings] = useState(false);

    const title = formatDateToText(toDate(session.createdTimeStamp));
    const unrecordedActivity = useUnrecordedActivity(session.activities, session.timer);

    useTimer(() => {
        const now = toDate().getTime();

        const updatedSession = workSessionService.setTimer(session, {
            ...session.timer,
            startTime: session.timer.startTime || now,
            endTime: now,
        });
        onSessionChange(updatedSession);

        console.log("Today timer");
    }, 5000, session.timer.running && !readOnly);



    const addRecordToPauseActivity = (record: RecordType) => {
        if (readOnly) return; // prevent edit in readOnly

        const pauseActivity = session.activities.find(act => act.id === pauseActivityMock.id);

        // no pauseActivity exists, create new one
        if (!pauseActivity) {
            const updatedSession = workSessionService.addActivity(session, {
                ...pauseActivityMock,
                records: [record]
            });
            onSessionChange(updatedSession);
            return; // dont continue
        }

        // edit existing pauseActivity
        const newPauseActivity = activityService.addRecord(pauseActivity, record);
        const updatedSession = workSessionService.setActivity(session, newPauseActivity);
        onSessionChange(updatedSession);
    };

    const handleToggleTimer = (running: boolean) => {
        if (readOnly) return; // prevent edit in readOnly

        const now = toDate().getTime();

        // Play timer
        if (running) {
            // not first time, add a pause
            if (session.timer.startTime) {
                addRecordToPauseActivity({
                    id: generateId(),
                    startTime: session.timer.endTime,
                    endTime: now,
                });
            }

            const updatedSession = workSessionService.setTimer(session, {
                ...session.timer,
                startTime: session.timer.startTime || now,
                endTime: now,
                running: true
            });
            onSessionChange(updatedSession);
            return;// dont continue
        }

        // 1. Stop timer and Stop all activities
        const updatedSession = workSessionService.stopTimerAndActivities(session);
        onSessionChange(updatedSession);
    }

    const handleSetActivity = (newActivity: ActivityType) => {
        if (readOnly) return; // prevent edit in readOnly

        const updatedSession = workSessionService.setActivity(session, newActivity);
        onSessionChange(updatedSession);

        // play todayTimer if activity is running
        if (!session.timer.running && activityService.hasRunningRecords(newActivity)) {
            handleToggleTimer(true);
        }
    }

    const handleCreateNewActivity = (newActivity: ActivityType) => {
        if (readOnly) return; // prevent edit in readOnly

        const updatedSession = workSessionService.addActivity(session, newActivity);
        onSessionChange(updatedSession);

        // play todayTimer if activity is running
        if (!session.timer.running && activityService.hasRunningRecords(newActivity)) {
            handleToggleTimer(true);
        }
    }

    return (
        <Container>

            {/* Settings panel */}
            <ContainerOverlay show={showSettings && !readOnly} >
                <WorkSessionSettings
                    session={session}
                    onClose={() => setShowSettings(false)}
                />
            </ContainerOverlay>


            {/* Topbar */}
            <ContainerTopbar
                className="group"
                title={title}
                // Timer
                right={<WorkSessionTimer
                    session={session}
                    readOnly={readOnly}
                    onTimerToggle={handleToggleTimer}
                />}

                icon={!readOnly && <SettingsIcon />}
                onIconClick={() => setShowSettings(true)}
            />


            {!readOnly &&
                <ActivityCreator onActivityCreated={handleCreateNewActivity} />
            }

            { // create activities
                session.activities.map(activity => (
                    <Activity
                        key={activity.id}
                        activity={activity}
                        onActivityChange={handleSetActivity}
                        readOnly={readOnly}
                    />
                ))
            }

            {unrecordedActivity.records.length > 0 && // show only if has records
                <Activity key="unrecored"
                    activity={unrecordedActivity}
                    onActivityChange={() => { }}
                    readOnly
                />
            }
        </Container >
    )
}



