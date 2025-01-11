import clsx from "clsx";
import { ActivityType, RecordType } from "../types/Activity";
import useTodayActivities from "../hooks/useTodayActivities";
import activityService from "../services/activityService";
import { toDate } from "../utils/TimeUtils";
import { generateId } from "../utils/generateId";
import Container from "../layouts/Container";
import { ProgressBar } from "../components/ProgressBar";
import Clickable from "../components/Clickable";
import { PlayIcon, StopIcon } from "../assets/Icons";
import ActivityCreator from "../components/Activity/ActivityCreator";
import Activity from "../components/Activity/Activity";


const pauseActivityMock: ActivityType = {
    id: "pause",
    title: "Pausas",
    records: []
};


export default function TodayActivities() {
    const {
        todayTimer, setTodayTimer, // Timer
        activities, setActivities, setActivity, addActivity, // Activities
        unrecordedActivity
    } = useTodayActivities();

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

    const handleToggleTodayTimer = () => {
        const now = toDate().getTime();

        // Play timer
        if (!todayTimer.running) {
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
        // pause cannot be modified
        if (newActivity.id === pauseActivityMock.id) return;
        setActivity(newActivity);

        // play todayTimer if activity is running
        if (!todayTimer.running && activityService.hasRunningRecords(newActivity)) {
            handleToggleTodayTimer();
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
                    <div className="flex flex-col items-center ">
                        <span className="mx-2">2h 1m</span>
                        <ProgressBar progress={150} background={{ "bg-yellow-200": todayTimer.running }} />
                    </div>
                    <Clickable
                        onClick={handleToggleTodayTimer}
                        children={todayTimer.running
                            ? <StopIcon className="hover:bg-white hover:text-red-400" />
                            : <PlayIcon className="hover:bg-red-400" />}
                    />
                </div>
            </div>

            <ActivityCreator onActivityCreated={addActivity} />

            { // create activities
                activities.map(activity => (
                    <Activity key={activity.id}
                        activity={activity}
                        onActivityChange={handleSetActivity}
                        readOnly={activity.id == pauseActivityMock.id}
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

