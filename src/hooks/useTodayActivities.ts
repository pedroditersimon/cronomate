import { useDispatch } from "react-redux";
import { setTimer, addActivity, setActivities, setActivity, save, load, setSession } from "../redux/slices/todaySession";
import { useTypedSelector } from "./useTypedSelector";
import { ActivityType, RecordType, WorkSessionType } from "../types/Activity";

export default function useTodaySession() {
    const todaySession = useTypedSelector(state => state.todaySession);

    const dispatch = useDispatch();

    const _save = () => {
        dispatch(save());
    }

    const _load = () => {
        dispatch(load());
    }

    const _setSession = (newSession: WorkSessionType) => {
        dispatch(setSession({ newSession }));
    }

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

    return {
        todaySession,

        save: _save,
        load: _load,

        setSession: _setSession,

        setTodayTimer: _setTimer,

        setActivities: _setActivities,
        setActivity: _setActivity,
        addActivity: _addActivity,
    };
}