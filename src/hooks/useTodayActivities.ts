import { useDispatch } from "react-redux";
import { addNewActivity, setActivity, } from "../redux/slices/todayActivities";
import { useTypedSelector } from "./useTypedSelector";
import { ActivityType } from "../types/Activity";

export default function useTodayActivities() {
    const activities = useTypedSelector(state => state.todayActivities);
    const dispatch = useDispatch();

    const _setActivity = (id: string, newActivity: ActivityType) => {
        dispatch(setActivity({ id, newActivity }));
    }

    const _addNewActivity = (newActivity: ActivityType) => {
        dispatch(addNewActivity({ newActivity }));
    }

    return { activities, setActivity: _setActivity, addNewActivity: _addNewActivity };
}