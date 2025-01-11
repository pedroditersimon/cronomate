import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityType, RecordType } from "../../types/Activity";
import { toDate } from "../../utils/TimeUtils";
import activityService from "../../services/activityService";
import { TodayActivitiesState } from "../types/todayActivitiesState";

// 1. Estado incial
const initialState: TodayActivitiesState = {
    timer: {
        id: "todayRecord",
        startTime: toDate()?.getTime(),
        running: true
    },
    activities: [
        {
            id: "1",
            title: "Reunión",
            records: [
                {
                    id: "1",
                    startTime: new Date(toDate().getTime() - 2 * 60 * 60 * 1000).getTime(), // Hace 2 horas
                    endTime: toDate().getTime(), // Hora actual
                    running: true
                }
            ]
        },
        {
            id: "2",
            title: "Actividad",
            records: [
                {
                    id: "1",
                    startTime: new Date(toDate().getTime() - 3 * 60 * 60 * 1000).getTime(), // Hace 3 horas
                    endTime: new Date(toDate().getTime() - 1 * 60 * 60 * 1000).getTime(),
                    running: false
                },
                {
                    id: "2",
                    startTime: new Date(toDate().getTime() - 1 * 60 * 60 * 1000).getTime(), // Hace 3 horas
                    endTime: toDate().getTime(),
                    running: false
                }
            ]
        }
    ]
}


// 2. Creamos el slice
const todayActivitiesSlice = createSlice({
    name: "todayActivities",
    initialState,

    // 3. Creamos las acciones (reducers)
    reducers: {
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
    // Timer
    setTimer,

    // Activities
    setActivities,
    setActivity,
    addActivity
} = todayActivitiesSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const todayActivitiesReducer = todayActivitiesSlice.reducer;