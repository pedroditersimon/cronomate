import { configureStore } from "@reduxjs/toolkit";

// 1. Importamos nuestros reducers
import { todayActivitiesReducer } from "./slices/todayActivities";

// 2. Configuramos la Store
const store = configureStore({
    reducer: {
        todayActivities: todayActivitiesReducer
    }
});

// 3. Exportamos la store para usarlo en el Provider
export default store;

// 4. Exportamos el tipo de nuestro store, para utilizarlo con useSelector
export type RootState = ReturnType<typeof store.getState>;