import { useDispatch } from "react-redux";
import { addActivity, setActivities, setActivity, } from "../redux/slices/todayActivities";
import { useTypedSelector } from "./useTypedSelector";
import { ActivityType } from "../types/Activity";

export default function useTodayActivities() {
    const activities = useTypedSelector(state => state.todayActivities);
    const dispatch = useDispatch();

    const _setActivities = (newActivities: Array<ActivityType>) => {
        dispatch(setActivities({ newActivities }));
    }

    const _setActivity = (newActivity: ActivityType) => {
        dispatch(setActivity({ newActivity }));
    }

    const _addActivity = (newActivity: ActivityType) => {
        dispatch(addActivity({ newActivity }));
    }

    return {
        activities,
        setActivities: _setActivities,
        setActivity: _setActivity,
        addActivity: _addActivity
    };
}