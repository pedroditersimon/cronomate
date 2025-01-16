import { useDispatch } from "react-redux";
import { setTimer, addActivity, setActivities, setActivity, save, load, setSession, resetToDefaultState } from "../redux/slices/todaySession";
import { useTypedSelector } from "./useTypedSelector";
import { ActivityType, RecordType, WorkSessionType } from "../types/Activity";
import indexedDBSave from "../services/indexedDBSave";
import { toast } from "sonner";

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

    const saveInHistoryAndReset = () => {
        indexedDBSave.saveItems("History", [todaySession]);
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