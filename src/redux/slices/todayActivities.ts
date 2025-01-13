import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityType, RecordType } from "../../types/Activity";
import activityService from "../../services/activityService";
import { TodayActivitiesState } from "../types/todayActivitiesState";
import localSave from "../../services/localSave";


// 1. Estado incial
const defaultState: TodayActivitiesState = {
    createdTimeStamp: new Date().getTime(),
    timer: { id: "todayRecord" },
    activities: []
}

const initialState = localSave.load("todayActivities", defaultState);

// 2. Creamos el slice
const todayActivitiesSlice = createSlice({
    name: "todayActivities",
    initialState,

    // 3. Creamos las acciones (reducers)
    reducers: {
        save: (state) => {
            localSave.save("todayActivities", state);
        },
        load: (state) => {
            return localSave.load("todayActivities", state);
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
export { todayActivitiesSlice };

// 5. Exportamos las acciones (reducers)
export const {
    save, load,

    // Timer
    setTimer,

    // Activities
    setActivities,
    setActivity,
    addActivity,

} = todayActivitiesSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const todayActivitiesReducer = todayActivitiesSlice.reducer;