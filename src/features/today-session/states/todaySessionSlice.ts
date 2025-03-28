import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import activityService from "src/features/activity/services/activityService";
import { Activity } from "src/features/activity/types/Activity";
import { TimeTrackStatus } from "src/features/time-track/types/TimeTrack";
import { WorkSession } from "src/features/work-session/types/WorkSession";
import { WorkSessionTimer } from "src/features/work-session/types/WorkSessionTimer";
import localSave from "src/shared/services/localSave";
import { generateId } from "src/shared/utils/generateId";
import { TodaySessionSettings } from "src/features/today-session/types/TodaySessionSettings";
import { DateTime } from "luxon";


function getNewDefaultState(previousState?: WorkSession, settings?: TodaySessionSettings): WorkSession {

    const currentDate = DateTime.now();

    // Desplazar a la fecha de hoy manteniendo hora, minuto y segundo.
    function adjustToCurrentDate(timestamp: number | null) {
        if (timestamp === null) return null;

        const originalDate = DateTime.fromMillis(timestamp);
        if (!originalDate.isValid) return null;

        const { hour, minute, second } = originalDate;
        return currentDate.set({ hour, minute, second }).toMillis();
    }

    // Restaurar overrides del estado anterior
    const shouldRestoreOverrides = previousState && settings?.saveTimerOverrides;

    const startOverride = shouldRestoreOverrides
        ? adjustToCurrentDate(previousState.timer.startOverride)
        : null;

    const endOverride = shouldRestoreOverrides
        ? adjustToCurrentDate(previousState.timer.endOverride)
        : null;


    return {
        id: generateId(),
        createdTimeStamp: currentDate.toMillis(),
        timer: {
            id: generateId(),
            start: currentDate.toMillis(),
            end: null,
            status: TimeTrackStatus.STOPPED,
            startOverride: startOverride,
            endOverride: endOverride,
        },
        activities: [],
    };
}

// 1. Estado incial
const defaultState = getNewDefaultState();

const initialState = localSave.load("todaySession", defaultState);

// 2. Creamos el slice
const todaySessionSlice = createSlice({
    name: "todaySession",
    initialState,

    // 3. Creamos las acciones (reducers)
    reducers: {
        save: (state, action: PayloadAction<{ session?: WorkSession }>) => {
            const { session } = action.payload;
            localSave.save("todaySession", session || state);
            console.log("saved: todaySession");
        },
        load: (state) => {
            return localSave.load("todaySession", state);
        },

        resetToDefaultState: (state, action: PayloadAction<{ settings?: TodaySessionSettings }>) => {
            const { settings } = action.payload;
            const newState = getNewDefaultState(state, settings);
            localSave.save("todaySession", newState);
            return newState;
        },

        setSession: (_state, action: PayloadAction<{ newSession: WorkSession }>) => {
            const { newSession } = action.payload;
            return newSession;
        },

        // Timer
        setTimer: (state, action: PayloadAction<{ newTimer: WorkSessionTimer }>) => {
            return {
                ...state,
                timer: action.payload.newTimer
            };
        },

        // Activities
        setActivities: (state, action: PayloadAction<{ newActivities: Array<Activity> }>) => {
            const { newActivities } = action.payload;
            return {
                ...state,
                activities: newActivities
            };
        },
        setActivity: (state, action: PayloadAction<{ newActivity: Activity }>) => {
            const { newActivity } = action.payload;
            return {
                ...state,
                activities: activityService.set(state.activities, newActivity)
            };
        },
        addActivity: (state, action: PayloadAction<{ newActivity: Activity }>) => {
            const { newActivity } = action.payload;
            return {
                ...state,
                activities: activityService.add(state.activities, newActivity)
            };
        }
    },
});

// 4. Exportamos el slice
export { todaySessionSlice };

// 5. Exportamos las acciones (reducers)
export const {
    save, load,

    setSession,
    resetToDefaultState,

    // Timer
    setTimer,

    // Activities
    setActivities,
    setActivity,
    addActivity,

} = todaySessionSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const todaySessionReducer = todaySessionSlice.reducer;