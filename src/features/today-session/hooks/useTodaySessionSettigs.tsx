import { useDispatch } from "react-redux";
import { save, load, setSettings, resetToDefaultState } from "src/redux/slices/workSessionSettingsSlice";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { WorkSessionSettingsType } from "src/types/Activity";


export default function useWorkSessionSettigs() {
    const workSessionSettings = useTypedSelector(state => state.workSessionSettings);

    const dispatch = useDispatch();

    const _save = () => {
        dispatch(save());
    }

    const _load = () => {
        dispatch(load());
    }

    const _setSettings = (newSettings: WorkSessionSettingsType) => {
        dispatch(setSettings({ newSettings }));
    }

    const _resetToDefault = () => {
        dispatch(resetToDefaultState());
    }

    return {
        workSessionSettings,

        save: _save,
        load: _load,

        setSettings: _setSettings,
        resetToDefault: _resetToDefault
    };
}