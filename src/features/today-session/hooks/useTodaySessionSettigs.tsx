import { useDispatch } from "react-redux";
import { save, load, setSettings, resetToDefaultState } from "src/features/today-session/states/todaySessionSettingsSlice";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { TodaySessionSettings } from "src/features/today-session/types/TodaySessionSettings";


export default function useTodaySessionSettigs() {
    const todaySessionSettings = useTypedSelector(state => state.todaySessionSettings);

    const dispatch = useDispatch();

    const _save = () => {
        dispatch(save());
    }

    const _load = () => {
        dispatch(load());
    }

    const _setSettings = (newSettings: TodaySessionSettings) => {
        dispatch(setSettings({ newSettings }));
    }

    const _resetToDefault = () => {
        dispatch(resetToDefaultState());
    }

    return {
        todaySessionSettings,

        save: _save,
        load: _load,

        setSettings: _setSettings,
        resetToDefault: _resetToDefault
    };
}