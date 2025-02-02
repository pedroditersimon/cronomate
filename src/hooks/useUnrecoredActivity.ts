import { useMemo } from "react";
import recordService from "../services/recordService";
import { ActivityType, RecordType } from "../types/Activity";


const unrecordedActivityMock: ActivityType = {
    id: "unrecored",
    title: "No categorizadas",
    description: "Actividades varias, como organización, comunicación y espera por dependencias.",
    records: [],
    isCollapsed: true
}

export default function useUnrecordedActivity(activities: Array<ActivityType>, range?: RecordType) {

    const unrecordedActivity = useMemo((): ActivityType => {
        const allRecords = activities.reduce<Array<RecordType>>((acc, activity) => activity.records.concat(acc), []);
        const unrecordedPeriods = recordService.getUnrecordedPeriods(allRecords, range);

        return {
            ...unrecordedActivityMock,
            records: unrecordedPeriods
        }

    }, [activities, range]);

    return unrecordedActivity;
}