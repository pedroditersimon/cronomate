import { useDispatch } from "react-redux";
import { save, load, setSettings, resetToDefaultState } from "src/redux/slices/workSessionSettingsSlice";
import { useTypedSelector } from "./useTypedSelector";
export default function useWorkSessionSettigs() {
    const workSessionSettings = useTypedSelector(state => state.workSessionSettings);
    const dispatch = useDispatch();
    const _save = () => {
        dispatch(save());
    };
    const _load = () => {
        dispatch(load());
    };
    const _setSettings = (newSettings) => {
        dispatch(setSettings({ newSettings }));
    };
    const _resetToDefault = () => {
        dispatch(resetToDefaultState());
    };
    return {
        workSessionSettings,
        save: _save,
        load: _load,
        setSettings: _setSettings,
        resetToDefault: _resetToDefault
    };
}
