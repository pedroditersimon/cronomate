import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import { Pomodoro, PomodoroState } from "src/features/pomodoro/types/Pomodoro";
import { getRemainingTime } from "src/features/pomodoro/utils/getRemainingTime";
import localSave from "src/shared/services/localSave";


function getNewDefaultState(): Pomodoro {
    return {
        state: PomodoroState.STOPPED,
        startTime: null,
        remainingMs: 0,
        endAlertStatus: "waiting",
    };
}

const defaultState = getNewDefaultState();
const initialState = localSave.load("pomodoro", defaultState);


const pomodoroSlice = createSlice({
    name: "pomodoro",
    initialState,
    reducers: {
        save: (state) => {
            localSave.save("pomodoro", state);
        },
        load: (state) => {
            return localSave.load("pomodoro", state);
        },

        reset: () => {
            return getNewDefaultState();
        },

        changeToNextState: (pomodoro) => {
            const newState = pomodoro.state === PomodoroState.FOCUS
                ? PomodoroState.REST
                : PomodoroState.FOCUS;

            const nowMs = DateTime.now().toMillis();
            const newRemainingMs = getRemainingTime(nowMs, newState) - 1000;

            return {
                ...pomodoro,
                state: newState,
                startTime: nowMs,
                remainingMs: newRemainingMs,
                endAlertStatus: "waiting",
            };
        },

        setEndAlertStatus: (pomodoro, action: PayloadAction<Pomodoro["endAlertStatus"]>) => {
            return {
                ...pomodoro,
                endAlertStatus: action.payload,
            };
        },

        update: (pomodoro) => {
            if (!pomodoro.startTime) return;
            const newRemainingMs = getRemainingTime(pomodoro.startTime, pomodoro.state);
            return {
                ...pomodoro,
                remainingMs: newRemainingMs,
            };
        }
    },
});

export const pomodoroReducer = pomodoroSlice.reducer;

export const {
    load, save,
    reset,
    changeToNextState,
    setEndAlertStatus,
    update,
} = pomodoroSlice.actions;