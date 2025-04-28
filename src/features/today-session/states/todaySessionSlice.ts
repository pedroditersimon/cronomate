import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import activityService from "src/features/activity/services/activityService";
import { Activity } from "src/features/activity/types/Activity";
import { Session } from "src/features/session/types/Session";
import { SessionTimer } from "src/features/session/types/SessionTimer";
import localSave from "src/shared/services/localSave";
import { generateId } from "src/shared/utils/generateId";
import { TodaySessionSettings } from "src/features/today-session/types/TodaySessionSettings";
import { DateTime } from "luxon";
import { TodaySession } from "src/features/today-session/types/TodaySession";

// TODO: Mover a un mejor lugar
function getNewDefaultState(previousState?: TodaySession, settings?: TodaySessionSettings): TodaySession {

    const previousSession = previousState?.session;
    const currentDate = DateTime.now();

    // Restaurar limites del estado anterior
    const shouldRestoreLimits = previousSession && settings?.saveSessionLimits;

    const durationLimit = (shouldRestoreLimits
        // restore
        ? {
            start: previousSession.durationLimit?.start ?? null,
            end: previousSession.durationLimit?.end ?? null,
            millis: previousSession.durationLimit?.millis ?? null,
        }
        // default
        : {}
    ) as Session["durationLimit"];


    return {
        session: {
            id: generateId(),
            createdTimestamp: currentDate.toMillis(),
            activities: [],
            durationLimit,
            inactivityThresholdMs: previousSession?.inactivityThresholdMs ?? 60 * 60 * 1000, // default 1h
        },
        endAlertStatus: "waiting",
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
        save: (state) => {
            localSave.save("todaySession", state);
            return state;
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

        setSession: (state, action: PayloadAction<Session>) => {
            const newSession = action.payload;
            return {
                ...state,
                session: newSession
            };
        },

        // Timer
        setTimer: (state, action: PayloadAction<SessionTimer>) => {
            const newTimer = action.payload;
            return {
                ...state,
                session: {
                    ...state.session,
                    timer: newTimer
                }
            };
        },

        // Activities
        setActivities: (state, action: PayloadAction<Activity[]>) => {
            const newActivities = action.payload;
            return {
                ...state,
                session: {
                    ...state.session,
                    activities: newActivities
                }
            };
        },
        setActivity: (state, action: PayloadAction<Activity>) => {
            const newActivity = action.payload;
            return {
                ...state,
                session: {
                    ...state.session,
                    activities: activityService.set(state.session.activities, newActivity)
                }
            };
        },
        addActivity: (state, action: PayloadAction<Activity>) => {
            const newActivity = action.payload;
            return {
                ...state,
                session: {
                    ...state.session,
                    activities: activityService.add(state.session.activities, newActivity)
                }
            };
        },

        // endAlertStatus
        setEndAlertStatus: (state, action: PayloadAction<TodaySession["endAlertStatus"]>) => {
            const endAlertStatus = action.payload;
            return {
                ...state,
                endAlertStatus,
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

    setEndAlertStatus,

} = todaySessionSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const todaySessionReducer = todaySessionSlice.reducer;