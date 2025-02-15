import { createSlice } from "@reduxjs/toolkit";
import activityService from "src/services/activityService";
import localSave from "src/services/localSave";
import { generateId } from "src/utils/generateId";
//import { workSessionSettingsSlice } from "./workSessionSettingsSlice";
//const workSessionSettings = workSessionSettingsSlice.getInitialState();
const getNewDefaultState = () => {
    return {
        id: generateId(),
        createdTimeStamp: new Date().getTime(),
        timer: {
            id: generateId()
        },
        activities: [],
    };
};
// 1. Estado incial
const defaultState = getNewDefaultState();
const initialState = localSave.load("todaySession", defaultState);
// 2. Creamos el slice
const todaySessionSlice = createSlice({
    name: "todaySession",
    initialState,
    // 3. Creamos las acciones (reducers)
    reducers: {
        save: (state, action) => {
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
        setSession: (_state, action) => {
            const { newSession } = action.payload;
            return newSession;
        },
        // Timer
        setTimer: (state, action) => {
            return Object.assign(Object.assign({}, state), { timer: action.payload.newTimer });
        },
        // Activities
        setActivities: (state, action) => {
            const { newActivities } = action.payload;
            return Object.assign(Object.assign({}, state), { activities: newActivities });
        },
        setActivity: (state, action) => {
            const { newActivity } = action.payload;
            return Object.assign(Object.assign({}, state), { activities: activityService.set(state.activities, newActivity) });
        },
        addActivity: (state, action) => {
            const { newActivity } = action.payload;
            return Object.assign(Object.assign({}, state), { activities: activityService.add(state.activities, newActivity) });
        }
    },
});
// 4. Exportamos el slice
export { todaySessionSlice };
// 5. Exportamos las acciones (reducers)
export const { save, load, setSession, resetToDefaultState, 
// Timer
setTimer, 
// Activities
setActivities, setActivity, addActivity, } = todaySessionSlice.actions;
// 6. Exportamos el reducer para configurar la Store
export const todaySessionReducer = todaySessionSlice.reducer;
