import { useDispatch } from "react-redux";
import { setActivity, } from "../redux/slices/todayActivities";
import { useTypedSelector } from "./useTypedSelector";
import { ActivityType } from "../types/Activity";

export default function useTodayActivities() {
    const activities = useTypedSelector(state => state.todayActivities);
    const dispatch = useDispatch();

    const _setActivity = (id: string, newActivity: ActivityType) => {
        dispatch(setActivity({ id, newActivity }));
    }

    return { activities, setActivity: _setActivity };
}