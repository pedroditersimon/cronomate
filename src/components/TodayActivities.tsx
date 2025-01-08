import { useState } from "react";
import useTodayActivities from "../hooks/useTodayActivities";
import Container from "../layouts/Container";
import Activity from "./Activity/Activity";
import ActivityCreator from "./Activity/ActivityCreator";
import Clickable from "./Clickable";
import { PlayIcon, StopIcon } from "../assets/Icons";
import { ProgressBar } from "./ProgressBar";

export default function TodayActivities() {
    const { activities, setActivity, addNewActivity } = useTodayActivities();

    // local states
    const [running, setRunning] = useState(false);

    return (
        <Container>
            <div className="flex flex-row">
                <h1 className="text-xl font-bold">Hoy</h1>
                <div className="flex flex-col ml-auto">
                    <span>2h 1m</span>
                    <ProgressBar progress={120} />
                </div>
                <Clickable
                    onClick={() => setRunning(prev => !prev)}
                    children={running
                        ? <StopIcon className="hover:bg-red-400" />
                        : <PlayIcon className="hover:bg-red-400" />}
                />
            </div>


            {activities.map(activity => (
                <Activity key={activity.id}
                    activity={activity}
                    onActivityChange={newActivity => setActivity(activity.id, newActivity)}
                />
            ))}
            <ActivityCreator onActivityCreated={addNewActivity} />
        </Container>
    )
}

