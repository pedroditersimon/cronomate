import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityType } from "../../types/Activity";
import { generateId } from "../../utils/generateId";
import { toDate } from "../../utils/TimeUtils";

// 1. Estado incial
const initialState: Array<ActivityType> = [
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
];


// 2. Creamos el slice
const todayActivitiesSlice = createSlice({
    name: "todayActivities",
    initialState,

    // 3. Creamos las acciones (reducers)
    reducers: {
        setActivities: (state, action: PayloadAction<{ newActivities: Array<ActivityType> }>) => {
            const { newActivities } = action.payload;
            return newActivities;
        },
        setActivity: (state, action: PayloadAction<{ newActivity: ActivityType }>) => {
            const { newActivity } = action.payload;
            return state.map(activity =>
                activity.id === newActivity.id ? newActivity : activity
            );
        },
        addNewActivity: (state, action: PayloadAction<{ newActivity: ActivityType }>) => {
            const { newActivity } = action.payload;
            // TODO: check if exists another activity with given id
            return [...state, newActivity];
        }
    },
});

// 4. Exportamos el slice
export { todayActivitiesSlice };

// 5. Exportamos las acciones (reducers)
export const { setActivities, setActivity, addNewActivity } = todayActivitiesSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const todayActivitiesReducer = todayActivitiesSlice.reducer;