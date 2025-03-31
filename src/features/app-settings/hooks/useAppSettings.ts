import { useDispatch } from "react-redux";
import { useTypedSelector } from "src/shared/hooks/useTypedSelector";
import { setSettings } from "src/features/app-settings/states/appSettingsSlice";
import { AppSettings } from "src/features/app-settings/types/AppSettings";

export default function useAppSettings() {
    const appSettings = useTypedSelector(state => state.appSettings);

    const dispatch = useDispatch();

    const setAppSettings = (settings: AppSettings) => {
        dispatch(setSettings(settings));
    }

    return {
        appSettings,
        setAppSettings
    };
}