import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityType } from "../../types/Activity";

// 1. Estado incial
const initialState: Array<ActivityType> = [
    {
        id: "1",
        title: "Reunión",
        records: [
            {
                id: "1",
                startTime: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // Hace 2 horas
                endTime: new Date(), // Hora actual
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
                startTime: new Date(new Date().getTime() - 3 * 60 * 60 * 1000), // Hace 3 horas
                endTime: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
                running: false
            },
            {
                id: "2",
                startTime: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), // Hace 3 horas
                endTime: new Date(),
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
        setActivity: (state, action: PayloadAction<{ id: string, newActivity: ActivityType }>) => {
            const { id, newActivity } = action.payload;
            return state.map(activity =>
                activity.id === id ? newActivity : activity
            );
        }
    },
});

// 4. Exportamos el slice
export { todayActivitiesSlice };

// 5. Exportamos las acciones (reducers)
export const { setActivity } = todayActivitiesSlice.actions;

// 6. Exportamos el reducer para configurar la Store
export const todayActivitiesReducer = todayActivitiesSlice.reducer;