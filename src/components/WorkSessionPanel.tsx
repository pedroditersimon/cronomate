import clsx from "clsx";
import { ActivityType, RecordType, WorkSessionType } from "../types/Activity";
import activityService from "../services/activityService";
import { formatDateToText, toDate, toElapsedHourMinutesFormat } from "../utils/TimeUtils";
import { generateId } from "../utils/generateId";
import Container from "../layouts/Container";
import { ProgressBar } from "../components/ProgressBar";
import Clickable from "../components/Clickable";
import { PlayIcon, StopIcon } from "../assets/Icons";
import ActivityCreator from "../components/Activity/ActivityCreator";
import Activity from "../components/Activity/Activity";
import { useMemo } from "react";
import useTimer from "../hooks/useTimer";
import useUnrecordedActivity from "../hooks/useUnrecoredActivity";
import workSessionService from "../services/workSessionService";


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

export function WorkSessionPanel({ session, onSessionChange, readOnly }: Props) {

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

    // calculated states
    const [totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = activityService.getAllElapsedTime(session.activities);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

        return [totalElapsedTimeTxt];
    }, [session]);

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

    const handleSetRunningTodayTimer = (running: boolean) => {
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
            handleSetRunningTodayTimer(true);
        }
    }

    const handleCreateNewActivity = (newActivity: ActivityType) => {
        if (readOnly) return; // prevent edit in readOnly

        const updatedSession = workSessionService.addActivity(session, newActivity);
        onSessionChange(updatedSession);

        // play todayTimer if activity is running
        if (!session.timer.running && activityService.hasRunningRecords(newActivity)) {
            handleSetRunningTodayTimer(true);
        }
    }

    return (
        <Container>
            {/* Today Timer */}
            <div className="flex flex-row mb-1 items-center">
                <h1 className="text-xl font-bold">{title}</h1>
                <div
                    className={clsx("flex flex-row ml-auto p-1 pl-2 rounded-md",
                        { "bg-red-400": session.timer.running, }
                    )}
                >
                    {/* Today elapsed time txt */}
                    {totalElapsedTimeTxt &&
                        <div className="flex flex-col items-center ">
                            <span className="mx-2 text-sm">{totalElapsedTimeTxt}</span>
                            <ProgressBar progress={150} background={{ "bg-yellow-200": session.timer.running }} />
                        </div>
                    }

                    {!readOnly && /* toggle timer btn */
                        <Clickable
                            className={clsx({
                                "hover:bg-red-400": !session.timer.running,
                                "hover:bg-white hover:text-red-400": session.timer.running,
                            })}
                            onClick={() => handleSetRunningTodayTimer(!session.timer.running)}
                            children={session.timer.running
                                ? <StopIcon />
                                : <PlayIcon />}
                        />
                    }
                </div>
            </div>

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



