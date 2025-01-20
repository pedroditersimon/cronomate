import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkSessionSettingsType } from "../../types/Activity";
import localSave from "../../services/localSave";


const getNewDefaultState = (): WorkSessionSettingsType => {
    return {
        stopOnClose: true,
        stopOnSessionEnd: true
    };
}

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
            console.log("settings");
        },
        load: (state) => {
            return localSave.load("workSessionSettings", state);
        },

        setSettings: (_state, action: PayloadAction<{ newSettings: WorkSessionSettingsType }>) => {
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
export const {
    save, load,

    setSettings,
    resetToDefaultState,

} = workSessionSettingsSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const workSessionSettingsReducer = workSessionSettingsSlice.reducer;