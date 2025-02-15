import { useMemo } from "react";
import recordService from "src/services/recordService";
const unrecordedActivityMock = {
    id: "unrecored",
    title: "No categorizadas",
    description: "Actividades varias, como organización, comunicación y espera por dependencias.",
    records: [],
    isCollapsed: true
};
export default function useUnrecordedActivity(activities, range) {
    const unrecordedActivity = useMemo(() => {
        const allRecords = activities.reduce((acc, activity) => activity.records.concat(acc), []);
        const unrecordedPeriods = recordService.getUnrecordedPeriods(allRecords, range);
        return Object.assign(Object.assign({}, unrecordedActivityMock), { records: unrecordedPeriods });
    }, [activities, range]);
    return unrecordedActivity;
}
