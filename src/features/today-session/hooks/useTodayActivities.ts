import { useDispatch } from "react-redux";
import { setTimer, addActivity, setActivities, setActivity, save, load, setSession, resetToDefaultState } from "src/redux/slices/todaySessionSlice";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { Activity, Record, WorkSession } from "src/types/Activity";
import { toast } from "sonner";
import sessionStorageService from "src/services/sessionStorageService";

export default function useTodaySession() {
    const todaySession = useTypedSelector(state => state.todaySession);

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

    const _setTimer = (newTimer: Record) => {
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
        dispatch(resetToDefaultState());
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