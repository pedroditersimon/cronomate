import { useMemo, useState } from "react";
import clsx from "clsx";
import useTodayActivities from "../../hooks/useTodayActivities";
import Container from "../../layouts/Container";
import { ProgressBar } from "../ProgressBar";
import Clickable from "../Clickable";
import { PlayIcon, StopIcon } from "../../assets/Icons";
import Activity from "./Activity";
import ActivityCreator from "./ActivityCreator";
import { ActivityType, RecordType } from "../../types/Activity";
import { toDate } from "../../utils/TimeUtils";
import { generateId } from "../../utils/generateId";
import recordService from "../../services/recordService";
import activityService from "../../services/activityService";

const pauseActivityMock: ActivityType = {
    id: "pause",
    title: "Pausas",
    records: []
};


const unrecordedActivityMock: ActivityType = {
    id: "unrecored",
    title: "Sin registrar",
    records: []
}

export default function TodayActivities() {
    const { activities, setActivities, setActivity, addActivity } = useTodayActivities();

    // local states
    const [todayRecord, setTodayRecord] = useState<RecordType>({ id: "todayRecord" });


    const unrecordedActivity = useMemo((): ActivityType => {
        const allRecords = activities.reduce<Array<RecordType>>((acc, activity) => activity.records.concat(acc), []);
        const unrecordedPeriods = recordService.getUnrecordedPeriods(allRecords, todayRecord);
        return {
            ...unrecordedActivityMock,
            records: unrecordedPeriods
        }
    }, [activities, todayRecord]);


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
        if (!todayRecord.running) {
            // not first time, add a pause
            if (todayRecord.startTime) {
                addRecordToPauseActivity({
                    id: generateId(),
                    startTime: todayRecord.endTime,
                    endTime: now,
                });
            }

            setTodayRecord({
                ...todayRecord,
                startTime: todayRecord.startTime || now,
                endTime: now,
                running: true
            });
            return;// dont continue
        }

        // Stop timer
        setTodayRecord({
            ...todayRecord,
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
        if (!todayRecord.running && activityService.hasRunningRecords(newActivity)) {
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
                        { "bg-red-400": todayRecord.running, }
                    )}
                >
                    <div className="flex flex-col items-center ">
                        <span className="mx-2">2h 1m</span>
                        <ProgressBar progress={150} background={{ "bg-yellow-200": todayRecord.running }} />
                    </div>
                    <Clickable
                        onClick={handleToggleTodayTimer}
                        children={todayRecord.running
                            ? <StopIcon className="hover:bg-white hover:text-red-400" />
                            : <PlayIcon className="hover:bg-red-400" />}
                    />
                </div>
            </div>

            <ActivityCreator onActivityCreated={addActivity} />

            {
                activities.map(activity => (
                    <Activity key={activity.id}
                        activity={activity}
                        onActivityChange={handleSetActivity}
                        readOnly={activity.id == pauseActivityMock.id}
                    />
                ))
            }

            <Activity key="unrecored"
                activity={unrecordedActivity}
                onActivityChange={() => { }}
                readOnly
            />
        </Container >
    )
}

