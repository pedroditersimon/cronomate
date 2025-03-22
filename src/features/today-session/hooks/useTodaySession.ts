import { useDispatch } from "react-redux";
import { setTimer, addActivity, setActivities, setActivity, save, load, setSession, resetToDefaultState } from "src/features/today-session/states/todaySessionSlice";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { toast } from "sonner";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";
import { Activity } from "src/features/activity/types/Activity";
import sessionStorageService from "src/shared/services/sessionStorageService";


export default function useTodaySession() {
    const todaySession = useTypedSelector(state => state.todaySession);
    const todaySessionSettings = useTypedSelector(state => state.todaySessionSettings);

    const dispatch = useDispatch();

    const _save = (session?: WorkSession) => {
        dispatch(save({ session }));
    }

    const _load = () => {
        dispatch(load());
    }

    const _setSession = (newSession: WorkSession) => {
        dispatch(setSession({ newSession }));
    }

    const _setTimer = (newTimer: WorkSessionTimer) => {
        dispatch(setTimer({ newTimer }));
    }

    const _setActivities = (newActivities: Array<Activity>) => {
        dispatch(setActivities({ newActivities }));
    }

    const _setActivity = (newActivity: Activity) => {
        dispatch(setActivity({ newActivity }));
    }

    const _addActivity = (newActivity: Activity) => {
        dispatch(addActivity({ newActivity }));
    }

    const saveInHistoryAndReset = () => {
        sessionStorageService.saveItems("History", [todaySession]);
        dispatch(resetToDefaultState({ settings: todaySessionSettings }));
        // Ya que se utiliza la variable local 'todaySession',
        // es posible que esta cambie y al guardar no se este guardando lo ultimo que cambio
        toast.success("Sesion guardada en history! Ver comentarios");
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

        saveInHistoryAndReset
    };
}