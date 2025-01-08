import { useMemo, useState } from "react";
import clsx from "clsx";
import useTodayActivities from "../../hooks/useTodayActivities";
import Container from "../../layouts/Container";
import { ProgressBar } from "../ProgressBar";
import Clickable from "../Clickable";
import { PlayIcon, StopIcon } from "../../assets/Icons";
import Activity from "./Activity";
import ActivityCreator from "./ActivityCreator";
import { getUnrecordedPeriods } from "../../utils/ActivityUtils";
import { ActivityType, RecordType } from "../../types/Activity";
import { toDate } from "../../utils/TimeUtils";
import { generateId } from "../../utils/generateId";

const pauseActivityMock: ActivityType = {
    id: "pause",
    title: "Pausas",
    records: []
};

export default function TodayActivities() {
    const { activities, setActivity, addNewActivity } = useTodayActivities();

    // local states
    const [todayRecord, setTodayRecord] = useState<RecordType>({ id: "todayRecord" });


    const unrecordedActivity = useMemo((): ActivityType => {
        const allRecords = activities.reduce<Array<RecordType>>((acc, activity) => activity.records.concat(acc), []);
        const unrecordedPeriods = getUnrecordedPeriods(allRecords, todayRecord);
        return {
            id: "unrecored",
            title: "Sin registrar",
            records: unrecordedPeriods
        };
    }, [activities, todayRecord]);

    const addRecordToPauseActivity = (record: RecordType) => {
        const pauseActivity = activities.find(act => act.id === pauseActivityMock.id);

        // no pauseActivity exists, create new one
        if (!pauseActivity) {
            addNewActivity({
                ...pauseActivityMock,
                records: [record]
            });
            return; // dont continue
        }

        // edit existing pauseActivity
        setActivity({
            ...pauseActivity,
            records: [...pauseActivity.records, record]
        });
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
        }
        // Stop timer
        else {
            setTodayRecord({
                ...todayRecord,
                endTime: toDate().getTime(),
                running: false
            });
        }
    }

    const handleSetActivity = (newActivity: ActivityType) => {
        // pause cannot be modified
        if (newActivity.id === "pause") return;
        setActivity(newActivity);
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

            <ActivityCreator onActivityCreated={addNewActivity} />

            {
                activities.map(activity => (
                    <Activity key={activity.id}
                        activity={activity}
                        onActivityChange={handleSetActivity}
                    />
                ))
            }

            <Activity key="unrecored"
                activity={unrecordedActivity}
                onActivityChange={() => { }}
            />
        </Container >
    )
}

