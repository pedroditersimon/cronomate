import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppSettings } from "src/features/app-settings/types/AppSettings";
import localSave from "src/shared/services/localSave";

function getNewDefaultState(): AppSettings {
    return {
        soundsEnabled: true,
    };
}


const defaultState = getNewDefaultState();
const initialState = localSave.load("appSettings", defaultState);


const appSettingsSlice = createSlice({
    name: "appSettings",
    initialState,
    reducers: {
        save: (state) => {
            localSave.save("appSettings", state);
        },
        load: (state) => {
            return localSave.load("appSettings", state);
        },

        setSettings: (_, action: PayloadAction<AppSettings>) => {
            const newState = action.payload;
            localSave.save("appSettings", newState);
            return newState;
        }
    }
});

export { appSettingsSlice };
export const appSettingsReducer = appSettingsSlice.reducer;

// expormaos Acciones (reducers)
export const {
    setSettings
} = appSettingsSlice.actions;