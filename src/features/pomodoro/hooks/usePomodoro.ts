import { Pomodoro } from "src/features/pomodoro/types/Pomodoro";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { changeToNextState, reset, update, setEndAlertStatus, save } from "src/features/pomodoro/states/pomodoroSlice";
import { useDispatch } from "react-redux";


export function usePomodoro() {
    const dispatch = useDispatch();
    const pomodoro = useTypedSelector(state => state.pomodoro);

    function _changeToNextState() {
        dispatch(changeToNextState());
        dispatch(save());
    }

    function _stop() {
        dispatch(reset());
        dispatch(save());
    }

    function _setEndAlertStatus(status: Pomodoro["endAlertStatus"]) {
        dispatch(setEndAlertStatus(status));
        dispatch(save());
    }

    function _update() {
        dispatch(update());
        dispatch(save());
    }

    return {
        ...pomodoro,
        changeToNextState: _changeToNextState,
        stop: _stop,
        setEndAlertStatus: _setEndAlertStatus,
        update: _update,
    };
}