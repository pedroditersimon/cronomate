import { configureStore } from "@reduxjs/toolkit";

// 1. Importamos nuestros reducers
import { todaySessionReducer } from "./slices/todaySessionSlice";
import { workSessionSettingsReducer } from "./slices/workSessionSettingsSlice";

// 2. Configuramos la Store
const store = configureStore({
    reducer: {
        todaySession: todaySessionReducer,
        workSessionSettings: workSessionSettingsReducer
    }
});

// 3. Exportamos la store para usarlo en el Provider
export default store;

// 4. Exportamos el tipo de nuestro store, para utilizarlo con useSelector
export type RootState = ReturnType<typeof store.getState>;