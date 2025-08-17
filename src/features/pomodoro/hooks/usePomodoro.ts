import { Pomodoro } from "src/features/pomodoro/types/Pomodoro";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { changeToNextState, reset, update, setEndAlertStatus, save } from "src/features/pomodoro/states/pomodoroSlice";
import { useDispatch } from "react-redux";
import { PomodoroSettings } from "src/features/pomodoro/types/PomodoroSettings";
import { setSettings } from "src/features/pomodoro/states/pomodoroSettingsSlice";


export function usePomodoro() {
    const dispatch = useDispatch();
    const pomodoro = useTypedSelector(state => state.pomodoro);
    const settings = useTypedSelector(state => state.pomodoroSettings);

    function _changeToNextState() {
        dispatch(changeToNextState(settings));
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
        dispatch(update(settings));
        dispatch(save());
    }

    function _setSettings(newSettings: PomodoroSettings) {
        dispatch(setSettings(newSettings));
        dispatch(save());
    }

    return {
        ...pomodoro,
        changeToNextState: _changeToNextState,
        stop: _stop,
        setEndAlertStatus: _setEndAlertStatus,
        update: _update,

        settings,
        setSettings: _setSettings
    };
}