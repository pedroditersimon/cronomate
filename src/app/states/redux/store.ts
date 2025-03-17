import { configureStore } from "@reduxjs/toolkit";

// 1. Importamos nuestros reducers
import { todaySessionReducer } from "src/features/today-session/states/todaySessionSlice";
import { todaySessionSettingsReducer } from "src/features/today-session/states/todaySessionSettingsSlice";

// 2. Configuramos la Store
const store = configureStore({
    reducer: {
        todaySession: todaySessionReducer,
        todaySessionSettings: todaySessionSettingsReducer
    }
});

// 3. Exportamos la store para usarlo en el Provider
export default store;

// 4. Exportamos el tipo de nuestro store, para utilizarlo con useSelector
export type RootState = ReturnType<typeof store.getState>;