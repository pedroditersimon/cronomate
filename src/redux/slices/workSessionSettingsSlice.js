import { createSlice } from "@reduxjs/toolkit";
import localSave from "src/services/localSave";
const getNewDefaultState = () => {
    return {
        stopOnClose: true,
        stopOnSessionEnd: true
    };
};
// 1. Estado incial
const defaultState = getNewDefaultState();
const initialState = localSave.load("workSessionSettings", defaultState);
// 2. Creamos el slice
const workSessionSettingsSlice = createSlice({
    name: "workSessionSettings",
    initialState,
    // 3. Creamos las acciones (reducers)
    reducers: {
        save: (state) => {
            localSave.save("workSessionSettings", state);
            console.log("saved: workSessionSettings");
        },
        load: (state) => {
            return localSave.load("workSessionSettings", state);
        },
        setSettings: (_state, action) => {
            const { newSettings } = action.payload;
            return newSettings;
        },
        resetToDefaultState: () => {
            const newState = getNewDefaultState();
            localSave.save("workSessionSettings", newState);
            return newState;
        },
    },
});
// 4. Exportamos el slice
export { workSessionSettingsSlice };
// 5. Exportamos las acciones (reducers)
export const { save, load, setSettings, resetToDefaultState, } = workSessionSettingsSlice.actions;
// 6. Exportamos el reducer para configurar la Store
export const workSessionSettingsReducer = workSessionSettingsSlice.reducer;
