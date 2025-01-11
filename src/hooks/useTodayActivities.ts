import { useDispatch } from "react-redux";
import { setTimer, addActivity, setActivities, setActivity, } from "../redux/slices/todayActivities";
import { useTypedSelector } from "./useTypedSelector";
import { ActivityType, RecordType } from "../types/Activity";
import recordService from "../services/recordService";
import { useMemo } from "react";


const unrecordedActivityMock: ActivityType = {
    id: "unrecored",
    title: "Sin registrar",
    records: []
}

export default function useTodayActivities() {
    const todayTimer = useTypedSelector(state => state.todayActivities.timer);
    const activities = useTypedSelector(state => state.todayActivities.activities);

    const dispatch = useDispatch();

    const _setTimer = (newTimer: RecordType) => {
        dispatch(setTimer({ newTimer }));
    }

    const _setActivities = (newActivities: Array<ActivityType>) => {
        dispatch(setActivities({ newActivities }));
    }

    const _setActivity = (newActivity: ActivityType) => {
        dispatch(setActivity({ newActivity }));
    }

    const _addActivity = (newActivity: ActivityType) => {
        dispatch(addActivity({ newActivity }));
    }

    const unrecordedActivity = useMemo((): ActivityType => {
        const allRecords = activities.reduce<Array<RecordType>>((acc, activity) => activity.records.concat(acc), []);
        const unrecordedPeriods = recordService.getUnrecordedPeriods(allRecords, todayTimer);
        return {
            ...unrecordedActivityMock,
            records: unrecordedPeriods
        }
    }, [activities, todayTimer]);

    return {
        todayTimer,
        setTodayTimer: _setTimer,

        activities,
        setActivities: _setActivities,
        setActivity: _setActivity,
        addActivity: _addActivity,

        unrecordedActivity
    };
}