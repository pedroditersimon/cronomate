import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PomodoroSettings } from "src/features/pomodoro/types/PomodoroSettings";
import localSave from "src/shared/services/localSave";

function getNewDefaultState(): PomodoroSettings {
    return {
        focusDurationMs: 25 * 60 * 1000, // 25 minutes
        // restDurationMs: 5 * 60 * 1000, // 5 minutes
        restDurationMs: 3 * 1000, // 5 minutes
        continueOnEnd: false,
        alertOnRemainingMs: 60 * 1000, // 1 minute
    };
}

const defaultState = getNewDefaultState();
const initialState = localSave.load("pomodoroSettings", defaultState);


const pomodoroSettingsSlice = createSlice({
    name: "pomodoroSettings",
    initialState,
    reducers: {
        save: (state) => {
            localSave.save("pomodoroSettings", state);
        },
        load: (state) => {
            return localSave.load("pomodoroSettings", state);
        },

        setSettings: (_state, action: PayloadAction<PomodoroSettings>) => {
            const newState = action.payload;
            localSave.save("pomodoroSettings", newState);
            return newState;
        },

        resetToDefaultState: () => {
            const newState = getNewDefaultState();
            localSave.save("pomodoroSettings", newState);
            return newState;
        },
    },
});

export const pomodoroSettingsReducer = pomodoroSettingsSlice.reducer;

export const {
    load, save,
    setSettings,
    resetToDefaultState,
} = pomodoroSettingsSlice.actions;