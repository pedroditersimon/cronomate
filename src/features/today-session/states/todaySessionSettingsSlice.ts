import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodaySessionSettings } from "../types/TodaySessionSettings";
import localSave from "src/shared/services/localSave";


const getNewDefaultState = (): TodaySessionSettings => {
    return {
        stopOnClose: true,
        stopOnSessionEnd: true,
        saveSessionLimits: false,
    };
}

// 1. Estado incial
const defaultState = getNewDefaultState();

const initialState = localSave.load("todaySessionSettings", defaultState);

// 2. Creamos el slice
const todaySessionSettingsSlice = createSlice({
    name: "todaySessionSettings",
    initialState,

    // 3. Creamos las acciones (reducers)
    reducers: {
        save: (state) => {
            localSave.save("todaySessionSettings", state);
            console.log("saved: todaySessionSettings");
        },
        load: (state) => {
            return localSave.load("todaySessionSettings", state);
        },

        setSettings: (_state, action: PayloadAction<{ newSettings: TodaySessionSettings }>) => {
            const { newSettings } = action.payload;
            return newSettings;
        },

        resetToDefaultState: () => {
            const newState = getNewDefaultState();
            localSave.save("todaySessionSettings", newState);
            return newState;
        },
    },
});

// 4. Exportamos el slice
export { todaySessionSettingsSlice };

// 5. Exportamos las acciones (reducers)
export const {
    save, load,

    setSettings,
    resetToDefaultState,

} = todaySessionSettingsSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const todaySessionSettingsReducer = todaySessionSettingsSlice.reducer;