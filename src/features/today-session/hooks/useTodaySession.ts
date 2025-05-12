import { useDispatch } from "react-redux";
import { setTimer, addActivity, setActivities, setActivity, save, load, setSession, resetToDefaultState, setEndAlertStatus } from "src/features/today-session/states/todaySessionSlice";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { toast } from "sonner";
import { Session } from "src/features/session/types/Session";
import { SessionTimer } from "src/features/session/types/SessionTimer";
import { Activity } from "src/features/activity/types/Activity";
import sessionStorageService from "src/shared/services/sessionStorageService";
import { TodaySession } from "src/features/today-session/types/TodaySession";


export default function useTodaySession() {
    const todaySession = useTypedSelector(state => state.todaySession);
    const todaySessionSettings = useTypedSelector(state => state.todaySessionSettings);

    const dispatch = useDispatch();

    const saveInHistoryAndReset = () => {
        sessionStorageService.saveItems("History", [todaySession.session]);
        dispatch(resetToDefaultState({ settings: todaySessionSettings }));
        // Ya que se utiliza la variable local 'todaySession',
        // es posible que esta cambie y al guardar no se este guardando lo ultimo que cambio
        toast.success("Sesion guardada en history! Ver comentarios");
    }

    return {
        todaySession,

        save: () => dispatch(save()),
        load: () => dispatch(load()),

        setSession: (session: Session) => dispatch(setSession(session)),

        setTodayTimer: (timer: SessionTimer) => dispatch(setTimer(timer)),

        setActivities: (activities: Activity[]) => dispatch(setActivities(activities)),
        setActivity: (activity: Activity) => dispatch(setActivity(activity)),
        addActivity: (activity: Activity) => dispatch(addActivity(activity)),

        saveInHistoryAndReset,
        resetToDefaultState: () => dispatch(resetToDefaultState({ settings: todaySessionSettings })),

        setEndAlertStatus: (status: TodaySession["endAlertStatus"]) => dispatch(setEndAlertStatus(status))
    };
}