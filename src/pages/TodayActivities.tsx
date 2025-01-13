import clsx from "clsx";
import { ActivityType, RecordType } from "../types/Activity";
import useTodayActivities from "../hooks/useTodayActivities";
import activityService from "../services/activityService";
import { toDate, toElapsedHourMinutesFormat } from "../utils/TimeUtils";
import { generateId } from "../utils/generateId";
import Container from "../layouts/Container";
import { ProgressBar } from "../components/ProgressBar";
import Clickable from "../components/Clickable";
import { PlayIcon, StopIcon } from "../assets/Icons";
import ActivityCreator from "../components/Activity/ActivityCreator";
import Activity from "../components/Activity/Activity";
import useAutoSaving from "../hooks/useAutoSaving";
import { useMemo } from "react";
import useTimer from "../hooks/useTimer";


const pauseActivityMock: ActivityType = {
    id: "pauses",
    title: "Pausas",
    records: []
};


export function TodayActivities() {
    const {
        save,
        todayTimer, setTodayTimer, // Timer
        activities, setActivities, setActivity, addActivity, // Activities
        unrecordedActivity,
    } = useTodayActivities();

    useAutoSaving(save, 5000);

    useTimer(() => {
        const now = toDate().getTime();
        setTodayTimer({
            ...todayTimer,
            startTime: todayTimer.startTime || now,
            endTime: now,
        });
        console.log("Today timer");
    }, 5000, todayTimer.running);

    // calculated states
    const [totalElapsedTimeTxt] = useMemo(() => {

        const totalElapsedTime = activityService.getAllElapsedTime(activities);
        const totalElapsedTimeTxt = toElapsedHourMinutesFormat(totalElapsedTime);

        return [totalElapsedTimeTxt];
    }, [activities]);

    const addRecordToPauseActivity = (record: RecordType) => {
        const pauseActivity = activities.find(act => act.id === pauseActivityMock.id);

        // no pauseActivity exists, create new one
        if (!pauseActivity) {
            addActivity({
                ...pauseActivityMock,
                records: [record]
            });
            return; // dont continue
        }

        // edit existing pauseActivity
        setActivity(
            activityService.addRecord(pauseActivity, record)
        );
    };

    const handleSetRunningTodayTimer = (running: boolean) => {
        const now = toDate().getTime();

        // Play timer
        if (running) {
            // not first time, add a pause
            if (todayTimer.startTime) {
                addRecordToPauseActivity({
                    id: generateId(),
                    startTime: todayTimer.endTime,
                    endTime: now,
                });
            }

            setTodayTimer({
                ...todayTimer,
                startTime: todayTimer.startTime || now,
                endTime: now,
                running: true
            });
            return;// dont continue
        }

        // Stop timer
        setTodayTimer({
            ...todayTimer,
            endTime: now,
            running: false
        });

        // stop all activities
        setActivities(activityService.stopAll(activities));
    }

    const handleSetActivity = (newActivity: ActivityType) => {
        setActivity(newActivity);

        // play todayTimer if activity is running
        if (!todayTimer.running && activityService.hasRunningRecords(newActivity)) {
            handleSetRunningTodayTimer(true);
        }
    }

    const handleCreateNewActivity = (newActivity: ActivityType) => {
        addActivity(newActivity);

        // play todayTimer if activity is running
        if (!todayTimer.running && activityService.hasRunningRecords(newActivity)) {
            handleSetRunningTodayTimer(true);
        }
    }

    return (
        <Container>
            {/* Today Timer */}
            <div className="flex flex-row mb-1 items-center">
                <h1 className="text-xl font-bold">Hoy</h1>
                <div
                    className={clsx("flex flex-row ml-auto p-1 pl-2 rounded-md",
                        { "bg-red-400": todayTimer.running, }
                    )}
                >
                    {/* Today elapsed time txt */}
                    {totalElapsedTimeTxt &&
                        <div className="flex flex-col items-center ">
                            <span className="mx-2">{totalElapsedTimeTxt}</span>
                            <ProgressBar progress={150} background={{ "bg-yellow-200": todayTimer.running }} />
                        </div>
                    }

                    {/* toggle timer btn */}
                    <Clickable
                        className={clsx({
                            "hover:bg-red-400": !todayTimer.running,
                            "hover:bg-white hover:text-red-400": todayTimer.running,
                        })}
                        onClick={() => handleSetRunningTodayTimer(!todayTimer.running)}
                        children={todayTimer.running
                            ? <StopIcon />
                            : <PlayIcon />}
                    />
                </div>
            </div>

            <ActivityCreator onActivityCreated={handleCreateNewActivity} />

            { // create activities
                activities.map(activity => (
                    <Activity
                        key={activity.id}
                        activity={activity}
                        onActivityChange={handleSetActivity}
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



