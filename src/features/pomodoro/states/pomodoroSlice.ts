import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import pomodoroService from "src/features/pomodoro/services/pomodoroService";
import { Pomodoro, PomodoroState } from "src/features/pomodoro/types/Pomodoro";
import { PomodoroSettings } from "src/features/pomodoro/types/PomodoroSettings";
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

        changeToNextState: (pomodoro, action: PayloadAction<PomodoroSettings>) => {
            return pomodoroService.changeToNextState(pomodoro, action.payload);
        },

        setEndAlertStatus: (pomodoro, action: PayloadAction<Pomodoro["endAlertStatus"]>) => {
            return {
                ...pomodoro,
                endAlertStatus: action.payload,
            };
        },

        update: (pomodoro, action: PayloadAction<PomodoroSettings>) => {
            if (!pomodoro.startTime) return;

            // get settings
            const {
                focusDurationMs, restDurationMs,
                continueOnEnd
            } = action.payload;

            const maxDurationMs = pomodoro.state === PomodoroState.FOCUS
                ? focusDurationMs
                : restDurationMs;

            const newRemainingMs = getRemainingTime(pomodoro.startTime, maxDurationMs);

            // move to next state if settings says so
            if (continueOnEnd && newRemainingMs < 0) {
                return pomodoroService.changeToNextState(pomodoro, action.payload);
            }

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