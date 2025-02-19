import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityType, RecordType, WorkSessionType } from "src/types/Activity";
import activityService from "src/services/activityService";
import localSave from "src/services/localSave";
import { generateId } from "src/utils/generateId";
//import { workSessionSettingsSlice } from "./workSessionSettingsSlice";


//const workSessionSettings = workSessionSettingsSlice.getInitialState();

const getNewDefaultState = (): WorkSessionType => {
    return {
        id: generateId(),
        createdTimeStamp: new Date().getTime(),
        timer: {
            id: generateId()
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
        save: (state, action: PayloadAction<{ session?: WorkSessionType }>) => {
            const { session } = action.payload;
            localSave.save("todaySession", session || state);
            console.log("saved: todaySession");
            console.log(state);
        },
        load: (state) => {
            return localSave.load("todaySession", state);
        },

        resetToDefaultState: () => {
            const newState = getNewDefaultState();
            localSave.save("todaySession", newState);
            return newState;
        },

        setSession: (_state, action: PayloadAction<{ newSession: WorkSessionType }>) => {
            const { newSession } = action.payload;
            return newSession;
        },

        // Timer
        setTimer: (state, action: PayloadAction<{ newTimer: RecordType }>) => {
            return {
                ...state,
                timer: action.payload.newTimer
            };
        },

        // Activities
        setActivities: (state, action: PayloadAction<{ newActivities: Array<ActivityType> }>) => {
            const { newActivities } = action.payload;
            return {
                ...state,
                activities: newActivities
            };
        },
        setActivity: (state, action: PayloadAction<{ newActivity: ActivityType }>) => {
            const { newActivity } = action.payload;
            return {
                ...state,
                activities: activityService.set(state.activities, newActivity)
            };
        },
        addActivity: (state, action: PayloadAction<{ newActivity: ActivityType }>) => {
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