import { useState } from "react";
import { ActivityType } from "../../types/Activity";
import Activity from "./Activity";
import { generateId } from "../../utils/generateId";
import clsx from "clsx";

interface Props {
    onActivityCreated: (newActivity: ActivityType) => void;
}

const activityMock: ActivityType = {
    id: "activityMock",
    records: [],
    title: "Crear actividad"
};

export default function ActivityCreator({ onActivityCreated }: Props) {
    // local states
    const [activity, setActivity] = useState<ActivityType>(activityMock);
    const [focused, setFocused] = useState(false);

    const handleCreateActivity = (newActivity: ActivityType) => {
        // Es necesario borrar minimante el texto inicial
        if (newActivity.title.includes(activityMock.title))
            return;

        const now = new Date().getTime();

        // crear nuevo activity con record corriendo
        const newActivityWithRecord = {
            id: generateId(),
            title: newActivity.title,
            records: [{
                id: generateId(),
                startTime: now,
                endTime: now,
                running: true
            }]
        };
        console.log("crear el activity");
        onActivityCreated(newActivityWithRecord);   // crear el activity
        setActivity(activityMock);                  // reset activity
    }

    const handleSetActivity = (newActivity: ActivityType) => {
        // Es necesario ingresar un titulo
        if (newActivity.title === activityMock.title) return;

        // Se ha dado a play
        if (newActivity.records.length > 0) {
            handleCreateActivity(newActivity); // crear el activity
            return;
        }

        // Seguir actualizando el estado local
        setActivity(newActivity);
    }

    const handleOnTitleConfirm = () => {
        // reset activity
        if (activity.title === "") {
            setActivity(activityMock);
            return;
        }

        // crear nuevo activity
        handleCreateActivity(activity);
    }

    return (
        <div
            className={clsx("transition-opacity", {
                "opacity-25": !focused,
                "opacity-100": focused
            })}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        >
            <Activity
                activity={activity}
                onActivityChange={handleSetActivity}
                onTitleConfirm={handleOnTitleConfirm}
            />
        </div>
    );
}